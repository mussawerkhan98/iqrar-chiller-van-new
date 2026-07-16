"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ImagePicker from "./ImagePicker";

export type BlogPostFormData = {
  id?: string;
  title: string;
  excerpt: string;
  body: string;
  coverImage: string | null;
  authorName: string;
  status: "DRAFT" | "PUBLISHED";
  categoryId: string | null;
};

type Category = { id: string; name: string };

const EMPTY: BlogPostFormData = {
  title: "",
  excerpt: "",
  body: "",
  coverImage: null,
  authorName: "Iqrar Chiller Van Transport",
  status: "DRAFT",
  categoryId: null,
};

export default function BlogPostForm({ initial }: { initial?: BlogPostFormData }) {
  const router = useRouter();
  const [data, setData] = useState<BlogPostFormData>(initial || EMPTY);
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(initial?.id);

  useEffect(() => {
    fetch("/api/admin/blog-categories")
      .then((r) => r.json())
      .then(setCategories);
  }, []);

  async function handleSubmit(e: React.FormEvent, status?: "DRAFT" | "PUBLISHED") {
    e.preventDefault();
    setSaving(true);

    const payload = status ? { ...data, status } : data;
    const url = isEdit ? `/api/admin/blog/${initial!.id}` : "/api/admin/blog";
    const method = isEdit ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    router.push("/admin/blog");
    router.refresh();
  }

  async function handleDelete() {
    if (!initial?.id) return;
    if (!confirm(`Delete "${data.title}"? This can't be undone.`)) return;
    await fetch(`/api/admin/blog/${initial.id}`, { method: "DELETE" });
    router.push("/admin/blog");
    router.refresh();
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="max-w-2xl space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
          <input
            required
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Excerpt</label>
          <textarea
            rows={2}
            value={data.excerpt}
            onChange={(e) => setData({ ...data, excerpt: e.target.value })}
            placeholder="Short summary shown on the blog listing page"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Body</label>
          <textarea
            rows={12}
            required
            value={data.body}
            onChange={(e) => setData({ ...data, body: e.target.value })}
            placeholder="Post content (supports Markdown)"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <ImagePicker
          label="Cover image"
          value={data.coverImage}
          onChange={(url) => setData({ ...data, coverImage: url })}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select
              value={data.categoryId || ""}
              onChange={(e) => setData({ ...data, categoryId: e.target.value || null })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="">No category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Author</label>
            <input
              value={data.authorName}
              onChange={(e) => setData({ ...data, authorName: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={(e) => handleSubmit(e as any, "DRAFT")}
          disabled={saving}
          className="border border-slate-300 rounded-lg px-5 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
        >
          Save as draft
        </button>
        <button
          type="button"
          onClick={(e) => handleSubmit(e as any, "PUBLISHED")}
          disabled={saving}
          className="bg-slate-900 text-white rounded-lg px-5 py-2 text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Publish"}
        </button>
        {isEdit && (
          <button type="button" onClick={handleDelete} className="text-sm text-red-600 hover:underline ml-auto">
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
