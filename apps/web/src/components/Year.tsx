"use client";

import { useSyncExternalStore } from "react";

/** The current year for the copyright line, read in the browser so static pages never carry a build-time clock. */
export function Year() {
  const year = useSyncExternalStore(
    () => () => {},
    () => new Date().getFullYear(),
    () => 2026,
  );
  return <>{year}</>;
}
