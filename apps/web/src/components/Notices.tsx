/** Small notices shown around content: the partly-English fallback note, the Draft mark (preview builds only) and the Temporary photo badge. */

import type { Dictionary } from "@/lib/i18n";
import styles from "./Notices.module.css";

/** Shown at the top of a page when any field on it fell back to English (content model, principle 4). */
export function PartlyEnglishNote({ dict, show }: { dict: Dictionary; show: boolean }) {
  if (!show) return null;
  return (
    <p className={styles.partly} lang="en">
      {dict.partlyEnglish}
    </p>
  );
}

/** Small marker on preview builds for records that are still review: "draft". */
export function DraftMark({ dict, show = true }: { dict: Dictionary; show?: boolean }) {
  if (!show) return null;
  return <span className={styles.draft}>{dict.draft}</span>;
}

/** Badge over a stock stand-in photograph. Preview builds only; production refuses temporary images. */
export function TemporaryPhotoBadge({ dict }: { dict: Dictionary }) {
  return <span className={styles.temp}>{dict.temporaryPhoto}</span>;
}
