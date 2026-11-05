/** Small notices shown around content: the partly-English fallback note, the Draft mark (preview builds only) and the Temporary photo badge. */

import type { Dictionary } from "@/lib/i18n";

/** The Draft pill: small uppercase text in a 1.5px soft-green outline (the same weight as the site's underlines). */
const DRAFT_MARK =
  "ml-2 inline-block rounded-full border-[1.5px] border-soft-green px-2.5 py-0.5 align-middle font-sans text-badge font-semibold tracking-badge uppercase";

/** Shown at the top of a page when any field on it fell back to English (content model, principle 4). */
export function PartlyEnglishNote({ dict, show }: { dict: Dictionary; show: boolean }) {
  if (!show) return null;
  return (
    <p className="max-w-none bg-surface-alt px-gutter py-2.5 text-small" lang="en">
      {dict.partlyEnglish}
    </p>
  );
}

/** Small marker on preview builds for records that are still review: "draft". */
export function DraftMark({ dict, show = true }: { dict: Dictionary; show?: boolean }) {
  if (!show) return null;
  return <span className={DRAFT_MARK}>{dict.draft}</span>;
}

/** Badge over a stock stand-in photograph. Preview builds only; production refuses temporary images. */
export function TemporaryPhotoBadge({ dict }: { dict: Dictionary }) {
  return <span className="absolute top-4 right-gutter z-1 rounded-full bg-white/85 px-2.5 py-1 text-badge/4.5 text-deep-teal">{dict.temporaryPhoto}</span>;
}
