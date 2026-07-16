import Link from "next/link";
import { prisma } from "@/lib/prisma";
import VehicleCard from "@/components/site/VehicleCard";
import StatsStrip from "@/components/site/StatsStrip";

const WHY_US = [
  { n: "01", title: "24/7 Availability", body: "Book anytime — our dispatch team and fleet operate round the clock across the UAE." },
  { n: "02", title: "Cold-Chain Compliance", body: "Every vehicle is maintained to DM-FSD food-safety and pharma transport standards." },
  { n: "03", title: "Real-Time Temperature Control", body: "Monitored units hold your set range from pickup to delivery, no gaps." },
  { n: "04", title: "Experienced Drivers", body: "Trained specifically in perishable and temperature-sensitive handling." },
  { n: "05", title: "Flexible Fleet", body: "From a single chiller van to multi-truck contracts — scaled to your volume." },
];

const WHAT_WE_DELIVER = [
  { title: "Fresh Food Distribution", body: "Restaurant and supermarket supply runs, held at precise chill temperatures." },
  { title: "Food Truck & Catering Supply", body: "On-time delivery for events and mobile kitchens." },
  { title: "Flower & Floral Delivery", body: "Climate-controlled transport that protects freshness in UAE heat." },
  { title: "Event Logistics", body: "Bulk perishable transport for weddings, exhibitions, and corporate events." },
  { title: "Dairy Products", body: "Consistent cold chain from processing plant to retail shelf." },
  { title: "Poultry & Meat", body: "Frozen and chilled transport meeting food-safety regulations." },
  { title: "General Perishables", body: "Fruits, vegetables, and packaged goods moved without spoilage risk." },
  { title: "Air Freight Cold Transfer", body: "Airport-to-warehouse transfers for temperature-sensitive air cargo." },
  { title: "Rail Freight Cold Transfer", body: "Last-mile cold-chain continuity from rail terminals." },
];

export default async function HomePage() {
  const [settings, vehicles] = await Promise.all([
    prisma.siteSettings.upsert({ where: { id: "main" }, update: {}, create: { id: "main" } }),
    prisma.vehicleType.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
  ]);

  return (
    <main>
      {/* Hero */}
      <section className="bg-frost-900 pt-16 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block text-xs font-medium text-amber-400 bg-amber-400/10 rounded-full px-3 py-1 mb-6">
            DUBAI · ABU DHABI · SHARJAH — 24/7
          </span>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-white leading-tight mb-5">
            {settings.heroHeadline}
          </h1>
          <p className="text-frost-100/80 text-lg mb-8 max-w-2xl mx-auto">
            {settings.heroSubtext}
          </p>
          <div className="flex items-center justify-center gap-3 mb-14">
            <Link
              href="/contact"
              className="bg-amber-500 hover:bg-amber-600 text-frost-900 font-semibold rounded-full px-6 py-3 text-sm transition-colors"
            >
              Book a Van
            </Link>
            <a
              href={`tel:${settings.phone.replace(/\s+/g, "")}`}
              className="border border-white/30 text-white hover:bg-white/10 font-semibold rounded-full px-6 py-3 text-sm transition-colors"
            >
              Call {settings.phone}
            </a>
          </div>
          <StatsStrip />
        </div>
      </section>

      {/* Fleet grid */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl text-frost-900 mb-3">Our Fleet</h2>
          <p className="text-steel max-w-xl mx-auto">
            Temperature-controlled vehicles sized and specced for every cold-chain job in the UAE.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-frost-50 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display font-bold text-3xl text-frost-900 mb-10 text-center">
            Why Choose {settings.siteName}
          </h2>
          <div className="space-y-6">
            {WHY_US.map((item) => (
              <div key={item.n} className="flex gap-5">
                <span className="font-display font-extrabold text-2xl text-amber-500 w-12 shrink-0">
                  {item.n}
                </span>
                <div>
                  <h3 className="font-semibold text-frost-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-steel">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="font-display font-bold text-3xl text-frost-900 mb-10 text-center">
          Vehicle Comparison
        </h2>
        <div className="overflow-x-auto rounded-xl border border-frost-100">
          <table className="w-full text-sm">
            <thead className="bg-frost-900 text-white">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Vehicle Type</th>
                <th className="text-left px-5 py-3 font-medium">Models Used</th>
                <th className="text-left px-5 py-3 font-medium">Ideal For</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v, i) => (
                <tr key={v.id} className={i % 2 === 0 ? "bg-white" : "bg-frost-50"}>
                  <td className="px-5 py-3 font-medium text-frost-900">{v.icon} {v.name}</td>
                  <td className="px-5 py-3 text-steel">{v.models}</td>
                  <td className="px-5 py-3 text-steel">{v.idealFor || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* What we deliver */}
      <section className="bg-frost-900 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display font-bold text-3xl text-white mb-10 text-center">
            What We Deliver
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHAT_WE_DELIVER.map((item, i) => (
              <div key={item.title} className="border border-frost-800 rounded-xl p-5">
                <span className="text-amber-400 font-display font-bold text-sm">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-white font-semibold mt-2 mb-1">{item.title}</h3>
                <p className="text-sm text-frost-100/70">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
