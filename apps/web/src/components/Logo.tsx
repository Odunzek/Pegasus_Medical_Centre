import Image from "next/image";

/**
 * The horizontal logo, from the brand package v1.4 (files in public/brand are the
 * supplied SVGs with their print clear space cropped; never redraw or recolour).
 * `tone` picks the file for the background it sits on; `compact` is the narrow-screen cut.
 */
export function Logo({
  tone = "full-colour",
  compact = false,
  height = 64,
  priority = false,
  className,
}: {
  tone?: "full-colour" | "reversed-colour" | "white";
  compact?: boolean;
  height?: number;
  priority?: boolean;
  className?: string;
}) {
  const ratio = compact ? 2070 / 800 : 2820 / 1000;
  const width = Math.round(height * ratio);
  const file = compact ? `pegasus-horizontal-compact-${tone}.svg` : `pegasus-horizontal-${tone}.svg`;
  return (
    <Image
      src={`/brand/${file}`}
      alt=""
      width={width}
      height={height}
      priority={priority}
      className={className}
      style={{ width, height }}
    />
  );
}
