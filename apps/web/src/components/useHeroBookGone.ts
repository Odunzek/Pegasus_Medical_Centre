"use client";

/** Hook that says whether the hero's Book action has scrolled away, shared by the header and the phone bar. */

import { useCallback, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

/**
 * How far below the top the hero's Book must scroll before it counts as gone. A little less
 * than the desktop header height (88px) so the header's Book appears just as the hero's hides.
 */
const HANDOVER_MARGIN_PX = 80;

/**
 * One shared store, not one per caller: the header's Book and the phone bar must always
 * agree, so they read the same value.
 */
const store = {
  value: false,
  set(v: boolean) {
    store.value = v;
  },
  get() {
    return store.value;
  },
};

/**
 * True once the page's hero Book action (an element with `data-hero-book`) has
 * scrolled out of view, or at once on pages that have no hero Book. The header's
 * Book link and the phone bar use it so only one Book is visible at a time.
 *
 * Implemented as an external store over an IntersectionObserver so the value is
 * read, never set, during render (no setState-in-effect).
 */
export function useHeroBookGone(): boolean {
  const pathname = usePathname();

  const subscribe = useCallback(
    (onChange: () => void) => {
      const target = document.querySelector<HTMLElement>("[data-hero-book]");
      if (!target) {
        store.set(true);
        onChange();
        return () => {};
      }
      store.set(false);
      onChange();
      const observer = new IntersectionObserver(
        ([entry]) => {
          store.set(!entry.isIntersecting && entry.boundingClientRect.top < 0);
          onChange();
        },
        { rootMargin: `-${HANDOVER_MARGIN_PX}px 0px 0px 0px`, threshold: 0 },
      );
      observer.observe(target);
      return () => observer.disconnect();
    },
    // Re-subscribe on navigation: the new page may or may not have a hero Book
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname],
  );

  return useSyncExternalStore(subscribe, store.get, () => false);
}
