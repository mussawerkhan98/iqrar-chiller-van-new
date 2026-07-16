import VehicleForm from "@/components/admin/VehicleForm";

export default function NewVehiclePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900 mb-1">Add Vehicle</h1>
      <p className="text-sm text-slate-500 mb-8">Adds a new card to the homepage fleet grid.</p>
      <VehicleForm />
    </div>
  );
}
