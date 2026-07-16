import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  const existing = await prisma.blogPost.findUnique({ where: { id } });
  const becomingPublished = body.status === "PUBLISHED" && existing?.status !== "PUBLISHED";

  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      title: body.title,
      excerpt: body.excerpt,
      body: body.body,
      coverImage: body.coverImage || null,
      authorName: body.authorName,
      status: body.status,
      categoryId: body.categoryId || null,
      publishedAt: becomingPublished ? new Date() : existing?.publishedAt,
    },
  });

  return NextResponse.json(post);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
