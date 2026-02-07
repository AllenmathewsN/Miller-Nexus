import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { getPresignedPutUrl } from "@/lib/storage";
import { nanoid } from "nanoid";

const Body = z.object({
  linkId: z.string().min(1),
  filename: z.string().min(1),
  mimeType: z.string().min(1),
  size: z.number().int().positive().max(200 * 1024 * 1024),
  uploaderName: z.string().min(2),
  uploaderEmail: z.string().email(),
  notes: z.string().optional(),
});

const allowed = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "image/png",
  "image/jpeg",
]);

export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0]?.trim() || null;
  const ua = req.headers.get("user-agent") || null;

  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const { linkId, filename, mimeType, size, uploaderEmail, uploaderName, notes } = parsed.data;
  if (!allowed.has(mimeType)) return NextResponse.json({ error: "unsupported_type" }, { status: 400 });

  const link = await prisma.secureLink.findFirst({
    where: { id: linkId, isActive: true, revokedAt: null },
    select: { id: true, projectId: true },
  });
  if (!link) return NextResponse.json({ error: "link_not_found" }, { status: 404 });

  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storageKey = `uploads/${linkId}/${nanoid(10)}-${safeName}`;

  const url = await getPresignedPutUrl(storageKey, mimeType);

  const upload = await prisma.upload.create({
    data: {
      linkId: link.id,
      projectId: link.projectId,
      originalFilename: filename,
      mimeType,
      size,
      storageKey,
      uploaderEmail,
      uploaderName,
      notes: notes ?? null,
      uploaderIp: ip,
      userAgent: ua,
    },
    select: { id: true },
  });

  await logAudit({
    actorType: "external",
    action: "portal_upload_url_issued",
    metadata: { linkId, uploadId: upload.id, filename, size },
    ip,
    userAgent: ua,
  });

  return NextResponse.json({ url, uploadId: upload.id });
}
