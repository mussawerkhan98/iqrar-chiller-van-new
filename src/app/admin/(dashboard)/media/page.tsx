"use client";

import { useEffect, useRef, useState } from "react";

type MediaItem = { id: string; url: string; filename: string; altText: string; createdAt: string };

export default function MediaLibraryPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function load() {
    fetch("/api/admin/media")
      .then((r) => r.json())
      .then(setItems);
  }

  useEffect(load, []);

  async function handleUpload(files: FileList) {
    setUploading(true);
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      await fetch("/api/admin/media/upload", { method: "POST", body: formData });
    }
    setUploading(false);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this image? Pages currently using it will show a broken image.")) return;
    await fetch("/api/admin/media", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(window.location.origin + url);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">Media Library</h1>
          <p className="text-sm text-slate-500">
            All images used across the site — logo, fleet photos, blog covers, team photos.
          </p>
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="bg-slate-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
        >
          {uploading ? "Uploading…" : "+ Upload images"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleUpload(e.target.files)}
        />
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-slate-500">No images uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt={item.altText} className="w-full h-28 object-cover" />
              <div className="p-2 flex items-center justify-between gap-1">
                <button
                  onClick={() => copyUrl(item.url)}
                  className="text-xs text-slate-500 hover:text-slate-900 truncate"
                  title="Copy URL"
                >
                  Copy URL
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
