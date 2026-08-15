# AGENTS.md

## Commands

- `pnpm dev` / `pnpm build` / `pnpm lint`
- `pnpm test` is watch mode — use `pnpm test:run` for one-shot
- `pnpm test:run src/path/to/file.test.tsx` runs a single test
- No standalone typecheck script; `tsc -b` only runs inside `pnpm build`
- `pnpm build:grammar` regenerates the Peggy parser (see Codegen)

**Package manager:** pnpm (canonical lockfile is `pnpm-lock.yaml`; a stale `package-lock.json` also exists).

## Codegen

- `src/costModule/parser/price.peggy` → `pnpm build:grammar` → `src/costModule/parser/pricing-parser.js`
- The generated `.js` + `.d.ts` are committed; never hand-edit them
- Imported by `src/costModule/hoocks/useGetSemanticalTree.tsx`

## Environment

- `.env` must exist before `pnpm dev` — the `FetchWapper` singleton (`src/utilities/fecth.tsx`) throws if `VITE_API_BASE_URL` is missing
- `VITE_SITE_URL` is read by the post-build sitemap script (`scripts/generate-sitemap.js`); falls back to `.env` / `.env.local` / `.env.example`

## Architecture

- React 19 + Vite 8 SPA; Tailwind v4 via `@tailwindcss/vite` (no `tailwind.config`)
- Path alias: `@/` → `src/`
- Feature modules under `src/`: `costModule`, `drawModule`, `shapeModule`, `materialModule`, `paymentModule`, `userModule`, `fileService`, `autentification`, `utilities`, `core`
- Routing: `src/core/routing.tsx` exports `AppRouter`; three route arrays — `PublicRoutes`, `PrivateRoutes` (requires token), `adminRoutes` (requires token + `user.isAdmin`)
- All API calls through singleton `FetchWapper` in `src/utilities/fecth.tsx`; JWT stored in `localStorage` key `token`; 401/403 auto-clears token
- shadcn/ui components live in `src/components/ui`; config in `components.json` (new-york style)

## Naming gotchas — don't rename

These directories/files have intentional misspellings baked into imports across the codebase:

- `src/autentification/` (not "authentication")
- `src/costModule/hoocks/` (not "hooks")
- `src/utilities/fecth.tsx` (not "fetch")

## TypeScript strictness

- `verbatimModuleSyntax` — must use `import type` for type-only imports
- `erasableSyntaxOnly` — no enums, namespaces, or parameter properties
- `noUnusedLocals` + `noUnusedParameters` — unused vars must be prefixed with `_`

## ESLint

- `src/components/` is entirely ignored by ESLint (shadcn generated code)
- Index files (`index.ts`, `index.tsx`) are exempt from `react-refresh/only-export-components`
- Unused vars pattern: `argsIgnorePattern: "^_"`, `varsIgnorePattern: "^_"`, `caughtErrorsIgnorePattern: "^_"`

## Tests

- Vitest + jsdom + Testing Library; globals enabled; setup file `src/setupTests.ts`
- Single test: `pnpm vitest run src/path/to/file.test.tsx`

## Deploy

- SPA fallback rewrites configured in `vercel.json`
- Dockerfile only serves prebuilt `dist/` with `serve`; build must happen before `docker build`
