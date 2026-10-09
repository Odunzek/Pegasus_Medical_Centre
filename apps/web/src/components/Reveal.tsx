"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Rises its children once when they scroll into view (IntersectionObserver).
 * Pure CSS under prefers-reduced-motion: the .reveal rules switch the effect off.
 */
export function Reveal({ children, className, as: Tag = "div" }: { children: ReactNode; className?: string; as?: "div" | "section" | "li" }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-in");
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-in");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    // @ts-expect-error: ref type varies with the tag; all three are HTMLElements
    <Tag ref={ref} className={["reveal", className].filter(Boolean).join(" ")}>
      {children}
    </Tag>
  );
}
