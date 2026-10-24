import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AuthorAvatar } from "@/components/AuthorAvatar";
import { BookGrid } from "@/components/BookGrid";
import { ShareButton } from "@/components/ShareButton";
import { AnnouncementCard } from "@/components/AnnouncementCard";
import { SigningCard } from "@/components/SigningCard";
import { getActiveAnnouncements, getUpcomingSignings } from "@/lib/queries";
import { SITE, pageTitle } from "@/lib/site";
import type { Author, Book } from "@/lib/supabase/types";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: author } = await supabase
    .from("authors")
    .select("name, tagline, photo_url")
    .eq("slug", slug)
    .maybeSingle();

  if (!author) return {};
  const title = pageTitle(author.name);
  const description = author.tagline ?? undefined;
  const images = author.photo_url ? [author.photo_url] : undefined;
  return {
    title,
    description,
    openGraph: { title, description, images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

function SocialLink({ href, label }: { href: string; label: string }) {
  const url = /^https?:\/\//.test(href) ? href : `https://${href}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-full border border-ink/15 px-3 py-1 text-xs font-medium text-ink transition hover:border-accent hover:text-accent"
    >
      {label}
    </a>
  );
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: author } = await supabase
    .from("authors")
    .select("*")
    .eq("slug", slug)
    .maybeSingle<Author>();

  if (!author) notFound();

  const [{ data: books }, signings, announcements] = await Promise.all([
    supabase
      .from("books")
      .select("*")
      .eq("author_id", author.id)
      .order("is_available", { ascending: false })
      .order("release_date", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .returns<Book[]>(),
    getUpcomingSignings({ authorId: author.id }),
    getActiveAnnouncements({ authorId: author.id }),
  ]);

  const instagram = author.instagram?.replace(/^@/, "");

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="flex items-center gap-4">
        <AuthorAvatar
          name={author.name}
          photoUrl={author.photo_url}
          className="h-24 w-24 text-2xl sm:h-32 sm:w-32"
          priority
        />
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-ink sm:text-3xl">
            {author.name}
          </h1>
          {author.tagline && (
            <p className="mt-0.5 text-sm text-accent">{author.tagline}</p>
          )}
          {author.is_local && (
            <span className="mt-1.5 inline-block rounded-full bg-gold/15 px-2 py-0.5 text-[11px] font-medium text-gold">
              📍 Auteur de la région
            </span>
          )}
        </div>
      </div>

      {author.bio && (
        <p className="mt-5 max-w-2xl whitespace-pre-line text-sm leading-relaxed text-ink-light">
          {author.bio}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {author.website && <SocialLink href={author.website} label="🌐 Site web" />}
        {instagram && (
          <SocialLink
            href={
              instagram.includes("instagram.com")
                ? instagram
                : `https://instagram.com/${instagram}`
            }
            label="Instagram"
          />
        )}
        {author.facebook && <SocialLink href={author.facebook} label="Facebook" />}
      </div>

      <div className="mt-4">
        <ShareButton
          title={author.name}
          text={`${author.name} — ${SITE.name}`}
        />
      </div>

      {signings.length > 0 && (
        <section className="mt-8 max-w-2xl">
          <h2 className="text-xl font-semibold text-ink">
            ✍️ Prochaines dédicaces
          </h2>
          <div className="mt-3 flex flex-col gap-3">
            {signings.map((s) => (
              <SigningCard key={s.id} signing={s} showAuthor={false} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-ink">
          Ses livres à la librairie
        </h2>
        {books && books.length > 0 ? (
          <div className="mt-3">
            <BookGrid books={books} limit={12} />
          </div>
        ) : (
          <p className="mt-3 text-ink-light">
            Ses livres arrivent bientôt en rayon.
          </p>
        )}
      </section>

      {announcements.length > 0 && (
        <section className="mt-8 max-w-2xl">
          <h2 className="text-xl font-semibold text-ink">Actualités</h2>
          <div className="mt-3 flex flex-col gap-3">
            {announcements.map((a) => (
              <AnnouncementCard key={a.id} announcement={a} showAuthor={false} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
