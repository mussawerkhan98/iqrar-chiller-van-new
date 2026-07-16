import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (session?.role !== "OWNER") {
    return NextResponse.json({ error: "Only owners can remove admin users." }, { status: 403 });
  }

  const { id } = await params;
  if (id === session.userId) {
    return NextResponse.json({ error: "You can't remove your own account." }, { status: 400 });
  }

  await prisma.adminUser.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
