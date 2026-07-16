import { NextRequest, NextResponse } from "next/server";
import { verifyCredentials, createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const user = await verifyCredentials(email, password);
  if (!user) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  await createSession({ userId: user.id, email: user.email, role: user.role as "OWNER" | "EDITOR" });

  return NextResponse.json({ ok: true });
}
