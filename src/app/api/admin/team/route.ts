import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const team = await prisma.teamMember.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(team);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const member = await prisma.teamMember.create({
    data: {
      name: body.name,
      role: body.role,
      photoUrl: body.photoUrl || null,
      order: body.order ?? 0,
    },
  });
  return NextResponse.json(member);
}
