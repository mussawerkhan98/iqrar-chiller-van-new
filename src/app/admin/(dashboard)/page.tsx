import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const [vehicleCount, postCount, leadCount, newLeadCount, mediaCount] = await Promise.all([
    prisma.vehicleType.count(),
    prisma.blogPost.count(),
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.media.count(),
  ]);

  const cards = [
    { label: "Fleet / Services", value: vehicleCount, href: "/admin/fleet" },
    { label: "Blog Posts", value: postCount, href: "/admin/blog" },
    { label: "New Leads", value: newLeadCount, href: "/admin/leads" },
    { label: "Total Leads", value: leadCount, href: "/admin/leads" },
    { label: "Media Files", value: mediaCount, href: "/admin/media" },
  ];

  const recentLeads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { vehicleType: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900 mb-1">Dashboard</h1>
      <p className="text-sm text-slate-500 mb-8">Overview of your website content and inquiries.</p>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-sm transition-shadow"
          >
            <p className="text-2xl font-semibold text-slate-900">{c.value}</p>
            <p className="text-sm text-slate-500 mt-1">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-medium text-slate-900">Recent Leads</h2>
          <Link href="/admin/leads" className="text-sm text-slate-500 hover:text-slate-900">
            View all →
          </Link>
        </div>
        {recentLeads.length === 0 ? (
          <p className="p-5 text-sm text-slate-500">No inquiries yet.</p>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {recentLeads.map((lead) => (
                <tr key={lead.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-5 py-3 font-medium text-slate-900">{lead.name}</td>
                  <td className="px-5 py-3 text-slate-500">{lead.phone}</td>
                  <td className="px-5 py-3 text-slate-500">{lead.vehicleType?.name || "—"}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        lead.status === "NEW"
                          ? "bg-amber-100 text-amber-700"
                          : lead.status === "CONTACTED"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
