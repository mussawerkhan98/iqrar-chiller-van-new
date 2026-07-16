import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import TempGauge from "@/components/site/TempGauge";
import ContactForm from "@/components/site/ContactForm";

export default async function VehicleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vehicle = await prisma.vehicleType.findUnique({ where: { slug } });
  if (!vehicle || !vehicle.published) notFound();

  const idealFor = vehicle.idealFor
    ? vehicle.idealFor.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div>
          {vehicle.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={vehicle.imageUrl}
              alt={vehicle.name}
              className="w-full aspect-[4/3] object-cover rounded-2xl border border-frost-100"
            />
          ) : (
            <div className="w-full aspect-[4/3] rounded-2xl bg-frost-50 border border-frost-100 flex items-center justify-center text-6xl">
              {vehicle.icon}
            </div>
          )}
        </div>

        <div>
          <span className="text-3xl">{vehicle.icon}</span>
          <h1 className="font-display font-extrabold text-3xl text-frost-900 mt-3 mb-2">
            {vehicle.name}
          </h1>
          <p className="text-sm text-steel mb-4">{vehicle.models}</p>

          <div className="mb-5">
            <TempGauge min={vehicle.tempMin} max={vehicle.tempMax} />
          </div>

          <p className="text-frost-800/90 mb-6">{vehicle.description}</p>

          {idealFor.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {idealFor.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-frost-50 text-frost-600 border border-frost-100 rounded-full px-3 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-frost-50 rounded-2xl p-8 max-w-xl">
        <h2 className="font-display font-bold text-xl text-frost-900 mb-1">
          Book the {vehicle.name}
        </h2>
        <p className="text-sm text-steel mb-6">We'll call you back to confirm availability and pricing.</p>
        <ContactForm vehicleTypeId={vehicle.id} />
      </div>
    </main>
  );
}
