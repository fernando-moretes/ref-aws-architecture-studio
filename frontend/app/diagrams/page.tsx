"use client";

import { useMemo, useState } from "react";
import { Copy, Plus, Trash2 } from "lucide-react";
import {
  AWS_SERVICES,
  CATEGORY_LABELS,
  servicesByCategory,
  type ServiceCategory,
} from "../../lib/aws-services";
import { renderMermaid, type DiagramNode, type DiagramEdge } from "../../lib/diagram-builder";
import Mermaid from "../../components/Mermaid";

const CATEGORIES = Object.keys(CATEGORY_LABELS) as ServiceCategory[];

export default function DiagramBuilder() {
  const [direction, setDirection] = useState<"LR" | "TD">("LR");
  const [nodes, setNodes] = useState<DiagramNode[]>([
    { id: "user", serviceCode: "cloudfront", label: "User" },
    { id: "cf", serviceCode: "cloudfront" },
    { id: "alb", serviceCode: "alb" },
    { id: "app", serviceCode: "ecs" },
    { id: "db", serviceCode: "aurora" },
  ]);
  const [edges, setEdges] = useState<DiagramEdge[]>([
    { from: "user", to: "cf" },
    { from: "cf", to: "alb" },
    { from: "alb", to: "app" },
    { from: "app", to: "db" },
  ]);

  const mermaid = useMemo(() => renderMermaid({ nodes, edges, direction }), [nodes, edges, direction]);

  function addNode(serviceCode: string) {
    const id = nextId(nodes, serviceCode);
    setNodes((prev) => [...prev, { id, serviceCode }]);
  }

  function removeNode(id: string) {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setEdges((prev) => prev.filter((e) => e.from !== id && e.to !== id));
  }

  function addEdge() {
    if (nodes.length < 2) return;
    setEdges((prev) => [...prev, { from: nodes[0].id, to: nodes[1].id }]);
  }

  function updateEdge(idx: number, patch: Partial<DiagramEdge>) {
    setEdges((prev) => prev.map((e, i) => (i === idx ? { ...e, ...patch } : e)));
  }

  function removeEdge(idx: number) {
    setEdges((prev) => prev.filter((_, i) => i !== idx));
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold">Diagram Builder</h1>
      <p className="mt-2 max-w-2xl text-slate-400">
        Compose an AWS architecture diagram from the catalog. The Mermaid source updates live and
        is ready to paste into a Markdown ADR or PR.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <section className="space-y-6 rounded-xl border border-slate-800 bg-slate-900/40 p-6">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Direction
            </h2>
            <div className="mt-2 inline-flex rounded-md border border-slate-700 text-sm">
              {(["LR", "TD"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDirection(d)}
                  className={`px-3 py-1.5 ${
                    direction === d ? "bg-orange-500 text-slate-950" : "text-slate-300"
                  }`}
                >
                  {d === "LR" ? "Left → Right" : "Top → Down"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Add a service
            </h2>
            <div className="mt-2 max-h-72 space-y-3 overflow-y-auto pr-2">
              {CATEGORIES.map((cat) => (
                <details key={cat} className="rounded-md border border-slate-800 bg-slate-950 p-2">
                  <summary className="cursor-pointer text-sm font-semibold text-slate-200">
                    {CATEGORY_LABELS[cat]}
                  </summary>
                  <div className="mt-2 grid grid-cols-2 gap-1.5 text-xs">
                    {servicesByCategory(cat).map((s) => (
                      <button
                        key={s.code}
                        onClick={() => addNode(s.code)}
                        className="flex items-center gap-1 rounded border border-slate-700 px-2 py-1 text-left text-slate-300 hover:border-orange-500 hover:bg-slate-900"
                      >
                        <Plus className="h-3 w-3 text-orange-400" />
                        {s.name}
                      </button>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Nodes</h2>
            <ul className="mt-2 space-y-1 text-sm">
              {nodes.map((n) => (
                <li
                  key={n.id}
                  className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-950 px-3 py-1.5"
                >
                  <span>
                    <code className="text-orange-300">{n.id}</code>{" "}
                    <span className="text-slate-400">— {n.label ?? lookupName(n.serviceCode)}</span>
                  </span>
                  <button onClick={() => removeNode(n.id)} className="text-slate-500 hover:text-red-400">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Edges</h2>
              <button
                onClick={addEdge}
                className="inline-flex items-center gap-1 rounded-md border border-slate-700 px-2 py-1 text-xs hover:bg-slate-900"
              >
                <Plus className="h-3 w-3" /> Add edge
              </button>
            </div>
            <ul className="mt-2 space-y-1.5 text-sm">
              {edges.map((e, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <select
                    value={e.from}
                    onChange={(ev) => updateEdge(idx, { from: ev.target.value })}
                    className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs"
                  >
                    {nodes.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.id}
                      </option>
                    ))}
                  </select>
                  <span className="text-slate-500">→</span>
                  <select
                    value={e.to}
                    onChange={(ev) => updateEdge(idx, { to: ev.target.value })}
                    className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs"
                  >
                    {nodes.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.id}
                      </option>
                    ))}
                  </select>
                  <input
                    placeholder="label"
                    value={e.label ?? ""}
                    onChange={(ev) => updateEdge(idx, { label: ev.target.value })}
                    className="w-24 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs"
                  />
                  <button onClick={() => removeEdge(idx)} className="text-slate-500 hover:text-red-400">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                Live diagram
              </h2>
              <button
                onClick={() => navigator.clipboard.writeText(mermaid)}
                className="inline-flex items-center gap-1 rounded-md border border-slate-700 px-2 py-1 text-xs hover:bg-slate-900"
              >
                <Copy className="h-3 w-3" /> Copy Mermaid
              </button>
            </div>
            <Mermaid chart={mermaid} />
          </div>

          <div>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
              Source
            </h2>
            <pre className="overflow-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs text-slate-200">
              {mermaid}
            </pre>
          </div>
        </section>
      </div>
    </main>
  );
}

function lookupName(code: string): string {
  return AWS_SERVICES.find((s) => s.code === code)?.name ?? code;
}

function nextId(nodes: DiagramNode[], serviceCode: string): string {
  const base = serviceCode.toLowerCase();
  let i = 1;
  while (nodes.some((n) => n.id === `${base}${i === 1 ? "" : i}`)) i++;
  return `${base}${i === 1 ? "" : i}`;
}
