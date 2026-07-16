import Link from "next/link";
import TempGauge from "./TempGauge";

type Vehicle = {
  slug: string;
  name: string;
  models: string;
  icon: string;
  description: string;
  tempMin: number | null;
  tempMax: number | null;
  imageUrl: string | null;
};

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Link
      href={`/services/${vehicle.slug}`}
      className="group bg-white border border-frost-100 rounded-2xl p-6 hover:border-frost-400 hover:shadow-lg transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-3xl">{vehicle.icon}</span>
        <TempGauge min={vehicle.tempMin} max={vehicle.tempMax} />
      </div>
      <h3 className="font-display font-bold text-lg text-frost-900 mb-1">{vehicle.name}</h3>
      <p className="text-xs text-steel mb-3">{vehicle.models}</p>
      <p className="text-sm text-frost-800/80 line-clamp-2 mb-4">{vehicle.description}</p>
      <span className="text-sm font-medium text-frost-600 group-hover:text-amber-600 transition-colors">
        View details →
      </span>
    </Link>
  );
}
