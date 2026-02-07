import { cookies } from "next/headers";
import { prisma } from "./db";

export async function getSession() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId) return null;
  
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;
  
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export async function setSession(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set("userId", userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete("userId");
}
