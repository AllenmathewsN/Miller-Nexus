import { NextResponse } from "next/server";

export function requireAdminKey(req: Request) {
  const expected = process.env.ADMIN_API_KEY;
  if (!expected) {
    return NextResponse.json({ error: "ADMIN_API_KEY not configured" }, { status: 500 });
  }
  const got = req.headers.get("x-admin-key");
  if (!got || got !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return null;
}
