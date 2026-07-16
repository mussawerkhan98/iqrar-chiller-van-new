"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/settings", label: "Branding & Settings", icon: "⚙️" },
  { href: "/admin/fleet", label: "Fleet / Services", icon: "🚚" },
  { href: "/admin/blog", label: "Blog", icon: "📝" },
  { href: "/admin/media", label: "Media Library", icon: "🖼️" },
  { href: "/admin/leads", label: "Leads / Inquiries", icon: "📥" },
  { href: "/admin/team", label: "Team", icon: "👥" },
  { href: "/admin/users", label: "Admin Users", icon: "🔐" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="w-64 shrink-0 bg-slate-900 text-slate-200 min-h-screen flex flex-col">
      <div className="px-5 py-6 border-b border-slate-800">
        <p className="text-sm text-slate-400">Iqrar Chiller Van</p>
        <p className="font-semibold text-white">Admin Panel</p>
      </div>

      <nav className="flex-1 py-4">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-slate-800 text-white border-r-2 border-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="m-4 rounded-lg border border-slate-700 py-2 text-sm text-slate-300 hover:bg-slate-800"
      >
        Sign out
      </button>
    </aside>
  );
}
