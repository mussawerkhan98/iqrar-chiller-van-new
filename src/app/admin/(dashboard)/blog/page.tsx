import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function BlogListPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">Blog</h1>
          <p className="text-sm text-slate-500">Posts shown on the public blog page.</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/blog/categories"
            className="border border-slate-300 rounded-lg px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            Manage categories
          </Link>
          <Link
            href="/admin/blog/new"
            className="bg-slate-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-slate-800"
          >
            + New post
          </Link>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
        {posts.length === 0 && <p className="p-6 text-sm text-slate-500">No posts yet.</p>}
        {posts.map((p) => (
          <Link
            key={p.id}
            href={`/admin/blog/${p.id}`}
            className="flex items-center justify-between px-6 py-4 hover:bg-slate-50"
          >
            <div>
              <p className="font-medium text-slate-900">{p.title}</p>
              <p className="text-sm text-slate-500">
                {p.category?.name || "Uncategorized"} · {p.authorName}
              </p>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                p.status === "PUBLISHED" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
              }`}
            >
              {p.status === "PUBLISHED" ? "Published" : "Draft"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
