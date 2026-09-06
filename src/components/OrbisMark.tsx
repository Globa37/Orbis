import { buildMark } from "@/lib/orbis/mark";

/**
 * The ORBIS mark.
 *
 * The drawn mark, not the dial's filled grid: a circle, one meridian, the
 * equator, and the crown stem on the pole. The same geometry the dial swatches
 * use, so the logo in the header and the miniature beside a colourway are one
 * object seen at two sizes rather than two drawings that have to be kept in
 * step by hand.
 *
 * The stroke is deliberately heavier than the artwork's own proportion. The
 * supplied logo is drawn at a size where a hairline reads; in a 24px header
 * that same hairline is a third of a pixel and disappears. The swatches keep
 * the true ratio because they are rendered large enough to carry it.
 */
const LOGO_STROKE = 4;

export function OrbisMark({ size = 28, className }: { size?: number; className?: string }) {
  const m = buildMark(50, 54, 31);

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke="currentColor" strokeWidth={LOGO_STROKE}>
        <circle cx={m.circle.cx} cy={m.circle.cy} r={m.circle.r} />
        <ellipse cx={m.meridian.cx} cy={m.meridian.cy} rx={m.meridian.rx} ry={m.meridian.ry} />
        <line x1={m.equator.x1} y1={m.equator.y} x2={m.equator.x2} y2={m.equator.y} />
      </g>
      <rect
        x={m.stem.x}
        y={m.stem.y}
        width={m.stem.width}
        height={m.stem.height}
        fill="currentColor"
      />
    </svg>
  );
}

/** Mark plus wordmark, the standard lockup. */
export function OrbisLogo({ size = 26, className = "" }: { size?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <OrbisMark size={size} />
      <span
        className="u-wordmark leading-none"
        style={{ fontSize: `${size * 0.62}px`, paddingLeft: "0.1em" }}
      >
        Orbis
      </span>
    </span>
  );
}
