"use client";

import { useEffect, useState } from "react";
import ImagePicker from "@/components/admin/ImagePicker";

type Settings = {
  siteName: string;
  logoUrl: string | null;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  facebookUrl: string | null;
  instagramUrl: string | null;
  linkedinUrl: string | null;
  heroHeadline: string;
  heroSubtext: string;
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then(setSettings);
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setSaved(false);

    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!settings) return <p className="text-sm text-slate-500">Loading…</p>;

  const field = (key: keyof Settings, label: string, type = "text") => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <input
        type={type}
        value={(settings[key] as string) || ""}
        onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
      />
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900 mb-1">Branding & Settings</h1>
      <p className="text-sm text-slate-500 mb-8">
        Controls the logo, contact details, and homepage hero text shown on the public site.
      </p>

      <form onSubmit={handleSave} className="max-w-2xl space-y-8">
        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <h2 className="font-medium text-slate-900">Logo & Site Name</h2>
          <ImagePicker
            label="Logo"
            value={settings.logoUrl}
            onChange={(url) => setSettings({ ...settings, logoUrl: url })}
          />
          {field("siteName", "Site Name")}
        </section>

        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <h2 className="font-medium text-slate-900">Homepage Hero</h2>
          {field("heroHeadline", "Headline")}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Subtext</label>
            <textarea
              rows={3}
              value={settings.heroSubtext}
              onChange={(e) => setSettings({ ...settings, heroSubtext: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <h2 className="font-medium text-slate-900">Contact</h2>
          <div className="grid grid-cols-2 gap-4">
            {field("phone", "Phone")}
            {field("whatsapp", "WhatsApp")}
          </div>
          {field("email", "Email", "email")}
          {field("address", "Office Address")}
        </section>

        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <h2 className="font-medium text-slate-900">Social Links</h2>
          {field("facebookUrl", "Facebook URL")}
          {field("instagramUrl", "Instagram URL")}
          {field("linkedinUrl", "LinkedIn URL")}
        </section>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-slate-900 text-white rounded-lg px-5 py-2 text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
          {saved && <span className="text-sm text-emerald-600">Saved</span>}
        </div>
      </form>
    </div>
  );
}
