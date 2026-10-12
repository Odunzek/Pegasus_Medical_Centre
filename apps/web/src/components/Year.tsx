"use client";

/** The current year for the footer's copyright line. */

import { useSyncExternalStore } from "react";

/**
 * The year the site was last built, used only for the first paint before JavaScript runs
 * (static pages cannot read a clock at build time under Cache Components). Bump it each January;
 * the browser replaces it with the real year on load, so being a year behind is invisible in practice.
 */
const FALLBACK_YEAR = 2026;

/** The current year for the copyright line, read in the browser so static pages never carry a build-time clock. */
export function Year() {
  const year = useSyncExternalStore(
    () => () => {},
    () => new Date().getFullYear(),
    () => FALLBACK_YEAR,
  );
  return <>{year}</>;
}
