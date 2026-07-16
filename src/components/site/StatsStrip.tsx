const STATS = [
  { value: "24/7", label: "Availability" },
  { value: "3", label: "Emirates covered" },
  { value: "-25°C", label: "Lowest temp handled" },
  { value: "100%", label: "Cold-chain compliance" },
];

export default function StatsStrip() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
      {STATS.map((s) => (
        <div key={s.label} className="text-center">
          <p className="font-display font-extrabold text-2xl md:text-3xl text-white">{s.value}</p>
          <p className="text-xs text-frost-100/70 mt-1">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
