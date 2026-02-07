import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { setSession } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    
    await setSession(user.id);
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
