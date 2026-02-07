import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { rateLimit } from "@/lib/rateLimit";

const Body = z.object({
  token: z.string().min(8),
  password: z.string().min(1),
  uploaderName: z.string().min(2),
  uploaderEmail: z.string().email(),
});

export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0]?.trim() || null;
  const ua = req.headers.get("user-agent") || null;

  const limited = rateLimit(`portal_verify:${ip ?? "unknown"}`, Number(process.env.PORTAL_RATE_LIMIT_PER_MIN ?? 10));
  if (!limited.ok) {
    await logAudit({ actorType: "external", action: "portal_rate_limited", ip, userAgent: ua });
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });

  const { token, password, uploaderEmail, uploaderName } = parsed.data;

  const link = await prisma.secureLink.findFirst({
    where: { tokenHash: token, isActive: true, revokedAt: null },
    select: { id: true, passwordHash: true, projectId: true },
  });

  if (!link) {
    await logAudit({ actorType: "external", action: "portal_link_not_found", metadata: { token }, ip, userAgent: ua });
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  const ok = await bcrypt.compare(password, link.passwordHash);

  await logAudit({
    actorType: "external",
    action: ok ? "portal_password_success" : "portal_password_failed",
    metadata: { linkId: link.id, uploaderEmail, uploaderName },
    ip,
    userAgent: ua,
  });

  return NextResponse.json({ ok, linkId: ok ? link.id : undefined, projectId: ok ? link.projectId : undefined });
}
