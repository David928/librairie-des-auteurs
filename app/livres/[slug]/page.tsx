import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BookCover } from "@/components/BookCover";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ShareButton } from "@/components/ShareButton";
import { SigningCard } from "@/components/SigningCard";
import { AuthorAvatar } from "@/components/AuthorAvatar";
import { getUpcomingSignings } from "@/lib/queries";
import { SITE, pageTitle } from "@/lib/site";
import type { Author, Book } from "@/lib/supabase/types";

export const revalidate = 3600;

type BookWithFullAuthor = Book & {
  author: Pick<Author, "id" | "slug" | "name" | "tagline" | "photo_url">;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: book } = await supabase
    .from("books")
    .select("title, summary, cover_url, author:authors(name)")
    .eq("slug", slug)
    .maybeSingle<{
      title: string;
      summary: string | null;
      cover_url: string | null;
      author: { name: string };
    }>();

  if (!book) return {};
  const title = pageTitle(`${book.title}, ${book.author.name}`);
  const description = book.summary ?? undefined;
  const images = book.cover_url ? [book.cover_url] : undefined;
  return {
    title,
    description,
    openGraph: { title, description, images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

function formatRelease(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: book } = await supabase
    .from("books")
    .select("*, author:authors(id, slug, name, tagline, photo_url)")
    .eq("slug", slug)
    .maybeSingle<BookWithFullAuthor>();

  if (!book) notFound();

  const signings = (await getUpcomingSignings({ authorId: book.author.id })).slice(0, 2);

  const details = [
    book.genre && { label: "Genre", value: book.genre },
    book.publisher && { label: "Éditeur", value: book.publisher },
    book.release_date && { label: "Parution", value: formatRelease(book.release_date) },
    book.isbn && { label: "ISBN", value: book.isbn },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="grid gap-6 sm:grid-cols-[minmax(0,260px)_1fr]">
        <div className="mx-auto w-48 sm:w-full">
          <BookCover
            title={book.title}
            coverUrl={book.cover_url}
            sizes="(max-width: 640px) 192px, 260px"
            priority
            className="shadow-md"
          />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            {book.is_available ? (
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                En rayon
              </span>
            ) : (
              <span className="rounded-full bg-ink px-3 py-1 text-xs font-medium text-cream-light">
                Sur commande
              </span>
            )}
            {book.is_signed && book.is_available && (
              <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-medium text-gold">
                ✍️ Exemplaires dédicacés disponibles
              </span>
            )}
          </div>

          <h1 className="mt-3 text-3xl font-semibold leading-tight text-ink">
            {book.title}
          </h1>
          <Link
            href={`/auteurs/${book.author.slug}`}
            className="mt-2 inline-flex items-center gap-2 text-sm text-ink hover:text-accent"
          >
            <AuthorAvatar
              name={book.author.name}
              photoUrl={book.author.photo_url}
              className="h-7 w-7 text-[10px]"
            />
            <span className="font-medium">{book.author.name}</span>
          </Link>

          {book.price != null && (
            <p className="mt-4 text-2xl font-semibold text-ink">
              {book.price.toFixed(2)} €
            </p>
          )}

          {book.summary && (
            <p className="mt-4 whitespace-pre-line leading-relaxed text-ink-light">
              {book.summary}
            </p>
          )}

          {details.length > 0 && (
            <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
              {details.map((d) => (
                <div key={d.label} className="contents">
                  <dt className="text-ink-light">{d.label}</dt>
                  <dd className="text-ink">{d.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <FavoriteButton bookId={book.id} variant="labeled" />
            <ShareButton
              title={book.title}
              text={`${book.title} de ${book.author.name} — ${SITE.name}`}
            />
          </div>

          <p className="mt-4 text-xs text-ink-light">
            Pour réserver ou commander ce livre, passez nous voir ou
            appelez la librairie au{" "}
            <a
              href={`tel:${SITE.phone.replace(/\s/g, "")}`}
              className="whitespace-nowrap text-accent hover:underline"
            >
              {SITE.phone}
            </a>
            .
          </p>
        </div>
      </div>

      {signings.length > 0 && (
        <section className="mt-10 max-w-2xl">
          <h2 className="text-xl font-semibold text-ink">
            Rencontrer {book.author.name}
          </h2>
          <div className="mt-3 flex flex-col gap-3">
            {signings.map((s) => (
              <SigningCard key={s.id} signing={s} showAuthor={false} />
            ))}
          </div>
        </section>
      )}

      <Link
        href={`/auteurs/${book.author.slug}`}
        className="mt-10 inline-block rounded-full border border-ink/20 px-5 py-2 text-sm font-medium text-ink transition hover:bg-ink/5"
      >
        Tous les livres de {book.author.name} →
      </Link>
    </div>
  );
}
