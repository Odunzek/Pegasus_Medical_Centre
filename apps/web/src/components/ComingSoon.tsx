/** Placeholder body for routes whose template is not built yet, so shell links never 404 while the site is being built. */

import { Icon, TEXT_ICON } from "@/components/Icon";
import { getPrimaryLocation, getSiteSettings, locationPhone, telHref } from "@/content";
import { getDictionary, type Locale } from "@/lib/i18n";

/**
 * Placeholder body for a route whose template has not been built yet, so shell
 * links never 404 and the preview stays navigable. Replaced chunk by chunk.
 */
export async function ComingSoon({ locale, title }: { locale: Locale; title: string }) {
  const dict = getDictionary(locale);
  const [settings, location] = await Promise.all([getSiteSettings(), getPrimaryLocation()]);
  const phone = locationPhone(location, settings);
  return (
    <section className="wrap section stack">
      <h1>{title}</h1>
      <p>{dict.comingSoon}</p>
      <a href={telHref(phone)} className="phone-link">
        <Icon name="phone" {...TEXT_ICON} />
        {phone}
      </a>
    </section>
  );
}
