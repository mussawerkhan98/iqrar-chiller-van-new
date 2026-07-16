"use client";

import { useEffect, useState } from "react";

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  status: "NEW" | "CONTACTED" | "CLOSED";
  createdAt: string;
  vehicleType: { name: string } | null;
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<"ALL" | Lead["status"]>("ALL");

  function load() {
    fetch("/api/admin/leads")
      .then((r) => r.json())
      .then(setLeads);
  }

  useEffect(load, []);

  async function updateStatus(id: string, status: Lead["status"]) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    await fetch(`/api/admin/leads/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this inquiry?")) return;
    await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
    load();
  }

  const filtered = filter === "ALL" ? leads : leads.filter((l) => l.status === filter);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900 mb-1">Leads / Inquiries</h1>
      <p className="text-sm text-slate-500 mb-6">
        Submissions from the contact form and "Book a Van" buttons.
      </p>

      <div className="flex gap-2 mb-4">
        {(["ALL", "NEW", "CONTACTED", "CLOSED"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-sm px-3 py-1.5 rounded-full border ${
              filter === f
                ? "bg-slate-900 text-white border-slate-900"
                : "border-slate-300 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
        {filtered.length === 0 && <p className="p-6 text-sm text-slate-500">No inquiries.</p>}
        {filtered.map((lead) => (
          <div key={lead.id} className="px-6 py-4 flex items-start justify-between gap-4">
            <div>
              <p className="font-medium text-slate-900">{lead.name}</p>
              <p className="text-sm text-slate-500">
                {lead.phone} {lead.email ? `· ${lead.email}` : ""}{" "}
                {lead.vehicleType ? `· ${lead.vehicleType.name}` : ""}
              </p>
              {lead.message && <p className="text-sm text-slate-600 mt-1">{lead.message}</p>}
              <p className="text-xs text-slate-400 mt-1">
                {new Date(lead.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <select
                value={lead.status}
                onChange={(e) => updateStatus(lead.id, e.target.value as Lead["status"])}
                className="text-sm border border-slate-300 rounded-lg px-2 py-1.5"
              >
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="CLOSED">Closed</option>
              </select>
              <button
                onClick={() => handleDelete(lead.id)}
                className="text-xs text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
