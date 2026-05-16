import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/adr", label: "ADR Generator" },
  { href: "/diagrams", label: "Diagram Builder" },
  { href: "/patterns", label: "Patterns" },
  { href: "/services", label: "AWS Catalog" },
];

export default function Nav() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/60 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-semibold tracking-tight text-orange-400">
          AWS Architecture Studio
        </Link>
        <ul className="flex flex-wrap gap-5 text-sm text-slate-300">
          {links.slice(1).map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="hover:text-orange-300">
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href="https://github.com/fernandofatech/aws-architecture-studio"
              className="rounded-md border border-slate-700 px-3 py-1 hover:bg-slate-900"
            >
              GitHub
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
