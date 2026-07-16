"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Category = { id: string; name: string; slug: string };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  function load() {
    fetch("/api/admin/blog-categories")
      .then((r) => r.json())
      .then(setCategories);
  }

  useEffect(load, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    await fetch("/api/admin/blog-categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setName("");
    setSaving(false);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category? Posts in it will become uncategorized.")) return;
    await fetch("/api/admin/blog-categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  return (
    <div>
      <Link href="/admin/blog" className="text-sm text-slate-500 hover:text-slate-900">
        ← Back to posts
      </Link>
      <h1 className="text-2xl font-semibold text-slate-900 mt-2 mb-8">Blog Categories</h1>

      <form onSubmit={handleAdd} className="flex gap-2 mb-6 max-w-md">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
        <button
          type="submit"
          disabled={saving}
          className="bg-slate-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
        >
          Add
        </button>
      </form>

      <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 max-w-md">
        {categories.length === 0 && <p className="p-4 text-sm text-slate-500">No categories yet.</p>}
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-slate-900">{c.name}</span>
            <button onClick={() => handleDelete(c.id)} className="text-xs text-red-600 hover:underline">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
