# Sanity Studio (content back office)

Not created yet: Sanity needs the owner to sign in once, so this step is done by hand by Kachi.

From the repository root:

```
npm create sanity@latest -- --project-plan free --dataset production --template clean --typescript --output-path apps/studio
```

Sign in with the account that will own the project (the clinic's or Kempyre's, never a personal one), accept the free plan, and name the project "Pegasus Medical Centre".

After it is created:

1. Copy the project ID and dataset into `apps/web/.env.local` (names in `apps/web/.env.example`).
2. Build the schema from `docs/content-model-v1.md` (v1.1), one file per record type under `apps/studio/schemaTypes/`, matching `apps/web/src/content/types.ts` field for field. The `architecture-reviewer` checks the three agree.
3. Roles: the free plan has Administrator and Editor only, with no per-field permissions. Keep Site settings and Provider approval out of the Editor's menu through the Studio structure (desk structure), and record in the handover note that Editors are asked not to touch them. If the clinic needs it enforced later, the Growth plan adds custom roles; the model does not change.
4. Add a publish webhook pointing at the site's revalidate route (or a Vercel deploy hook) with `SANITY_REVALIDATE_SECRET`, so a publish rebuilds the site within about a minute.
5. Rewrite `apps/web/src/content/index.ts` to query Sanity (drafts only when `SHOW_DRAFTS=true`, through a read token that never reaches the browser). Pages do not change.
6. Run `npm run studio` and walk through the Editor's day: change hours, add a holiday exception, write a notice, update a service, switch the announcement bar.
