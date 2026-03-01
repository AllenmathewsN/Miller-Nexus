import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const versionId = searchParams.get("versionId");

    if (!versionId) {
      return NextResponse.json({ error: "Version ID required" }, { status: 400 });
    }

    const version = await prisma.documentVersion.findUnique({
      where: { id: versionId },
    });

    if (!version) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const filePath = join(process.cwd(), "uploads", version.storageKey);
    const fileBuffer = await readFile(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": version.mimeType,
        "Content-Disposition": `attachment; filename="${version.fileName}"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}
