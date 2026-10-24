import Link from "next/link";

export function SectionHeading({
  title,
  subtitle,
  href,
  linkLabel = "Tout voir",
}: {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-xl font-semibold text-ink">{title}</h2>
        {subtitle && <p className="mt-0.5 text-xs text-ink-light">{subtitle}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="shrink-0 text-sm font-medium text-accent hover:underline"
        >
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}
