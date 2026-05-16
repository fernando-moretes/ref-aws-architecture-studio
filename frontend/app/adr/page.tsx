"use client";

import { useMemo, useState } from "react";
import { Copy, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { emptyAdr, renderAdrMarkdown, suggestedFilename, type AdrInput } from "../../lib/adr";

const STEPS = [
  { id: "meta", label: "Metadata" },
  { id: "context", label: "Context" },
  { id: "alternatives", label: "Alternatives" },
  { id: "decision", label: "Decision" },
  { id: "consequences", label: "Consequences" },
  { id: "preview", label: "Preview & export" },
] as const;

export default function AdrWizard() {
  const [adr, setAdr] = useState<AdrInput>(emptyAdr);
  const [step, setStep] = useState(0);
  const markdown = useMemo(() => renderAdrMarkdown(adr), [adr]);
  const filename = suggestedFilename(adr);

  function update<K extends keyof AdrInput>(key: K, value: AdrInput[K]) {
    setAdr((prev) => ({ ...prev, [key]: value }));
  }

  function download() {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function copy() {
    navigator.clipboard.writeText(markdown);
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold">ADR Generator</h1>
      <p className="mt-2 max-w-2xl text-slate-400">
        Step through the wizard to author a MADR-compliant Architecture Decision Record. The
        Markdown preview updates live; export when you are happy.
      </p>

      <ol className="mt-8 flex flex-wrap gap-2 text-xs">
        {STEPS.map((s, i) => (
          <li
            key={s.id}
            className={`rounded-md px-3 py-1.5 ${
              i === step
                ? "bg-orange-500 text-slate-950 font-semibold"
                : i < step
                ? "border border-orange-500/40 text-orange-300"
                : "border border-slate-700 text-slate-400"
            }`}
          >
            {i + 1}. {s.label}
          </li>
        ))}
      </ol>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
          {step === 0 && (
            <div className="space-y-4">
              <Field label="ADR number">
                <input
                  type="number"
                  min={1}
                  value={adr.number}
                  onChange={(e) => update("number", Number(e.target.value))}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
                />
              </Field>
              <Field label="Title">
                <input
                  value={adr.title}
                  onChange={(e) => update("title", e.target.value)}
                  placeholder="e.g. Adopt EventBridge as the central event bus"
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
                />
              </Field>
              <Field label="Status">
                <select
                  value={adr.status}
                  onChange={(e) => update("status", e.target.value as AdrInput["status"])}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
                >
                  <option value="proposed">proposed</option>
                  <option value="accepted">accepted</option>
                  <option value="superseded">superseded</option>
                  <option value="deprecated">deprecated</option>
                  <option value="rejected">rejected</option>
                </select>
              </Field>
              <Field label="Date">
                <input
                  type="date"
                  value={adr.date}
                  onChange={(e) => update("date", e.target.value)}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
                />
              </Field>
              <Field label="Deciders (comma-separated)">
                <input
                  value={adr.deciders}
                  onChange={(e) => update("deciders", e.target.value)}
                  placeholder="Fernando Azevedo, Platform Team"
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
                />
              </Field>
            </div>
          )}
          {step === 1 && (
            <Textarea
              label="Context and problem statement"
              hint="Describe the forces at play and the problem the decision must solve."
              value={adr.context}
              onChange={(v) => update("context", v)}
            />
          )}
          {step === 2 && (
            <Textarea
              label="Considered alternatives (optional)"
              hint="List the options you evaluated and why each was kept or discarded."
              value={adr.alternatives ?? ""}
              onChange={(v) => update("alternatives", v)}
            />
          )}
          {step === 3 && (
            <Textarea
              label="Decision"
              hint="State the decision and the rationale concisely."
              value={adr.decision}
              onChange={(v) => update("decision", v)}
            />
          )}
          {step === 4 && (
            <Textarea
              label="Consequences"
              hint="Positive, negative and neutral consequences."
              value={adr.consequences}
              onChange={(v) => update("consequences", v)}
            />
          )}
          {step === 5 && (
            <div className="space-y-4">
              <Textarea
                label="Links (optional)"
                hint="Related ADRs, RFCs, tickets, docs."
                value={adr.links ?? ""}
                onChange={(v) => update("links", v)}
              />
              <div className="rounded-md border border-slate-700 bg-slate-950 p-4 text-sm">
                <p className="text-slate-400">Suggested filename:</p>
                <p className="mt-1 font-mono text-orange-300">{filename}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={copy}
                  className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-orange-400"
                >
                  <Copy className="h-4 w-4" /> Copy Markdown
                </button>
                <button
                  onClick={download}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-700 px-4 py-2 text-sm font-semibold hover:bg-slate-900"
                >
                  <Download className="h-4 w-4" /> Download .md
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between border-t border-slate-800 pt-4 text-sm">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="inline-flex items-center gap-2 rounded-md border border-slate-700 px-3 py-1.5 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            <button
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              disabled={step === STEPS.length - 1}
              className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-3 py-1.5 font-semibold text-slate-950 hover:bg-orange-400 disabled:opacity-40"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
            Live Markdown
          </h2>
          <pre className="max-h-[640px] overflow-auto rounded-xl border border-slate-800 bg-slate-950 p-5 text-xs leading-relaxed text-slate-200">
            {markdown}
          </pre>
        </section>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-slate-400">{label}</span>
      {children}
    </label>
  );
}

function Textarea({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-semibold">{label}</span>
      <span className="mb-2 block text-xs text-slate-400">{hint}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={12}
        className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm"
      />
    </label>
  );
}
