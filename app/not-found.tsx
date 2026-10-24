import Link from "next/link";
import { Logo } from "@/components/Logo";
import { pageTitle } from "@/lib/site";

export const metadata = {
  title: pageTitle("Page introuvable"),
};

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-16 text-center sm:px-6">
      <Logo size="lg" />
      <h1 className="mt-10 text-2xl font-semibold text-ink">
        Page introuvable
      </h1>
      <p className="mt-2 text-sm text-ink-light">
        Cette page n&apos;existe pas ou plus — le livre ou l&apos;auteur a
        peut-être changé d&apos;adresse, ou la dédicace est terminée.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition hover:bg-accent-light"
        >
          Retour à l&apos;accueil
        </Link>
        <Link
          href="/livres"
          className="rounded-full border border-ink/15 bg-white/60 px-5 py-2 text-sm font-medium text-ink transition hover:border-ink/30"
        >
          Voir tous les livres
        </Link>
      </div>
    </div>
  );
}
