# 1. Record architecture decisions

- **Status:** accepted
- **Date:** 2026-05-15
- **Deciders:** Fernando Francisco Azevedo

## Context and Problem Statement

We need a lightweight, version-controlled mechanism to record significant
technical decisions taken in this repository. Eating our own dog food matters:
this project ships an ADR generator, so its own ADRs should follow the format.

## Decision

Adopt the [MADR](https://adr.github.io/madr/) template under `docs/adr/`,
numbered sequentially.

## Consequences

- Decisions become reviewable through Git history.
- ADRs become first-class artifacts in the project's portfolio narrative.
- The repository visibly demonstrates the workflow it advocates.
