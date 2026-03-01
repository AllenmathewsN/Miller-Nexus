import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { getPresignedPutUrl } from "@/lib/storage";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { documentId, fileName, contentType, size } = await req.json();

    const storageKey = `documents/${documentId}/${nanoid()}-${fileName}`;
    const uploadUrl = await getPresignedPutUrl(storageKey, contentType);

    const version = await prisma.documentVersion.create({
      data: {
        documentId,
        version: 1,
        storageKey,
        fileName,
        mimeType: contentType,
        size,
        uploadedBy: session.userId,
      },
    });

    return NextResponse.json({ uploadUrl, versionId: version.id });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
  }
}
