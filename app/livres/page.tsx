import { BookBrowser } from "@/components/BookBrowser";
import { getAllBooks } from "@/lib/queries";
import { pageTitle } from "@/lib/site";

export const revalidate = 300;

export const metadata = {
  title: pageTitle("Tous les livres"),
};

export default async function LivresPage() {
  const books = await getAllBooks();

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
      <h1 className="text-2xl font-semibold text-ink">Tous les livres</h1>
      <p className="mt-1 text-sm text-ink-light">
        Le catalogue de la librairie, tous auteurs confondus. Un livre
        « sur commande » n&apos;est pas en rayon mais peut être commandé en
        boutique.
      </p>

      <div className="mt-5">
        <BookBrowser books={books} />
      </div>
    </div>
  );
}
