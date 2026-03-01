import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, tags, folderId, documentTypeId } = await req.json();

    const document = await prisma.document.create({
      data: {
        name,
        description,
        tags,
        folderId,
        documentTypeId,
        ownerId: session.userId,
        status: "active",
      },
    });

    return NextResponse.json({ document });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create document" }, { status: 500 });
  }
}
