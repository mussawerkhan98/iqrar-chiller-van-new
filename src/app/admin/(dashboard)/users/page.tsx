"use client";

import { useEffect, useState } from "react";

type User = { id: string; email: string; name: string; role: "OWNER" | "EDITOR"; createdAt: string };

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({ email: "", name: "", password: "", role: "EDITOR" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function load() {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then(setUsers);
  }

  useEffect(load, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not add user.");
      return;
    }

    setForm({ email: "", name: "", password: "", role: "EDITOR" });
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this admin user?")) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Could not remove user.");
      return;
    }
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900 mb-1">Admin Users</h1>
      <p className="text-sm text-slate-500 mb-8">
        Owners can manage all content and add/remove other admins. Editors can manage content only.
      </p>

      <div className="grid grid-cols-2 gap-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 h-fit">
          <h2 className="font-medium text-slate-900">Add admin user</h2>
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Temporary password</label>
            <input
              type="text"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="EDITOR">Editor</option>
              <option value="OWNER">Owner</option>
            </select>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="bg-slate-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
          >
            {saving ? "Adding…" : "Add user"}
          </button>
        </form>

        <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 h-fit">
          {users.map((u) => (
            <div key={u.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium text-slate-900">{u.name}</p>
                <p className="text-xs text-slate-500">{u.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{u.role}</span>
                <button onClick={() => handleDelete(u.id)} className="text-xs text-red-600 hover:underline">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
