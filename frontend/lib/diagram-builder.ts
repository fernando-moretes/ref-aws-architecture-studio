import { findService } from "./aws-services";

export type DiagramNode = {
  id: string;
  serviceCode: string;
  label?: string;
};

export type DiagramEdge = {
  from: string;
  to: string;
  label?: string;
};

export type DiagramSpec = {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  direction?: "LR" | "TD";
  title?: string;
};

/**
 * Render a Mermaid `flowchart` representation from a spec.
 * Designed to be copy-pasted into Markdown / PRs / ADRs.
 */
export function renderMermaid(spec: DiagramSpec): string {
  const dir = spec.direction ?? "LR";
  const lines: string[] = [`flowchart ${dir}`];
  for (const n of spec.nodes) {
    const svc = findService(n.serviceCode);
    const label = n.label ?? svc?.name ?? n.serviceCode;
    lines.push(`  ${n.id}[${escapeLabel(label)}]`);
  }
  for (const e of spec.edges) {
    const arrow = e.label ? ` -->|${escapeLabel(e.label)}| ` : " --> ";
    lines.push(`  ${e.from}${arrow}${e.to}`);
  }
  return lines.join("\n");
}

function escapeLabel(s: string): string {
  return s.replace(/[|\[\]]/g, "");
}
