import Link from "next/link";
import { FileText, Workflow, Boxes, BookOpen } from "lucide-react";
import { PATTERNS } from "../lib/patterns";
import { AWS_SERVICES } from "../lib/aws-services";

const cards = [
  {
    href: "/adr",
    icon: FileText,
    title: "ADR Generator",
    description: "Multi-step wizard with live Markdown preview, MADR-compliant output.",
  },
  {
    href: "/diagrams",
    icon: Workflow,
    title: "Diagram Builder",
    description: "Compose AWS Mermaid diagrams from the catalog and copy the source.",
  },
  {
    href: "/patterns",
    icon: Boxes,
    title: "Reference Patterns",
    description: "Curated AWS reference architectures with diagrams, ADRs and cost notes.",
  },
  {
    href: "/services",
    icon: BookOpen,
    title: "AWS Catalog",
    description: "Quick-reference guide of AWS services grouped by category.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-16 sm:px-10">
      <section className="mx-auto max-w-6xl">
        <p className="mb-3 text-sm uppercase tracking-widest text-orange-400">
          Portfolio · AWS Solution Architecture
        </p>
        <h1 className="text-4xl font-bold sm:text-6xl">AWS Architecture Studio</h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-300">
          A working studio for AWS solution architects: generate ADRs, build
          architecture diagrams, browse reference patterns and look up services
          — all in one place, all version-controlled, all open source.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <Link
            href="/adr"
            className="rounded-md bg-orange-500 px-5 py-2.5 font-semibold text-slate-950 hover:bg-orange-400"
          >
            Start a new ADR
          </Link>
          <Link
            href="/patterns"
            className="rounded-md border border-slate-600 px-5 py-2.5 font-semibold text-slate-200 hover:bg-slate-800"
          >
            Browse {PATTERNS.length} patterns
          </Link>
          <Link
            href="/services"
            className="rounded-md border border-slate-600 px-5 py-2.5 font-semibold text-slate-200 hover:bg-slate-800"
          >
            {AWS_SERVICES.length} AWS services
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group rounded-xl border border-slate-800 bg-slate-900/40 p-5 transition hover:border-orange-500/60 hover:bg-slate-900"
            >
              <c.icon className="h-6 w-6 text-orange-400" aria-hidden />
              <h3 className="mt-3 text-base font-semibold group-hover:text-orange-300">{c.title}</h3>
              <p className="mt-1 text-sm text-slate-400">{c.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl">
        <h2 className="text-2xl font-semibold">Featured patterns</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PATTERNS.slice(0, 6).map((p) => (
            <Link
              key={p.slug}
              href={`/patterns/${p.slug}`}
              className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 hover:border-orange-500/60"
            >
              <p className="text-xs uppercase tracking-wider text-slate-500">{p.category}</p>
              <h3 className="mt-1 text-base font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{p.tagline}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
