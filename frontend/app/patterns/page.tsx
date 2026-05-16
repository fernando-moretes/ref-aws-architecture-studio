import Link from "next/link";
import { PATTERNS } from "../../lib/patterns";

const CATEGORY_LABELS: Record<string, string> = {
  web: "Web",
  api: "API",
  data: "Data",
  events: "Events",
  ml: "ML",
  batch: "Batch",
};

export default function PatternsIndex() {
  const byCategory = PATTERNS.reduce<Record<string, typeof PATTERNS>>((acc, p) => {
    (acc[p.category] = acc[p.category] || []).push(p);
    return acc;
  }, {});

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold">Reference Patterns</h1>
      <p className="mt-2 max-w-3xl text-slate-400">
        Curated AWS reference architectures. Each pattern includes a Mermaid diagram, an ADR
        summary, the AWS services involved and Well-Architected pointers.
      </p>

      {Object.entries(byCategory).map(([cat, items]) => (
        <section key={cat} className="mt-10">
          <h2 className="text-xl font-semibold text-orange-400">{CATEGORY_LABELS[cat] ?? cat}</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <Link
                key={p.slug}
                href={`/patterns/${p.slug}`}
                className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 hover:border-orange-500/60"
              >
                <h3 className="text-base font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{p.tagline}</p>
                <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-slate-400">
                  {p.services.slice(0, 5).map((s) => (
                    <span key={s} className="rounded border border-slate-700 px-1.5 py-0.5">
                      {s}
                    </span>
                  ))}
                  {p.services.length > 5 && <span className="text-slate-500">+{p.services.length - 5}</span>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
