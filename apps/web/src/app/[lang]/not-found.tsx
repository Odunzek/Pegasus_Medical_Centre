import { PrimaryAction } from "@/components/actions";

/** Shown for any address that does not exist. Languages: the layout sets the page language; copy is kept to English + a short line in each. */
export default function NotFound() {
  return (
    <section className="wrap section" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <span className="label">404</span>
      <h1>We could not find that page.</h1>
      <p>
        The address may have changed. The homepage has everything: services, hours, and how to book. If you need the
        clinic now, call 416 656 7272.
      </p>
      <p lang="fr-CA">Page introuvable. Retournez à l&apos;accueil ou appelez le 416 656 7272.</p>
      <p lang="pt-PT">Página não encontrada. Volte à página inicial ou ligue para o 416 656 7272.</p>
      <PrimaryAction href="/" icon="home">
        Go to the homepage
      </PrimaryAction>
    </section>
  );
}
