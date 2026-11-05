/** The site's actions. There are no rectangular buttons: PrimaryAction (Lora text + filled circle), ArrowLink (text + outlined circle) and CircleArrow (the circle alone, for whole-row links). Rules: CLAUDE.md "Design rules". */

import Link from "next/link";
import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/Icon";

/** True for links that leave the site or open the phone app; those use a plain <a>, not Next's Link. */
function isExternal(href: string) {
  return /^(https?:|tel:|mailto:)/.test(href);
}

/** Arrow size inside the 64px filled circle and the 48px outlined one, with a line weight that matches each. */
const ARROW = { filled: { size: 26, strokeWidth: 3.4 }, outlined: { size: 22, strokeWidth: 3.2 } } as const;

/**
 * Classes for the circle and its arrow. The hover effects are driven by the action around it
 * (Tailwind named groups: group/primary on PrimaryAction, group/secondary on ArrowLink), so a
 * circle on its own in a row stays still. Motion is switched off under prefers-reduced-motion.
 */
const CIRCLE =
  "inline-flex flex-none items-center justify-center rounded-full transition-[background-color,color,scale] duration-200 motion-reduce:transition-none " +
  "[&_svg]:transition-transform [&_svg]:duration-200 motion-reduce:[&_svg]:transition-none";
const CIRCLE_FILLED =
  "size-circle-primary bg-soft-green text-deep-teal group-hover/primary:scale-106 group-hover/primary:[&_svg]:translate-x-0.75 " +
  "motion-reduce:group-hover/primary:scale-100 motion-reduce:group-hover/primary:[&_svg]:translate-x-0";
const CIRCLE_OUTLINED =
  "size-circle-secondary border-2 border-soft-green text-current " +
  "group-hover/secondary:bg-soft-green group-hover/secondary:text-deep-teal group-hover/secondary:[&_svg]:translate-x-0.75 " +
  "motion-reduce:group-hover/secondary:[&_svg]:translate-x-0";

/** What the filled circle turns into on hover: white on photos and Deep Teal, Deep Teal on white and Pale Neutral. */
const CIRCLE_HOVER = {
  light: "group-hover/primary:bg-white group-hover/primary:text-deep-teal",
  ink: "group-hover/primary:bg-deep-teal group-hover/primary:text-white",
} as const;

/** The circle on its own, for rows and tiles that are links themselves. `className` adds the hover colours when it sits inside an action. */
export function CircleArrow({ filled = false, icon = "arrow", className }: { filled?: boolean; icon?: IconName; className?: string }) {
  const arrow = filled ? ARROW.filled : ARROW.outlined;
  return (
    <span className={[CIRCLE, filled ? CIRCLE_FILLED : CIRCLE_OUTLINED, className].filter(Boolean).join(" ")} aria-hidden="true">
      <Icon name={icon} size={arrow.size} strokeWidth={arrow.strokeWidth} />
    </span>
  );
}

/** Lora text beside the 64px circle; the soft-green underline appears on hover. */
const PRIMARY =
  "group/primary inline-flex items-center gap-5 min-h-circle-primary font-serif font-medium text-primary-action tracking-heading text-inherit no-underline " +
  "hover:text-inherit hover:underline hover:decoration-2 hover:underline-offset-8 hover:decoration-soft-green";

/** Montserrat text beside the 48px outlined circle; underlined on hover. The text size comes from SECONDARY_SIZE. */
const SECONDARY =
  "group/secondary inline-flex items-center gap-4 min-h-circle-secondary font-semibold text-inherit no-underline " +
  "hover:text-inherit hover:underline hover:decoration-thin hover:underline-offset-6";

/**
 * Text sizes for ArrowLink. A size is a prop rather than a className because two Tailwind font-size
 * classes on one element do not override each other by order; `small` is the header's Book link.
 */
const SECONDARY_SIZE = { default: "text-action", small: "text-small/5.5" } as const;

type ActionProps = {
  href: string;
  children: ReactNode;
  /** `light` on photos and Deep Teal, `ink` on white and Pale Neutral. */
  tone?: "light" | "ink";
  icon?: IconName;
  className?: string;
  /** Marks the hero's Book action: the header's Book and the phone bar appear once it scrolls away. */
  heroBook?: boolean;
  /** ArrowLink only: `small` for tight spots such as the header. */
  size?: keyof typeof SECONDARY_SIZE;
  rel?: string;
  target?: string;
};

/** Primary action: Lora text + 64px soft-green filled circle. One per screen. */
export function PrimaryAction({ href, children, tone = "ink", icon = "arrow", className, heroBook, rel, target }: Omit<ActionProps, "size">) {
  const cls = [PRIMARY, className].filter(Boolean).join(" ");
  const inner = (
    <>
      {children}
      <CircleArrow filled icon={icon} className={CIRCLE_HOVER[tone]} />
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
export function ArrowLink({ href, children, icon = "arrow", size = "default", className, rel, target }: Omit<ActionProps, "tone" | "heroBook">) {
  const cls = [SECONDARY, SECONDARY_SIZE[size], className].filter(Boolean).join(" ");
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
