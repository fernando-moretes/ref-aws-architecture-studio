# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project overview

`aws-architecture-studio` is the largest portfolio project in Fernando
Azevedo's collection: a Next.js application that combines an ADR generator, a
Mermaid AWS diagram builder, a reference-pattern catalog, and an AWS service
catalog. Hosted at `studio.moretes.com`.

## Tech stack

- Next.js 16 (App Router), React 19, TypeScript 5
- Tailwind CSS 4
- Mermaid 11 (dynamically imported in `components/Mermaid.tsx`)
- GitHub Actions: CI, Frontend, Vercel, Security

## Development commands

```bash
cd frontend
npm install
npm run dev
npm run build
npm run lint
```

## Repository layout

- `frontend/app/`
  - `page.tsx` — landing
  - `adr/page.tsx` — six-step ADR wizard (client component)
  - `diagrams/page.tsx` — Mermaid AWS diagram builder (client component)
  - `patterns/page.tsx` — pattern index
  - `patterns/[slug]/page.tsx` — pattern detail (uses `generateStaticParams`)
  - `services/page.tsx` — AWS catalog
- `frontend/lib/`
  - `aws-services.ts` — 37+ services with metadata (`AwsService`, `AWS_SERVICES`,
    `servicesByCategory`, `findService`)
  - `patterns.ts` — six patterns with full ADR/diagram/pillar data
  - `adr.ts` — `AdrInput`, `renderAdrMarkdown`, `suggestedFilename`
  - `diagram-builder.ts` — `DiagramSpec`, `renderMermaid`
- `frontend/components/`
  - `Nav.tsx`, `Footer.tsx` — site chrome
  - `Mermaid.tsx` — client-only Mermaid renderer (dynamic import)
- `docs/` — architecture, ADRs, diagrams
- `.github/workflows/` — pipelines

## Key conventions

- **Pure libs:** anything in `frontend/lib/` is pure data + functions. No I/O.
  Pages and components compose.
- **Client components:** only `app/adr/page.tsx`, `app/diagrams/page.tsx` and
  `components/Mermaid.tsx` carry `"use client"`. Catalog and pattern pages are
  server components for free SEO and prerendering.
- **Adding a service:** add to `AWS_SERVICES` in `lib/aws-services.ts`. The
  catalog page and diagram builder pick it up automatically.
- **Adding a pattern:** add to `PATTERNS` in `lib/patterns.ts`. The index and
  the dynamic `[slug]` route pick it up automatically (incl. `generateStaticParams`).
- **Mermaid:** rendered client-side via dynamic `import("mermaid")` to keep the
  initial bundle small.
