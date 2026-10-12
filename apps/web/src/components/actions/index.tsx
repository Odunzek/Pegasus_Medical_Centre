/** The site's actions. There are no rectangular buttons: PrimaryAction (Lora text + filled circle), ArrowLink (text + outlined circle) and CircleArrow (the circle alone, for whole-row links). Rules: CLAUDE.md "Design rules". */

import Link from "next/link";
import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/Icon";
import styles from "./actions.module.css";

/** True for links that leave the site or open the phone app; those use a plain <a>, not Next's Link. */
function isExternal(href: string) {
  return /^(https?:|tel:|mailto:)/.test(href);
}

/** Arrow size inside the 64px filled circle and the 48px outlined one, with a line weight that matches each. */
const ARROW = { filled: { size: 26, strokeWidth: 3.4 }, outlined: { size: 22, strokeWidth: 3.2 } } as const;

/** The circle on its own, for rows and tiles that are links themselves. */
export function CircleArrow({ filled = false, icon = "arrow" }: { filled?: boolean; icon?: IconName }) {
  const arrow = filled ? ARROW.filled : ARROW.outlined;
  return (
    <span className={`${styles.circle} ${filled ? styles.filled : styles.outlined}`} aria-hidden="true">
      <Icon name={icon} size={arrow.size} strokeWidth={arrow.strokeWidth} />
    </span>
  );
}

type ActionProps = {
  href: string;
  children: ReactNode;
  /** `light` on photos and Deep Teal, `ink` on white and Pale Neutral. */
  tone?: "light" | "ink";
  icon?: IconName;
  className?: string;
  /** Marks the hero's Book action: the header's Book and the phone bar appear once it scrolls away. */
  heroBook?: boolean;
  rel?: string;
  target?: string;
};

/** Primary action: Lora text + 64px soft-green filled circle. One per screen. */
export function PrimaryAction({ href, children, tone = "ink", icon = "arrow", className, heroBook, rel, target }: ActionProps) {
  const cls = [styles.primary, tone === "light" ? styles.primaryLight : styles.primaryInk, className].filter(Boolean).join(" ");
  const inner = (
    <>
      {children}
      <CircleArrow filled icon={icon} />
    </>
  );
  if (isExternal(href)) {
    return (
      <a href={href} className={cls} data-hero-book={heroBook ? "" : undefined} rel={rel} target={target}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} data-hero-book={heroBook ? "" : undefined}>
      {inner}
    </Link>
  );
}

/** Secondary action: Montserrat text + 48px outlined circle. */
export function ArrowLink({ href, children, icon = "arrow", className, rel, target }: Omit<ActionProps, "tone" | "heroBook">) {
  const cls = [styles.secondary, className].filter(Boolean).join(" ");
  const inner = (
    <>
      {children}
      <CircleArrow icon={icon} />
    </>
  );
  if (isExternal(href)) {
    return (
      <a href={href} className={cls} rel={rel} target={target}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
