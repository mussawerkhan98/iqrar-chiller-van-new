import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET() {
  const users = await prisma.adminUser.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (session?.role !== "OWNER") {
    return NextResponse.json({ error: "Only owners can add admin users." }, { status: 403 });
  }

  const { email, name, password, role } = await req.json();
  if (!email || !name || !password) {
    return NextResponse.json({ error: "Email, name, and password are required." }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.adminUser.create({
    data: { email, name, passwordHash, role: role === "OWNER" ? "OWNER" : "EDITOR" },
  });

  return NextResponse.json({ id: user.id, email: user.email, name: user.name, role: user.role });
}
