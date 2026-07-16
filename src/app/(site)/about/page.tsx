import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AboutPage() {
  const [settings, team] = await Promise.all([
    prisma.siteSettings.upsert({ where: { id: "main" }, update: {}, create: { id: "main" } }),
    prisma.teamMember.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="font-display font-extrabold text-4xl text-frost-900 mb-4">
        About {settings.siteName}
      </h1>
      <p className="text-frost-800/80 max-w-2xl mb-4">
        {settings.heroSubtext ||
          "We operate a temperature-controlled fleet across the UAE, keeping perishable goods safe from pickup to delivery."}
      </p>
      <Link
        href="/contact"
        className="inline-block bg-amber-500 hover:bg-amber-600 text-frost-900 font-semibold rounded-full px-6 py-2.5 text-sm mb-16"
      >
        Get in touch
      </Link>

      {team.length > 0 && (
        <section className="mb-16">
          <h2 className="font-display font-bold text-2xl text-frost-900 mb-8">Meet the Team</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {team.map((m) => (
              <div key={m.id} className="text-center">
                {m.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.photoUrl}
                    alt={m.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-3"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-frost-50 mx-auto mb-3" />
                )}
                <p className="font-semibold text-frost-900">{m.name}</p>
                <p className="text-sm text-steel">{m.role}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="bg-frost-50 rounded-2xl p-8">
        <h2 className="font-display font-bold text-xl text-frost-900 mb-4">Contact Info</h2>
        <div className="text-sm text-steel space-y-1">
          <p>Phone: {settings.phone}</p>
          <p>Email: {settings.email}</p>
          <p>Office: {settings.address}</p>
        </div>
      </section>
    </main>
  );
}
