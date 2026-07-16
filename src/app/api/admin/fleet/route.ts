import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import slugify from "slugify";

export async function GET() {
  const vehicles = await prisma.vehicleType.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(vehicles);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const slug = slugify(body.name || "", { lower: true, strict: true });

  const vehicle = await prisma.vehicleType.create({
    data: {
      name: body.name,
      slug,
      models: body.models || "",
      tempMin: body.tempMin ?? null,
      tempMax: body.tempMax ?? null,
      icon: body.icon || "🚚",
      description: body.description || "",
      idealFor: body.idealFor || "",
      imageUrl: body.imageUrl || null,
      order: body.order ?? 0,
      published: body.published ?? true,
    },
  });

  return NextResponse.json(vehicle);
}
