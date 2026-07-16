import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

// Body is stored as plain text/Markdown. This renders paragraphs by
// splitting on blank lines — swap in `react-markdown` here later if you
// want full Markdown support (headings, bold, links, etc).
function renderBody(body: string) {
  return body
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map((para, i) => (
      <p key={i} className="mb-4 text-frost-800/90 leading-relaxed">
        {para}
      </p>
    ));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!post || post.status !== "PUBLISHED") notFound();

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      {post.category && (
        <span className="text-xs font-medium text-amber-600 bg-amber-50 rounded-full px-2.5 py-1">
          {post.category.name}
        </span>
      )}
      <h1 className="font-display font-extrabold text-3xl md:text-4xl text-frost-900 mt-4 mb-3">
        {post.title}
      </h1>
      <p className="text-sm text-steel mb-8">
        {post.authorName} ·{" "}
        {post.publishedAt
          ? new Date(post.publishedAt).toLocaleDateString("en-AE", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : ""}
      </p>

      {post.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full aspect-video object-cover rounded-2xl border border-frost-100 mb-8"
        />
      )}

      <div>{renderBody(post.body)}</div>
    </main>
  );
}
