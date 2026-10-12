/** The 404 page. Words from the dictionary, phone from content; nothing hard-coded. */

import { PrimaryAction } from "@/components/actions";
import { getPrimaryLocation, getSiteSettings, locationPhone, telHref } from "@/content";
import { Icon, TEXT_ICON } from "@/components/Icon";
import { defaultLocale, getDictionary, localePath } from "@/lib/i18n";

/**
 * Shown for any address that does not exist. The layout has already set the page
 * language; the words come from the dictionary and the phone from content, so
 * nothing here is hard-coded. (not-found cannot read params, so English copy is used
 * with the FR and PT lines beneath it.)
 */
export default async function NotFound() {
  const [settings, location] = await Promise.all([getSiteSettings(), getPrimaryLocation()]);
  const phone = locationPhone(location, settings);
  const en = getDictionary("en");
  const fr = getDictionary("fr");
  const pt = getDictionary("pt");
  return (
    <section className="wrap section stack">
      <span className="label">{en.notFound.label}</span>
      <h1>{en.notFound.heading}</h1>
      <p>{en.notFound.body}</p>
      <a href={telHref(phone)} className="phone-link">
        <Icon name="phone" {...TEXT_ICON} />
        {phone}
      </a>
      {settings.languagesEnabled.fr ? <p lang="fr-CA">{fr.notFound.body}</p> : null}
      {settings.languagesEnabled.pt ? <p lang="pt-PT">{pt.notFound.body}</p> : null}
      <PrimaryAction href={localePath(defaultLocale, "/")} icon="home">
        {en.notFound.action}
      </PrimaryAction>
    </section>
  );
}
