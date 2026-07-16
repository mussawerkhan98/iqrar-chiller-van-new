"use client";

import { useRef, useState } from "react";

export default function ImagePicker({
  value,
  onChange,
  label = "Image",
}: {
  value: string | null | undefined;
  onChange: (url: string) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/media/upload", {
      method: "POST",
      body: formData,
    });

    setUploading(false);

    if (!res.ok) {
      setError("Upload failed. Try a smaller image or different format.");
      return;
    }

    const data = await res.json();
    onChange(data.url);
  }

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <div className="flex items-center gap-3">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="w-16 h-16 rounded-lg object-cover border border-slate-200" />
        ) : (
          <div className="w-16 h-16 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-slate-300 text-xs">
            none
          </div>
        )}
        <div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="text-sm border border-slate-300 rounded-lg px-3 py-1.5 hover:bg-slate-50 disabled:opacity-50"
          >
            {uploading ? "Uploading…" : value ? "Replace" : "Upload"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-sm text-red-600 ml-2 hover:underline"
            >
              Remove
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
