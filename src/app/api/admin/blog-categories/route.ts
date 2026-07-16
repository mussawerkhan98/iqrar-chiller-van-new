import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import slugify from "slugify";

export async function GET() {
  const categories = await prisma.blogCategory.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const { name } = await req.json();
  if (!name) return NextResponse.json({ error: "Name is required." }, { status: 400 });

  const slug = slugify(name, { lower: true, strict: true });

  const category = await prisma.blogCategory.create({ data: { name, slug } });
  return NextResponse.json(category);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await prisma.blogCategory.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
