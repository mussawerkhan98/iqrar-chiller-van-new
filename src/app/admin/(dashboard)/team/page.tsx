"use client";

import { useEffect, useState } from "react";
import ImagePicker from "@/components/admin/ImagePicker";

type Member = { id: string; name: string; role: string; photoUrl: string | null; order: number };

const EMPTY = { name: "", role: "", photoUrl: null as string | null, order: 0 };

export default function TeamPage() {
  const [team, setTeam] = useState<Member[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function load() {
    fetch("/api/admin/team")
      .then((r) => r.json())
      .then(setTeam);
  }

  useEffect(load, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const url = editingId ? `/api/admin/team/${editingId}` : "/api/admin/team";
    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm(EMPTY);
    setEditingId(null);
    setSaving(false);
    load();
  }

  function startEdit(m: Member) {
    setEditingId(m.id);
    setForm({ name: m.name, role: m.role, photoUrl: m.photoUrl, order: m.order });
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this team member?")) return;
    await fetch(`/api/admin/team/${id}`, { method: "DELETE" });
    if (editingId === id) {
      setEditingId(null);
      setForm(EMPTY);
    }
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900 mb-1">Team</h1>
      <p className="text-sm text-slate-500 mb-8">Shown on the About page.</p>

      <div className="grid grid-cols-2 gap-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 h-fit">
          <h2 className="font-medium text-slate-900">{editingId ? "Edit member" : "Add member"}</h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
            <input
              required
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              placeholder="e.g. CEO, Manager"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
          <ImagePicker
            label="Photo"
            value={form.photoUrl}
            onChange={(url) => setForm({ ...form, photoUrl: url })}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-slate-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
            >
              {editingId ? "Save changes" : "Add member"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(EMPTY);
                }}
                className="text-sm text-slate-500 hover:text-slate-900"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 h-fit">
          {team.length === 0 && <p className="p-4 text-sm text-slate-500">No team members yet.</p>}
          {team.map((m) => (
            <div key={m.id} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                {m.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.photoUrl} alt="" className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-slate-100" />
                )}
                <div>
                  <p className="text-sm font-medium text-slate-900">{m.name}</p>
                  <p className="text-xs text-slate-500">{m.role}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(m)} className="text-xs text-slate-500 hover:text-slate-900">
                  Edit
                </button>
                <button onClick={() => handleDelete(m.id)} className="text-xs text-red-600 hover:underline">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
