import { buildMark } from "@/lib/orbis/mark";
import type { Colorway } from "@/lib/orbis/watch-svg";

/**
 * A miniature of the dial, drawn as the ORBIS mark in outline on that
 * reference's ground.
 *
 * The dial's own orb is a filled grid of cells. At 40px that grid closes up
 * into a solid blob and every reference starts to look alike, so the swatch
 * uses the drawn mark instead — circle, meridian, equator, crown — which keeps
 * its shape at this size. The colours stay the reference's own: its dial
 * gradient underneath, its orb colour in the line.
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
  const m = buildMark(50, 54, 31);
  const spectrum = colorway.orb === "spectrum";
  const stroke = spectrum ? `url(#swm-${id})` : colorway.orb;

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
        {/*
          Chrome reads the spectrum down the orb's axis, as it does on the dial.
          User space, not the default bounding box: the equator is a horizontal
          line whose box has no height, and a box-relative gradient leaves it
          undrawn.
        */}
        {spectrum && (
          <linearGradient
            id={`swm-${id}`}
            gradientUnits="userSpaceOnUse"
            x1="50"
            y1={m.circle.cy - m.circle.r}
            x2="50"
            y2={m.circle.cy + m.circle.r}
          >
            <stop offset="0%" stopColor="#B93A2E" />
            <stop offset="28%" stopColor="#C0432F" />
            <stop offset="50%" stopColor="#D9A441" />
            <stop offset="72%" stopColor="#2E7D46" />
            <stop offset="100%" stopColor="#2F5FA8" />
          </linearGradient>
        )}
      </defs>

      <g clipPath={`url(#sw-${id})`}>
        <rect width="100" height="100" fill={`url(#swg-${id})`} />
        <g
          fill="none"
          stroke={stroke}
          strokeWidth={m.strokeWidth}
          strokeLinecap="butt"
          vectorEffect="non-scaling-stroke"
        >
          <circle cx={m.circle.cx} cy={m.circle.cy} r={m.circle.r} />
          <ellipse cx={m.meridian.cx} cy={m.meridian.cy} rx={m.meridian.rx} ry={m.meridian.ry} />
          <line x1={m.equator.x1} y1={m.equator.y} x2={m.equator.x2} y2={m.equator.y} />
        </g>
        <rect
          x={m.stem.x}
          y={m.stem.y}
          width={m.stem.width}
          height={m.stem.height}
          fill={stroke}
        />
      </g>

      <circle cx="50" cy="50" r="49" fill="none" stroke="#000" strokeOpacity="0.35" strokeWidth="2" />
    </svg>
  );
}
