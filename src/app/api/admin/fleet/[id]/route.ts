import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vehicle = await prisma.vehicleType.findUnique({ where: { id } });
  if (!vehicle) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(vehicle);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  const vehicle = await prisma.vehicleType.update({
    where: { id },
    data: {
      name: body.name,
      models: body.models,
      tempMin: body.tempMin ?? null,
      tempMax: body.tempMax ?? null,
      icon: body.icon,
      description: body.description,
      idealFor: body.idealFor,
      imageUrl: body.imageUrl || null,
      order: body.order ?? 0,
      published: body.published,
    },
  });

  return NextResponse.json(vehicle);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.vehicleType.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
