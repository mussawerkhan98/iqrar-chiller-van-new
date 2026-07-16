import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const member = await prisma.teamMember.update({
    where: { id },
    data: {
      name: body.name,
      role: body.role,
      photoUrl: body.photoUrl || null,
      order: body.order ?? 0,
    },
  });
  return NextResponse.json(member);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.teamMember.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
