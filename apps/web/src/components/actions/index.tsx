import Link from "next/link";
import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/Icon";
import styles from "./actions.module.css";

function isExternal(href: string) {
  return /^(https?:|tel:|mailto:)/.test(href);
}

/** The circle on its own, for rows and tiles that are links themselves. */
export function CircleArrow({ filled = false, icon = "arrow" }: { filled?: boolean; icon?: IconName }) {
  const size = filled ? 26 : 22;
  return (
    <span className={`${styles.circle} ${filled ? styles.filled : styles.outlined}`} aria-hidden="true">
      <Icon name={icon} size={size} strokeWidth={filled ? 3.4 : 3.2} />
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

/** Class for a whole-row link (a service row, a quick-action tile) whose circle should respond to hover. */
export const rowHoverClass = styles.rowHover;
