"use client";

import { useState } from "react";

export default function ContactForm({
  vehicleTypeId,
  vehicles,
}: {
  vehicleTypeId?: string;
  vehicles?: { id: string; name: string }[];
}) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    vehicleTypeId: vehicleTypeId || "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    const res = await fetch("/api/public/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, vehicleTypeId: form.vehicleTypeId || undefined }),
    });

    if (res.ok) {
      setStatus("sent");
      setForm({ name: "", phone: "", email: "", message: "", vehicleTypeId: vehicleTypeId || "" });
    } else {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="bg-chill-500/10 border border-chill-500/30 rounded-xl p-6 text-center">
        <p className="font-medium text-frost-900">Thanks — we've received your request.</p>
        <p className="text-sm text-steel mt-1">Our team will call you back shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-frost-800 mb-1">Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg border border-frost-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-frost-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-frost-800 mb-1">Phone</label>
          <input
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full rounded-lg border border-frost-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-frost-400"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-frost-800 mb-1">Email (optional)</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full rounded-lg border border-frost-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-frost-400"
        />
      </div>

      {vehicles && vehicles.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-frost-800 mb-1">Vehicle needed</label>
          <select
            value={form.vehicleTypeId}
            onChange={(e) => setForm({ ...form, vehicleTypeId: e.target.value })}
            className="w-full rounded-lg border border-frost-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-frost-400"
          >
            <option value="">Not sure yet</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-frost-800 mb-1">Message (optional)</label>
        <textarea
          rows={3}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full rounded-lg border border-frost-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-frost-400"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600">Something went wrong — please try again or call us directly.</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-frost-900 font-semibold rounded-full px-6 py-2.5 text-sm disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Book a Van"}
      </button>
    </form>
  );
}
