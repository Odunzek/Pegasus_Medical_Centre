/**
 * The website icon set, drawn on one 48-unit grid with a 3-unit round-capped line
 * (same grid as the brand package's 13-website-icons). Inline SVG so it takes the
 * text colour wherever it sits. Decorative by default; pass `label` to make it
 * meaningful on its own (rare: an icon is always paired with a word).
 */

const paths: Record<IconName, string[]> = {
  home: ["M6 22 24 7l18 15", "M11 18v21h26V18", "M20 39V29h8v10"],
  about: ["M24 7a17 17 0 1 0 0 34 17 17 0 0 0 0-34z", "M24 22v11", "M24 15.5v.1"],
  services: [
    "M10.5 15h27a3.5 3.5 0 0 1 3.5 3.5v16a3.5 3.5 0 0 1-3.5 3.5h-27A3.5 3.5 0 0 1 7 34.5v-16A3.5 3.5 0 0 1 10.5 15z",
    "M18 15v-3.5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2V15",
    "M24 21v11M18.5 26.5h11",
  ],
  providers: ["M13 8v10a8 8 0 0 0 16 0V8", "M10.5 8h5M26.5 8h5", "M21 26v3a9 9 0 0 0 18 0v-4", "M39 18a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z"],
  phone: [
    "M16.3 7.5h-5.5a3.3 3.3 0 0 0-3.3 3.6C8.8 26.3 21.7 39.2 36.9 40.5a3.3 3.3 0 0 0 3.6-3.3v-5.5a2 2 0 0 0-1.6-2l-6.5-1.5a2 2 0 0 0-1.9.6l-3.1 3.3A25.5 25.5 0 0 1 16 20.7l3.3-3.1a2 2 0 0 0 .6-1.9L18.3 9.1a2 2 0 0 0-2-1.6z",
  ],
  location: ["M24 42S11 29.8 11 19a13 13 0 0 1 26 0c0 10.8-13 23-13 23z", "M24 13.5v11M18.5 19h11"],
  faqs: [
    "M9 9.5h30a3 3 0 0 1 3 3V30a3 3 0 0 1-3 3H21l-8.5 7v-7H9a3 3 0 0 1-3-3V12.5a3 3 0 0 1 3-3z",
    "M19.6 17.6a4.5 4.5 0 1 1 6.2 4.2c-1.1.5-1.8 1.4-1.8 2.6v.6",
    "M24 29v.1",
  ],
  resources: ["M24 13c-4.5-3-10.5-4-17-3.5v26c6.5-.5 12.5.5 17 3.5 4.5-3 10.5-4 17-3.5v-26c-6.5-.5-12.5.5-17 3.5z", "M24 13v26"],
  appointments: [
    "M11 10h26a3 3 0 0 1 3 3v24a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3V13a3 3 0 0 1 3-3z",
    "M8 19h32",
    "M17 6v8M31 6v8",
    "M18 29.5l4 4 8-8",
  ],
  language: [
    "M24 7a17 17 0 1 0 0 34 17 17 0 0 0 0-34z",
    "M24 7c-5 4.6-7.5 10.3-7.5 17s2.5 12.4 7.5 17c5-4.6 7.5-10.3 7.5-17S29 11.6 24 7z",
    "M7 24h34",
  ],
  arrow: ["M8 24h30", "M26 12l12 12-12 12"],
  menu: ["M8 16h32M8 32h32"],
  close: ["M12 12l24 24M36 12L12 36"],
  clock: ["M24 7a17 17 0 1 0 0 34 17 17 0 0 0 0-34z", "M24 14v10l7 5"],
};

/** The icons available. Add a path set to `paths` and a name here together. */
/** The size and stroke for an icon sitting beside text (phone, pin): 22px with a slightly heavier line reads at body size. */
export const TEXT_ICON = { size: 22, strokeWidth: 3.5 } as const;

export type IconName =
  | "home"
  | "about"
  | "services"
  | "providers"
  | "phone"
  | "location"
  | "faqs"
  | "resources"
  | "appointments"
  | "language"
  | "arrow"
  | "menu"
  | "close"
  | "clock";

/** One icon from the set, drawn in the current text colour. Decorative unless `label` is given. */
export function Icon({
  name,
  size = 24,
  label,
  className,
  strokeWidth = 3,
}: {
  name: IconName;
  size?: number;
  label?: string;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      className={className}
    >
      {label ? <title>{label}</title> : null}
      {paths[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
