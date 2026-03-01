import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { writeFile } from "fs/promises";
import { join } from "path";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const documentId = formData.get("documentId") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${nanoid()}-${file.name}`;
    const filePath = join(process.cwd(), "uploads", fileName);
    
    await writeFile(filePath, buffer);

    const version = await prisma.documentVersion.create({
      data: {
        documentId,
        version: 1,
        storageKey: fileName,
        fileName: file.name,
        mimeType: file.type,
        size: file.size,
        uploadedBy: session.userId,
      },
    });

    return NextResponse.json({ success: true, versionId: version.id });
  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
