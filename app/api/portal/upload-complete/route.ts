import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";

const Body = z.object({ uploadId: z.string().min(1) });

export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0]?.trim() || null;
  const ua = req.headers.get("user-agent") || null;

  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });

  const upload = await prisma.upload.findUnique({ where: { id: parsed.data.uploadId } });
  if (!upload) return NextResponse.json({ ok: false }, { status: 404 });

  await logAudit({
    actorType: "external",
    action: "portal_upload_completed",
    metadata: { uploadId: upload.id, linkId: upload.linkId, storageKey: upload.storageKey },
    ip,
    userAgent: ua,
  });

  return NextResponse.json({ ok: true });
}
