import { Icon } from "@/components/Icon";
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
    <section className="wrap section" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <h1>{title}</h1>
      <p>{dict.comingSoon}</p>
      <a href={telHref(phone)} style={{ display: "inline-flex", alignItems: "center", gap: 12, minHeight: 48, fontWeight: 600 }}>
        <Icon name="phone" size={22} strokeWidth={3.5} />
        {phone}
      </a>
    </section>
  );
}
