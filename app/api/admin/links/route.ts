import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { requireAdminKey } from "@/lib/adminAuth";

const CreateBody = z.object({
  password: z.string().min(6),
  projectId: z.string().optional().nullable(),
});

export async function GET(req: Request) {
  const auth = requireAdminKey(req);
  if (auth) return auth;

  const links = await prisma.secureLink.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      tokenHash: true,
      isActive: true,
      createdAt: true,
      revokedAt: true,
      projectId: true,
      project: { select: { referenceCode: true, name: true } },
      _count: { select: { uploads: true } },
    },
  });

  return NextResponse.json({ links });
}

export async function POST(req: Request) {
  const auth = requireAdminKey(req);
  if (auth) return auth;

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0]?.trim() || null;
  const ua = req.headers.get("user-agent") || null;

  const json = await req.json().catch(() => null);
  const parsed = CreateBody.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const token = nanoid(28);
  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  const link = await prisma.secureLink.create({
    data: {
      tokenHash: token,
      passwordHash,
      projectId: parsed.data.projectId ?? null,
      isActive: true,
    },
    select: { id: true, tokenHash: true, createdAt: true, projectId: true },
  });

  await logAudit({
    actorType: "admin",
    action: "admin_link_created",
    metadata: { linkId: link.id, projectId: link.projectId },
    ip,
    userAgent: ua,
  });

  const portalBase = (process.env.NEXT_PUBLIC_PORTAL_URL ?? "https://portal.celestine.com").replace(/\/$/, "");

  return NextResponse.json({
    link: {
      id: link.id,
      token: link.tokenHash,
      url: `${portalBase}/portal/${link.tokenHash}`,
      createdAt: link.createdAt,
    },
  });
}

const PatchBody = z.object({
  id: z.string().min(1),
  action: z.enum(["pause", "resume", "revoke", "reset_password"]),
  newPassword: z.string().min(6).optional(),
});

export async function PATCH(req: Request) {
  const auth = requireAdminKey(req);
  if (auth) return auth;

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0]?.trim() || null;
  const ua = req.headers.get("user-agent") || null;

  const json = await req.json().catch(() => null);
  const parsed = PatchBody.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const { id, action, newPassword } = parsed.data;

  const existing = await prisma.secureLink.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "not_found" }, { status: 404 });

  if (action === "pause") {
    await prisma.secureLink.update({ where: { id }, data: { isActive: false } });
  } else if (action === "resume") {
    await prisma.secureLink.update({ where: { id }, data: { isActive: true } });
  } else if (action === "revoke") {
    await prisma.secureLink.update({ where: { id }, data: { isActive: false, revokedAt: new Date() } });
  } else if (action === "reset_password") {
    if (!newPassword) return NextResponse.json({ error: "newPassword_required" }, { status: 400 });
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.secureLink.update({ where: { id }, data: { passwordHash } });
  }

  await logAudit({
    actorType: "admin",
    action: `admin_link_${action}`,
    metadata: { linkId: id },
    ip,
    userAgent: ua,
  });

  return NextResponse.json({ ok: true });
}
