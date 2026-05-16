import Link from "next/link";
import { notFound } from "next/navigation";
import { PATTERNS, findPattern, type Pillar } from "../../../lib/patterns";
import { findService } from "../../../lib/aws-services";
import Mermaid from "../../../components/Mermaid";

const PILLAR_LABELS: Record<Pillar, string> = {
  "operational-excellence": "Operational Excellence",
  security: "Security",
  reliability: "Reliability",
  performance: "Performance Efficiency",
  cost: "Cost Optimization",
  sustainability: "Sustainability",
};

export function generateStaticParams() {
  return PATTERNS.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export default async function PatternPage({ params }: Props) {
  const { slug } = await params;
  const p = findPattern(slug);
  if (!p) notFound();

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <Link href="/patterns" className="text-sm text-orange-300 hover:underline">
        ← Back to patterns
      </Link>
      <h1 className="mt-4 text-3xl font-bold">{p.title}</h1>
      <p className="mt-2 text-slate-300">{p.tagline}</p>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Diagram</h2>
        <div className="mt-3">
          <Mermaid chart={p.mermaid} />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Description</h2>
        <p className="mt-2 text-slate-200">{p.description}</p>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <Block title="When to use">
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-300">
            {p.whenToUse.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </Block>
        <Block title="When to avoid">
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-300">
            {p.whenToAvoid.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </Block>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          ADR Summary
        </h2>
        <div className="mt-3 space-y-3 rounded-xl border border-slate-800 bg-slate-900/40 p-5 text-sm">
          <div>
            <p className="font-semibold text-slate-200">Context</p>
            <p className="mt-1 text-slate-300">{p.adrSummary.context}</p>
          </div>
          <div>
            <p className="font-semibold text-slate-200">Decision</p>
            <p className="mt-1 text-slate-300">{p.adrSummary.decision}</p>
          </div>
          <div>
            <p className="font-semibold text-slate-200">Consequences</p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-300">
              {p.adrSummary.consequences.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Well-Architected pointers
        </h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {(Object.keys(p.pillars) as Pillar[]).map((pi) => (
            <div key={pi} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-sm">
              <p className="font-semibold text-orange-300">{PILLAR_LABELS[pi]}</p>
              <p className="mt-1 text-slate-300">{p.pillars[pi]}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Services</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {p.services.map((code) => {
            const s = findService(code);
            if (!s) return null;
            return (
              <a
                key={code}
                href={s.docsUrl}
                className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 hover:border-orange-500/60"
              >
                <p className="text-sm font-semibold">{s.name}</p>
                <p className="mt-1 text-xs text-slate-400">{s.oneLiner}</p>
              </a>
            );
          })}
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-slate-800 bg-slate-900/40 p-5">
        <p className="text-sm font-semibold text-orange-300">Cost notes</p>
        <p className="mt-1 text-sm text-slate-300">{p.costNotes}</p>
      </section>
    </main>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
      <p className="text-sm font-semibold text-slate-200">{title}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}
