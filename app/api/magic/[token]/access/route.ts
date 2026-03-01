import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request, { params }: { params: { token: string } }) {
  try {
    const { ipAddress, userAgent } = await req.json();

    const magicLink = await prisma.magicLink.findUnique({
      where: { token: params.token },
    });

    if (!magicLink) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    await prisma.magicLink.update({
      where: { token: params.token },
      data: {
        lastAccessedAt: new Date(),
        usedCount: { increment: 1 },
        status: magicLink.usedCount + 1 >= magicLink.maxUses ? "used" : "active",
      },
    });

    await prisma.magicLinkUsage.create({
      data: {
        magicLinkId: magicLink.id,
        ipAddress,
        userAgent,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to log access" }, { status: 500 });
  }
}
