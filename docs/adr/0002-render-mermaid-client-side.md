# 2. Render Mermaid diagrams client-side

- **Status:** accepted
- **Date:** 2026-05-15
- **Deciders:** Fernando Francisco Azevedo

## Context and Problem Statement

The Diagram Builder and pattern detail pages render Mermaid charts. Mermaid
ships a sizeable bundle (a few hundred KB). Loading it on every page would
inflate the landing-page bundle for users who never view a diagram.

## Considered Alternatives

- **Server-side rendering with `mermaid-cli`** — accurate but adds a build-time
  dependency on headless Chromium.
- **Pre-rendered SVGs checked into the repo** — fast, but each pattern change
  requires regenerating SVGs, breaking the "data is the source of truth" model.
- **Client-side dynamic import** (chosen).

## Decision

Render Mermaid client-side via a dedicated `Mermaid.tsx` component that
dynamically imports `mermaid` only when mounted. The component initializes the
library once (module-level guard) and renders into a ref.

## Consequences

- Landing page stays small; users only download Mermaid when they visit a
  page that actually uses it.
- Diagrams require JavaScript — a tradeoff acceptable for an interactive tool.
- Mermaid version bumps need a smoke test on the diagrams and patterns pages.
