import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function BlogListPage() {
  const posts = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  });

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-12">
        <h1 className="font-display font-extrabold text-4xl text-frost-900 mb-3">Blog</h1>
        <p className="text-steel">Cold-chain insights, UAE regulations, and seasonal transport tips.</p>
      </div>

      <div className="divide-y divide-frost-100">
        {posts.length === 0 && (
          <p className="text-sm text-steel py-8">No posts published yet — check back soon.</p>
        )}
        {posts.map((post) => (
          <article key={post.id} className="py-8">
            {post.category && (
              <span className="text-xs font-medium text-amber-600 bg-amber-50 rounded-full px-2.5 py-1">
                {post.category.name}
              </span>
            )}
            <h2 className="font-display font-bold text-2xl text-frost-900 mt-3 mb-2">
              <Link href={`/blog/${post.slug}`} className="hover:text-frost-600">
                {post.title}
              </Link>
            </h2>
            <p className="text-sm text-steel mb-3">
              {post.authorName} ·{" "}
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString("en-AE", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : ""}
            </p>
            <p className="text-frost-800/80">{post.excerpt}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
