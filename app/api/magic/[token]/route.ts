import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request, { params }: { params: { token: string } }) {
  try {
    const magicLink = await prisma.magicLink.findUnique({
      where: { token: params.token },
      include: {
        document: {
          include: {
            documentType: true,
            versions: { orderBy: { version: "desc" }, take: 1 },
          },
        },
      },
    });

    if (!magicLink) {
      return NextResponse.json({ error: "Invalid link" }, { status: 404 });
    }

    if (magicLink.status !== "active") {
      return NextResponse.json({ error: "Link has been deactivated" }, { status: 403 });
    }

    if (new Date() > magicLink.expiresAt) {
      await prisma.magicLink.update({
        where: { id: magicLink.id },
        data: { status: "expired" },
      });
      return NextResponse.json({ error: "Link has expired" }, { status: 403 });
    }

    if (magicLink.usedCount >= magicLink.maxUses) {
      return NextResponse.json({ error: "Link usage limit reached" }, { status: 403 });
    }

    return NextResponse.json({ document: magicLink.document, customMessage: magicLink.customMessage });
  } catch (error) {
    return NextResponse.json({ error: "Validation failed" }, { status: 500 });
  }
}
