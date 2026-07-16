import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function FleetListPage() {
  const vehicles = await prisma.vehicleType.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">Fleet / Services</h1>
          <p className="text-sm text-slate-500">
            Manage the vehicle types shown on the homepage and services pages.
          </p>
        </div>
        <Link
          href="/admin/fleet/new"
          className="bg-slate-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-slate-800"
        >
          + Add vehicle
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
        {vehicles.length === 0 && (
          <p className="p-6 text-sm text-slate-500">No vehicles yet. Add your first one.</p>
        )}
        {vehicles.map((v) => (
          <Link
            key={v.id}
            href={`/admin/fleet/${v.id}`}
            className="flex items-center justify-between px-6 py-4 hover:bg-slate-50"
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">{v.icon}</span>
              <div>
                <p className="font-medium text-slate-900">{v.name}</p>
                <p className="text-sm text-slate-500">{v.models}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {v.tempMin !== null && v.tempMax !== null && (
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                  {v.tempMin}°C to {v.tempMax}°C
                </span>
              )}
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  v.published ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                }`}
              >
                {v.published ? "Published" : "Hidden"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
