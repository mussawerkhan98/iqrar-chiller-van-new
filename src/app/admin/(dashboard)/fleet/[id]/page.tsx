import { prisma } from "@/lib/prisma";
import VehicleForm from "@/components/admin/VehicleForm";
import { notFound } from "next/navigation";

export default async function EditVehiclePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vehicle = await prisma.vehicleType.findUnique({ where: { id } });
  if (!vehicle) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900 mb-1">Edit Vehicle</h1>
      <p className="text-sm text-slate-500 mb-8">{vehicle.name}</p>
      <VehicleForm initial={{ ...vehicle }} />
    </div>
  );
}
