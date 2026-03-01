import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const folders = await prisma.caseFolder.findMany({
      include: {
        category: true,
        owner: { select: { name: true, email: true } },
        _count: { select: { documents: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ folders });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch folders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, categoryId } = await req.json();

    const folder = await prisma.caseFolder.create({
      data: {
        name,
        description,
        categoryId,
        ownerId: session.userId,
      },
      include: { category: true },
    });

    return NextResponse.json({ folder });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create folder" }, { status: 500 });
  }
}
