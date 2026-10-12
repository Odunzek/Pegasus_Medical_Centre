/**
 * General information pages from the Page record type (About, New patients, Fees and
 * coverage, Privacy, Accessibility, Terms), at /<lang>/<slug>.
 *
 * Two things to know: (1) this is a catch-all segment, so a Page whose slug equals a
 * fixed route (services, locations, doctors, resources, contact) can never be reached;
 * (2) only richText, steps, twoColumn and cta sections are rendered so far; image and
 * faqGroup sections show a visible "not rendered yet" marker on previews until the
 * general-pages chunk builds them.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DraftMark, PartlyEnglishNote } from "@/components/Notices";
import { getPage, getPages, getSiteSettings, showDrafts } from "@/content";
import { anyFallback, getDictionary, isLocale, locales, t } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

/**
 * General information pages from the Page record type (About, New patients, Fees and
 * coverage, Privacy, Accessibility, Terms). Minimal template: title + sections.
 * The full design treatment comes with the "general pages" chunk.
 */

/** Pre-builds every Page record in every language. */
export async function generateStaticParams() {
  const pages = await getPages();
  return locales.flatMap((lang) => pages.map((p) => ({ lang, page: p.slug })));
}

/** Title, description, canonical and hreflang for this page, built through pageMetadata() so every page is consistent. */
export async function generateMetadata({ params }: PageProps<"/[lang]/[page]">): Promise<Metadata> {
  const { lang, page: slug } = await params;
  if (!isLocale(lang)) return {};
  const [settings, page] = await Promise.all([getSiteSettings(), getPage(slug)]);
  if (!page) return {};
  return pageMetadata({
    locale: lang,
    path: `/${slug}`,
    title: t(page.seo?.title, lang) || t(page.title, lang),
    description: t(page.seo?.description, lang) || t(settings.seo.description, lang),
    settings,
    image: page.hero?.src,
  });
}

/** Renders a Page record: title, then each section block in order. Shows the partly-English note when a field fell back. */
export default async function GeneralPage({ params }: PageProps<"/[lang]/[page]">) {
  const { lang, page: slug } = await params;
  if (!isLocale(lang)) notFound();
  const page = await getPage(slug);
  if (!page) notFound();
  const dict = getDictionary(lang);
  const fields = [page.title, ...page.sections.flatMap((s) => (s.type === "richText" ? [s.body] : s.type === "steps" ? [s.heading, ...s.steps] : s.type === "twoColumn" ? [s.left, s.right] : s.type === "cta" ? [s.heading, s.text] : []))];

  return (
    <>
      <PartlyEnglishNote dict={dict} show={anyFallback(fields, lang)} />
      <article className="wrap section stack">
        <h1>
          {t(page.title, lang)}
          {showDrafts && page.review === "draft" ? <DraftMark dict={dict} /> : null}
        </h1>
        {page.sections.map((section, i) => {
          switch (section.type) {
            case "richText":
              return <p key={i}>{t(section.body, lang)}</p>;
            case "steps":
              return (
                <div key={i} className="stack">
                  {section.heading ? <h2>{t(section.heading, lang)}</h2> : null}
                  <ol className="measure steps">
                    {section.steps.map((step, j) => (
                      <li key={j}>{t(step, lang)}</li>
                    ))}
                  </ol>
                </div>
              );
            case "twoColumn":
              return (
                <div key={i} className="measure stack">
                  <p>{t(section.left, lang)}</p>
                  <p>{t(section.right, lang)}</p>
                </div>
              );
            case "cta":
              return (
                <div key={i}>
                  <h2>{t(section.heading, lang)}</h2>
                  {section.text ? <p>{t(section.text, lang)}</p> : null}
                </div>
              );
            default:
              // image and faqGroup sections: built in the general-pages chunk. Visible on previews so nothing is silently lost.
              return showDrafts ? (
                <p key={i} className="small">
                  [{section.type} section: not rendered yet]
                </p>
              ) : null;
          }
        })}
      </article>
    </>
  );
}
