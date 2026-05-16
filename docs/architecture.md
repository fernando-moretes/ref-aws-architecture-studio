# Architecture

`aws-architecture-studio` is a Next.js 16 application with a sharp separation
between data, presentation and interactivity. The app is fully renderable
without a database — patterns, services and ADR/diagram logic live as
TypeScript modules.

## Components

- **Frontend (Next.js 16, App Router):** server components for catalog and
  pattern pages; client components for the ADR wizard, diagram builder and
  Mermaid renderer.
- **Pure data libraries** under `frontend/lib/`:
  - `aws-services.ts` — service catalog and lookup helpers.
  - `patterns.ts` — reference patterns with full metadata.
  - `adr.ts` — ADR shape and Markdown renderer.
  - `diagram-builder.ts` — Mermaid serializer.
- **CI/CD (GitHub Actions):** validate, build, scan, deploy.
- **Hosting:** Vercel; DNS via Cloudflare for `studio.moretes.com`.

## Data flow

```
User input
   ▼
React state (page-level)
   ▼
Pure renderers in lib/  →  Mermaid (client) / Markdown preview / Download
```

There is no backend in v1; every interaction happens in the browser. State is
ephemeral by design — sharing happens by copying the produced artifact (ADR
Markdown or Mermaid source) into a Git repo or a PR.

## Roadmap

1. Persist drafts in `localStorage` so navigating between routes doesn't reset
   form state.
2. Add a "load pattern as ADR seed" affordance so a pattern detail can launch
   the ADR wizard prefilled.
3. Add export-as-SVG and export-as-PNG to the diagram builder.
4. Add an MCP server companion that lets AI agents author ADRs and diagrams
   through this same library code.
