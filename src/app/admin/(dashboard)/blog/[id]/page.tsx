import { prisma } from "@/lib/prisma";
import BlogPostForm from "@/components/admin/BlogPostForm";
import { notFound } from "next/navigation";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900 mb-1">Edit Post</h1>
      <p className="text-sm text-slate-500 mb-8">{post.title}</p>
      <BlogPostForm initial={{ ...post }} />
    </div>
  );
}
