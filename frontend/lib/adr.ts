export type AdrInput = {
  number: number;
  title: string;
  status: "proposed" | "accepted" | "superseded" | "deprecated" | "rejected";
  date: string; // ISO yyyy-mm-dd
  deciders: string;
  context: string;
  decision: string;
  consequences: string;
  alternatives?: string;
  links?: string;
};

export function emptyAdr(): AdrInput {
  return {
    number: 1,
    title: "",
    status: "proposed",
    date: new Date().toISOString().slice(0, 10),
    deciders: "",
    context: "",
    decision: "",
    consequences: "",
    alternatives: "",
    links: "",
  };
}

export function renderAdrMarkdown(adr: AdrInput): string {
  const lines: string[] = [];
  const number = String(adr.number).padStart(4, "0");
  lines.push(`# ${adr.number}. ${adr.title || "Untitled decision"}`);
  lines.push("");
  lines.push(`- **Status:** ${adr.status}`);
  lines.push(`- **Date:** ${adr.date}`);
  if (adr.deciders.trim()) lines.push(`- **Deciders:** ${adr.deciders}`);
  lines.push("");
  lines.push("## Context and Problem Statement");
  lines.push("");
  lines.push(adr.context.trim() || "_Describe the context and the problem to be solved._");
  lines.push("");
  if (adr.alternatives && adr.alternatives.trim()) {
    lines.push("## Considered Alternatives");
    lines.push("");
    lines.push(adr.alternatives.trim());
    lines.push("");
  }
  lines.push("## Decision");
  lines.push("");
  lines.push(adr.decision.trim() || "_State the chosen option and rationale._");
  lines.push("");
  lines.push("## Consequences");
  lines.push("");
  lines.push(adr.consequences.trim() || "_List the consequences, both positive and negative._");
  lines.push("");
  if (adr.links && adr.links.trim()) {
    lines.push("## Links");
    lines.push("");
    lines.push(adr.links.trim());
    lines.push("");
  }
  return lines.join("\n");
}

export function suggestedFilename(adr: AdrInput): string {
  const slug = (adr.title || "untitled")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  const number = String(adr.number).padStart(4, "0");
  return `${number}-${slug}.md`;
}
