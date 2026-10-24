import Link from "next/link";
import { Logo } from "@/components/Logo";
import { FeaturedBook } from "@/components/FeaturedBook";
import { AuthorCard } from "@/components/AuthorCard";
import { SigningCard } from "@/components/SigningCard";
import { BookGrid } from "@/components/BookGrid";
import { SectionHeading } from "@/components/SectionHeading";
import {
  getLatestBooks,
  getRandomAuthor,
  getRandomBook,
  getUpcomingSignings,
} from "@/lib/queries";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [latestBooks, signings, featuredAuthor] = await Promise.all([
    getLatestBooks({ limit: 6 }),
    getUpcomingSignings({ limit: 2 }),
    getRandomAuthor(),
  ]);
  const featuredBook = await getRandomBook(latestBooks.map((b) => b.id));

  return (
    <div>
      <div className="border-b border-ink/10 bg-cream px-4 pb-6 pt-8 text-center sm:pt-10">
        <Logo size="lg" />
        <p className="mx-auto mt-4 max-w-xl text-sm text-ink-light">
          {SITE.name} met à l&apos;honneur celles et ceux qui écrivent :
          leurs livres, leurs histoires, et les rendez-vous pour les
          rencontrer en dédicace à {SITE.city}.
        </p>
        <Link
          href="/infos"
          className="mt-3 inline-block text-xs font-medium text-accent hover:underline"
        >
          ℹ️ Infos pratiques (adresse, horaires...)
        </Link>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <section>
          <SectionHeading
            title="✍️ Prochaines dédicaces"
            subtitle="Venez rencontrer les auteurs à la librairie."
            href="/dedicaces"
          />
          <div className="mt-3 flex flex-col gap-3">
            {signings.length > 0 ? (
              signings.map((s) => (
                <SigningCard key={s.id} signing={s} compact />
              ))
            ) : (
              <p className="rounded-xl border border-dashed border-ink/15 px-4 py-5 text-center text-sm text-ink-light">
                Pas de dédicace programmée pour le moment — activez les
                notifications sur l&apos;onglet Nouveautés pour être
                prévenu·e de la prochaine.
              </p>
            )}
          </div>
        </section>

        {latestBooks.length > 0 && (
          <section className="mt-8">
            <SectionHeading
              title="🆕 Nouveautés en rayon"
              subtitle="Les derniers livres arrivés à la librairie."
              href="/nouveautes"
            />
            <div className="mt-3">
              <BookGrid books={latestBooks} />
            </div>
          </section>
        )}

        {(featuredBook || featuredAuthor) && (
          <section className="mt-8">
            <SectionHeading
              title="✨ À découvrir"
              subtitle="Un livre et un auteur différents à chaque visite."
            />
            <div className="mt-3 flex flex-col gap-3">
              {featuredBook && (
                <FeaturedBook book={featuredBook} label="Coup de cœur" />
              )}
              {featuredAuthor && <AuthorCard author={featuredAuthor} />}
            </div>
          </section>
        )}

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/livres"
            className="block rounded-full bg-ink py-3 text-center text-sm font-medium text-cream-light transition hover:bg-ink-light"
          >
            📚 Parcourir tous les livres
          </Link>
          <Link
            href="/auteurs"
            className="block rounded-full border border-ink/15 bg-white/60 py-3 text-center text-sm font-medium text-ink transition hover:border-ink/30"
          >
            🖋️ Découvrir nos auteurs
          </Link>
        </div>

        <p className="mt-8 text-center text-xs text-ink-light">
          Vous êtes auteur ?{" "}
          <Link href="/admin" className="font-medium text-accent hover:underline">
            Accéder à votre espace
          </Link>
        </p>
      </div>
    </div>
  );
}
