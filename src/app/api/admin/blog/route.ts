import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import slugify from "slugify";

export async function GET() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const slug = slugify(body.title || "", { lower: true, strict: true });

  const post = await prisma.blogPost.create({
    data: {
      title: body.title,
      slug,
      excerpt: body.excerpt || "",
      body: body.body || "",
      coverImage: body.coverImage || null,
      authorName: body.authorName || "Iqrar Chiller Van Transport",
      status: body.status || "DRAFT",
      categoryId: body.categoryId || null,
      publishedAt: body.status === "PUBLISHED" ? new Date() : null,
    },
  });

  return NextResponse.json(post);
}
