# AWS Architecture Studio

A working studio for AWS solution architects: an ADR generator with live
Markdown preview, a Mermaid-based AWS diagram builder, a curated catalog of
reference patterns, and a quick-reference for the AWS service catalog — all in
one open-source application.

![CI](https://github.com/fernandofatech/aws-architecture-studio/actions/workflows/ci.yml/badge.svg)
![Frontend](https://github.com/fernandofatech/aws-architecture-studio/actions/workflows/frontend.yml/badge.svg)
![Security](https://github.com/fernandofatech/aws-architecture-studio/actions/workflows/security.yml/badge.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)

## Live portfolio / Portfolio ao vivo

- **Production:** [AWS Architecture Studio](https://studio.moretes.com)
- **Documentation:** [Project docs](docs/architecture.md)
- **GitHub:** [fernandofatech/aws-architecture-studio](https://github.com/fernandofatech/aws-architecture-studio)
- **Author:** [Fernando Francisco Azevedo](https://fernando.moretes.com) · [LinkedIn](https://www.linkedin.com/in/fernando-francisco-azevedo/) · [GitHub](https://github.com/fernandofatech)

This public repository is part of a bilingual portfolio focused on solution
architecture, AWS, AI, MCP/tooling, DevSecOps, and production-ready engineering
practices.

Este repositório público faz parte de um portfólio bilíngue focado em
arquitetura de soluções, AWS, IA, MCP/tools, DevSecOps e boas práticas de
engenharia para produção.

## What it does

- **ADR Generator** — multi-step wizard, MADR-compliant, live Markdown preview,
  copy and download as `.md`.
- **Diagram Builder** — pick AWS services from the catalog, draw nodes and
  edges, render to Mermaid live and copy the source.
- **Reference Patterns** — six curated AWS patterns (3-tier web, serverless
  API, data lake, event-driven microservices, static SPA, batch ML) each with
  diagram, ADR summary, services, Well-Architected pointers and cost notes.
- **AWS Catalog** — 37+ AWS services with one-liners, when-to-use and pricing
  notes.

## Why this matters

Solution architects spend a large fraction of their week producing two
artifacts: decision records and diagrams. A focused, opinionated tool that
makes both fast and consistent — and links them to the broader AWS service
catalog — turns those artifacts into compounding documentation instead of
throwaway slides.

## Tech stack

- Next.js 16 (App Router) + React 19
- TypeScript 5
- Tailwind CSS 4
- Mermaid 11 (client-side rendering)
- GitHub Actions (CI, Frontend, Vercel, Security)
- Deployed on Vercel · DNS via Cloudflare

## Routes

| Route | What it does |
|-------|--------------|
| `/` | Hero + featured patterns |
| `/adr` | Six-step ADR wizard with live preview, copy and download |
| `/diagrams` | Build Mermaid AWS diagrams from the catalog |
| `/patterns` | Browse reference patterns by category |
| `/patterns/[slug]` | Pattern detail: diagram, ADR, services, Well-Architected, cost |
| `/services` | AWS service catalog with one-liners and pricing notes |

## Run locally

```bash
cd frontend
npm install
npm run dev
# open http://localhost:3000
```

## Operations

See [OPERATIONS.md](OPERATIONS.md) and [SETUP.md](SETUP.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE) — Copyright © 2026 Fernando Francisco Azevedo.
