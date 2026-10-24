import { AnnouncementCard } from "@/components/AnnouncementCard";
import { PushSubscribeButton } from "@/components/PushSubscribeButton";
import { BookGrid } from "@/components/BookGrid";
import { SectionHeading } from "@/components/SectionHeading";
import {
  NEW_BOOK_DAYS,
  getActiveAnnouncements,
  getLatestBooks,
} from "@/lib/queries";
import { pageTitle } from "@/lib/site";

export const revalidate = 60;

export const metadata = {
  title: pageTitle("Nouveautés"),
};

export default async function NouveautesPage() {
  const [recentBooks, announcements] = await Promise.all([
    getLatestBooks({ sinceDays: NEW_BOOK_DAYS }),
    getActiveAnnouncements(),
  ]);
  // S'il n'y a pas eu d'arrivage récent, on montre quand même les derniers livres.
  const books =
    recentBooks.length > 0 ? recentBooks : await getLatestBooks({ limit: 6 });

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
      <h1 className="text-2xl font-semibold text-ink">Nouveautés</h1>
      <p className="mt-1 text-sm text-ink-light">
        Les derniers livres arrivés en rayon et les actualités de la
        librairie et de ses auteurs.
      </p>

      <div className="mt-5">
        <PushSubscribeButton />
      </div>

      <section>
        <SectionHeading
          title="📚 Arrivés en rayon"
          subtitle={
            recentBooks.length > 0
              ? `Les livres ajoutés ces ${NEW_BOOK_DAYS} derniers jours.`
              : "Les derniers livres ajoutés."
          }
          href="/livres"
          linkLabel="Tous les livres"
        />
        <div className="mt-3">
          {books.length > 0 ? (
            <BookGrid books={books} limit={12} />
          ) : (
            <p className="text-ink-light">Les premiers livres arrivent bientôt.</p>
          )}
        </div>
      </section>

      <section className="mt-8 max-w-2xl">
        <SectionHeading title="📣 Actualités" />
        {announcements.length > 0 ? (
          <div className="mt-3 flex flex-col gap-3">
            {announcements.map((a) => (
              <AnnouncementCard key={a.id} announcement={a} />
            ))}
          </div>
        ) : (
          <p className="mt-3 text-ink-light">
            Aucune actualité pour l&apos;instant — revenez bientôt !
          </p>
        )}
      </section>
    </div>
  );
}
