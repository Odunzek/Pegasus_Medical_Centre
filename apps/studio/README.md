# Sanity Studio (content back office)

Not created yet: Sanity needs the owner to sign in once, so this step is done by hand.

From the repository root:

```
npm create sanity@latest -- --project-plan free --dataset production --template clean --typescript --output-path apps/studio
```

Sign in with the account that will own the project (the clinic's or Kempyre's, not a personal one), accept the free plan, and name the project "Pegasus Medical Centre".

After it is created:

1. Copy the project ID and dataset into `apps/web/.env.local` (see `apps/web/.env.example`).
2. Build the schema from `docs/content-model-v1.md`, one file per record type under `apps/studio/schemaTypes/`.
3. Run `npm run studio` and check that an Editor sees only the fields listed for that role.
