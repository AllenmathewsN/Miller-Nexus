import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { nanoid } from "nanoid";
import { sendMagicLinkEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, documentId, permissions, expiryDays, maxUses, customMessage } = await req.json();

    const document = await prisma.document.findUnique({
      where: { id: documentId },
      select: { name: true },
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const token = nanoid(32);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (expiryDays || 7));

    const magicLink = await prisma.magicLink.create({
      data: {
        token,
        email,
        documentId,
        permissions: permissions || "view",
        expiresAt,
        maxUses: maxUses || 1,
        customMessage,
        createdBy: session.userId,
      },
    });

    const linkUrl = `${process.env.NEXT_PUBLIC_PORTAL_URL || 'http://localhost:3000'}/magic/${token}`;

    // Send email
    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    await sendMagicLinkEmail({
      to: email,
      magicUrl: linkUrl,
      documentName: document.name,
      expiryDays: expiryDays || 7,
      customMessage,
      senderName: user?.name || "Admin",
    });

    return NextResponse.json({ magicLink, linkUrl });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create magic link" }, { status: 500 });
  }
}
