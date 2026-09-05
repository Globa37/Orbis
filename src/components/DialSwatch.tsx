import { buildOrb, spectrumFill } from "@/lib/orbis/orb";
import type { Colorway } from "@/lib/orbis/watch-svg";

/**
 * A miniature of the dial itself, built from the same sphere maths as the
 * watch. Not an abstract colour chip — the actual orb on the actual ground.
 */
export function DialSwatch({
  colorway,
  size = 40,
  id,
}: {
  colorway: Colorway;
  size?: number;
  id: string;
}) {
  const cells = buildOrb(50, 50, 43);
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={`sw-${id}`}>
          <circle cx="50" cy="50" r="50" />
        </clipPath>
        <linearGradient id={`swg-${id}`} x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor={colorway.dialShade} />
          <stop offset="45%" stopColor={colorway.dial} />
          <stop offset="72%" stopColor={colorway.dialSheen} />
          <stop offset="100%" stopColor={colorway.dialShade} />
        </linearGradient>
      </defs>
      <g clipPath={`url(#sw-${id})`}>
        <rect width="100" height="100" fill={`url(#swg-${id})`} />
        {cells.map((c, i) => (
          <path
            key={i}
            d={c.d}
            fill={colorway.orb === "spectrum" ? spectrumFill(c.lat) : colorway.orb}
          />
        ))}
      </g>
      <circle cx="50" cy="50" r="49" fill="none" stroke="#000" strokeOpacity="0.35" strokeWidth="2" />
    </svg>
  );
}
