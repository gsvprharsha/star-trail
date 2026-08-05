# Star Trail

Track a GitHub repository's star history and generate a chart you can embed
anywhere. Paste a repo and a Personal Access Token to import its stargazer data,
then drop the generated chart into your README or site.

## Stack

- [Next.js 16](https://nextjs.org/) (App Router) + React 19
- [Prisma 7](https://www.prisma.io/) on Postgres (Supabase)
- Tailwind CSS 4 + shadcn/ui, `next-themes` for light/dark
- Custom `dither-kit` charts (d3-scale/d3-shape + motion)
- PATs stored AES-256 encrypted

## Setup

```bash
npm install
cp .env.example .env   # fill in the values below
npx prisma migrate deploy
npm run dev
```

### Environment

| Var | Purpose |
| --- | --- |
| `DATABASE_URL` | Pooled Postgres connection (Prisma queries) |
| `DIRECT_URL` | Direct Postgres connection (Prisma migrations) |
| `ENCRYPTION_PASSPHRASE` | Long random secret used to encrypt stored PATs |
| `NEXT_PUBLIC_APP_URL` | Public deployment URL, used in embed snippets |

## Scripts

- `npm run dev` — dev server
- `npm run build` / `npm start` — production build & serve
- `npm run lint` / `npm run typecheck` / `npm run format`

## Embedding

Each tracked repo has a page at `/{owner}/{repo}` with a copy-paste embed
snippet backed by `/api/chart/{owner}/{repo}`.

## License

MIT — see [LICENSE](./LICENSE).
