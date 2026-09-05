import { buildOrb } from "@/lib/orbis/orb";

/**
 * The ORBIS mark, generated from the same sphere maths as the dial.
 * The logo on the site and the logo on the watch are literally the same object.
 */
export function OrbisMark({ size = 28, className }: { size?: number; className?: string }) {
  const cells = buildOrb(50, 50, 47);
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {cells.map((c, i) => (
        <path key={i} d={c.d} fill="currentColor" />
      ))}
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
