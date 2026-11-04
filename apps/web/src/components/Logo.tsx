/** The Pegasus logo as an image, picking the right brand file for the background it sits on. */

import Image from "next/image";

/**
 * The horizontal logo, from the brand package v1.4 (files in public/brand are the
 * supplied SVGs with their print clear space cropped; never redraw or recolour).
 * `tone` picks the file for the background it sits on; `compact` is the narrow-screen cut.
 */
/** The drawn area of each brand file (its viewBox after the print clear space was cropped), used to size the image without distortion. */
const VIEWBOX = { wide: { w: 2820, h: 1000 }, compact: { w: 2070, h: 800 } };

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
  const box = compact ? VIEWBOX.compact : VIEWBOX.wide;
  const ratio = box.w / box.h;
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
