"use client";

import { createBook, updateBook } from "@/app/admin/livres/actions";
import { ImageField } from "@/components/admin/ImageField";
import { FormError } from "@/components/admin/FormMessages";
import { useUploadSubmit } from "@/components/admin/useUploadSubmit";
import {
  hintClass,
  inputClass,
  labelClass,
  primaryButtonClass,
} from "@/components/admin/styles";
import { BOOK_GENRES } from "@/lib/genres";
import type { Author, Book } from "@/lib/supabase/types";

export function BookForm({
  author,
  book,
  redirectTo,
}: {
  author: Pick<Author, "id" | "slug" | "name">;
  book?: Book;
  redirectTo: string;
}) {
  const { pending, error, handleSubmit } = useUploadSubmit({
    folder: author.slug,
    fileField: "cover",
    urlField: "cover_url",
    action: (formData) =>
      book ? updateBook(book.id, formData) : createBook(author.id, formData),
    redirectTo,
  });

  // Un genre saisi auparavant mais absent de la liste reste sélectionnable.
  const genres =
    book?.genre && !(BOOK_GENRES as readonly string[]).includes(book.genre)
      ? [...BOOK_GENRES, book.genre]
      : BOOK_GENRES;

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
      <FormError error={error} />

      <label className={labelClass}>
        Titre
        <input
          type="text"
          name="title"
          required
          defaultValue={book?.title}
          className={inputClass}
        />
      </label>
      <label className={labelClass}>
        Résumé / quatrième de couverture
        <textarea
          name="summary"
          rows={6}
          defaultValue={book?.summary ?? ""}
          className={inputClass}
        />
      </label>
      <ImageField
        name="cover"
        label="Couverture"
        format="cover"
        currentUrl={book?.cover_url}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          Genre
          <select
            name="genre"
            defaultValue={book?.genre ?? ""}
            className={inputClass}
          >
            <option value="">—</option>
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          Prix (€)
          <input
            type="text"
            inputMode="decimal"
            name="price"
            placeholder="19,90"
            defaultValue={book?.price ?? ""}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Éditeur
          <input
            type="text"
            name="publisher"
            defaultValue={book?.publisher ?? ""}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Date de parution
          <input
            type="date"
            name="release_date"
            defaultValue={book?.release_date ?? ""}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          ISBN
          <input
            type="text"
            name="isbn"
            inputMode="numeric"
            placeholder="978-2-..."
            defaultValue={book?.isbn ?? ""}
            className={inputClass}
          />
        </label>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-ink/10 bg-white/60 p-3">
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            name="is_available"
            defaultChecked={book?.is_available ?? true}
            className="accent-accent"
          />
          En rayon à la librairie
        </label>
        <span className={`${hintClass} pl-6`}>
          Décoché, le livre apparaît comme « sur commande ».
        </span>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            name="is_signed"
            defaultChecked={book?.is_signed ?? false}
            className="accent-accent"
          />
          Exemplaires dédicacés disponibles
        </label>
        {!book && (
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" name="notify" className="accent-accent" />
            Prévenir les abonnés par notification
          </label>
        )}
      </div>

      <button type="submit" disabled={pending} className={`mt-2 ${primaryButtonClass}`}>
        {pending ? "Enregistrement..." : book ? "Enregistrer" : "Ajouter le livre"}
      </button>
    </form>
  );
}
