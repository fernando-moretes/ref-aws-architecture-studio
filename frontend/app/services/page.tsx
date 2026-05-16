import { AWS_SERVICES, CATEGORY_LABELS, type ServiceCategory } from "../../lib/aws-services";

const CATEGORIES = Object.keys(CATEGORY_LABELS) as ServiceCategory[];

export default function ServicesCatalog() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold">AWS Service Catalog</h1>
      <p className="mt-2 max-w-3xl text-slate-400">
        A quick-reference guide of {AWS_SERVICES.length} AWS services grouped by category. Each
        entry includes a one-liner, a "when to use" hint, a pricing note and the docs link.
      </p>

      {CATEGORIES.map((cat) => {
        const items = AWS_SERVICES.filter((s) => s.category === cat);
        if (items.length === 0) return null;
        return (
          <section key={cat} className="mt-10">
            <h2 className="text-xl font-semibold text-orange-400">{CATEGORY_LABELS[cat]}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((s) => (
                <article
                  key={s.code}
                  className="rounded-xl border border-slate-800 bg-slate-900/40 p-5"
                >
                  <h3 className="text-base font-semibold">{s.name}</h3>
                  <p className="mt-1 text-sm text-slate-300">{s.oneLiner}</p>
                  <p className="mt-3 text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">When to use: </span>
                    {s.whenToUse}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">Pricing: </span>
                    {s.pricingNote}
                  </p>
                  <a
                    href={s.docsUrl}
                    className="mt-3 inline-block text-xs text-orange-300 hover:underline"
                  >
                    Docs →
                  </a>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
