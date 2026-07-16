"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImagePicker from "./ImagePicker";

export type VehicleFormData = {
  id?: string;
  name: string;
  models: string;
  tempMin: number | null;
  tempMax: number | null;
  icon: string;
  description: string;
  idealFor: string;
  imageUrl: string | null;
  order: number;
  published: boolean;
};

const EMPTY: VehicleFormData = {
  name: "",
  models: "",
  tempMin: null,
  tempMax: null,
  icon: "🚚",
  description: "",
  idealFor: "",
  imageUrl: null,
  order: 0,
  published: true,
};

export default function VehicleForm({ initial }: { initial?: VehicleFormData }) {
  const router = useRouter();
  const [data, setData] = useState<VehicleFormData>(initial || EMPTY);
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(initial?.id);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const url = isEdit ? `/api/admin/fleet/${initial!.id}` : "/api/admin/fleet";
    const method = isEdit ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setSaving(false);
    router.push("/admin/fleet");
    router.refresh();
  }

  async function handleDelete() {
    if (!initial?.id) return;
    if (!confirm(`Delete "${data.name}"? This can't be undone.`)) return;
    await fetch(`/api/admin/fleet/${initial.id}`, { method: "DELETE" });
    router.push("/admin/fleet");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle name</label>
            <input
              required
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              placeholder="e.g. Chiller Van"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Icon (emoji)</label>
            <input
              value={data.icon}
              onChange={(e) => setData({ ...data, icon: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Models</label>
          <input
            value={data.models}
            onChange={(e) => setData({ ...data, models: e.target.value })}
            placeholder="e.g. Toyota Hiace, Nissan Urvan"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Min temp (°C)</label>
            <input
              type="number"
              value={data.tempMin ?? ""}
              onChange={(e) =>
                setData({ ...data, tempMin: e.target.value === "" ? null : Number(e.target.value) })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Max temp (°C)</label>
            <input
              type="number"
              value={data.tempMax ?? ""}
              onChange={(e) =>
                setData({ ...data, tempMax: e.target.value === "" ? null : Number(e.target.value) })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea
            rows={3}
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Ideal for (comma-separated)</label>
          <input
            value={data.idealFor}
            onChange={(e) => setData({ ...data, idealFor: e.target.value })}
            placeholder="Fresh food, Dairy, Catering"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <ImagePicker
          label="Photo"
          value={data.imageUrl}
          onChange={(url) => setData({ ...data, imageUrl: url })}
        />

        <div className="grid grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Display order</label>
            <input
              type="number"
              value={data.order}
              onChange={(e) => setData({ ...data, order: Number(e.target.value) })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700 pb-2">
            <input
              type="checkbox"
              checked={data.published}
              onChange={(e) => setData({ ...data, published: e.target.checked })}
            />
            Published (visible on site)
          </label>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-slate-900 text-white rounded-lg px-5 py-2 text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
        >
          {saving ? "Saving…" : isEdit ? "Save changes" : "Create vehicle"}
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            className="text-sm text-red-600 hover:underline"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
