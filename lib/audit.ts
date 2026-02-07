import { prisma } from "@/lib/db";
export async function logAudit(args: {
  actorType: "admin" | "external" | "system";
  actorId?: string | null;
  action: string;
  metadata?: Record<string, unknown>;
  ip?: string | null;
  userAgent?: string | null;
}) {
  await prisma.auditLog.create({
    data: {
      actorType: args.actorType,
      actorId: args.actorId ?? null,
      action: args.action,
      metadata: args.metadata ?? undefined,
      ip: args.ip ?? null,
      userAgent: args.userAgent ?? null,
    },
  });
}
