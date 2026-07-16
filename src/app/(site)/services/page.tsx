import { prisma } from "@/lib/prisma";
import VehicleCard from "@/components/site/VehicleCard";

export default async function ServicesPage() {
  const vehicles = await prisma.vehicleType.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="font-display font-extrabold text-4xl text-frost-900 mb-3">Our Services</h1>
        <p className="text-steel max-w-xl mx-auto">
          Every vehicle in our fleet is temperature-monitored and maintained to UAE cold-chain
          compliance standards.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((v) => (
          <VehicleCard key={v.id} vehicle={v} />
        ))}
      </div>
    </main>
  );
}
