// Signature visual for the site: a vertical gauge from -25°C (deep freeze)
// to +10°C (ambient), with the vehicle's actual operating band highlighted.
// Reused on every fleet card so the temperature range reads at a glance
// instead of as a plain text badge.

const SCALE_MIN = -25;
const SCALE_MAX = 10;

export default function TempGauge({
  min,
  max,
}: {
  min: number | null;
  max: number | null;
}) {
  if (min === null || max === null) {
    return (
      <div className="flex items-center gap-2 text-xs text-steel">
        <div className="w-1.5 h-10 rounded-full bg-frost-100" />
        Ambient
      </div>
    );
  }

  const range = SCALE_MAX - SCALE_MIN;
  const bottomPct = ((min - SCALE_MIN) / range) * 100;
  const topPct = 100 - ((max - SCALE_MIN) / range) * 100;

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-1.5 h-10 rounded-full overflow-hidden bg-gradient-to-t from-chill-500 via-frost-400 to-amber-500">
        <div
          className="absolute inset-x-0 bg-frost-900/70"
          style={{ top: 0, height: `${topPct}%` }}
        />
        <div
          className="absolute inset-x-0 bg-frost-900/70"
          style={{ bottom: 0, height: `${bottomPct}%` }}
        />
      </div>
      <div className="text-xs leading-tight">
        <p className="font-semibold text-frost-800">
          {min}°C <span className="text-steel font-normal">to</span> {max}°C
        </p>
      </div>
    </div>
  );
}
