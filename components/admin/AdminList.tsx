import Link from "next/link";

export function AdminSection({
  title,
  action,
  children,
}: {
  title: string;
  action?: { href: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <div className="flex items-center justify-between gap-3">
        <h2 className="min-w-0 truncate text-lg font-semibold text-ink">
          {title}
        </h2>
        {action && (
          <Link
            href={action.href}
            className="shrink-0 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-light"
          >
            {action.label}
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

export function AdminRow({
  title,
  subtitle,
  children,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-xl border border-ink/10 bg-white/60 px-4 py-3">
      <div className="min-w-0">
        <p className="truncate font-medium text-ink">{title}</p>
        {subtitle && <p className="truncate text-sm text-ink-light">{subtitle}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-3 text-sm">{children}</div>
    </li>
  );
}

export function AdminEmpty({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 text-sm text-ink-light">{children}</p>;
}

export function AdminLinkCard({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-3 rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm font-medium text-accent"
    >
      <span className="min-w-0">{children}</span>
      <span aria-hidden className="shrink-0">→</span>
    </Link>
  );
}

export function EditLink({ href }: { href: string }) {
  return (
    <Link href={href} className="text-accent hover:underline">
      Modifier
    </Link>
  );
}
