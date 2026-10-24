import Link from "next/link";

export function BackLink({ href, label = "Retour" }: { href: string; label?: string }) {
  return (
    <Link href={href} className="text-sm text-ink-light hover:text-accent">
      ← {label}
    </Link>
  );
}
