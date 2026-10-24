import { notFound } from "next/navigation";
import { requireAuthorAccess, requireSession } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { authorAdminPath } from "@/lib/admin-paths";
import { BookForm } from "@/components/admin/BookForm";
import { BackLink } from "@/components/admin/BackLink";
import { pageTitle } from "@/lib/site";
import type { Book } from "@/lib/supabase/types";

export const metadata = {
  title: pageTitle("Modifier le livre"),
};

export default async function EditBookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireSession();
  const { id } = await params;

  const admin = createAdminClient();
  const { data: book } = await admin
    .from("books")
    .select("*")
    .eq("id", id)
    .maybeSingle<Book>();
  if (!book) notFound();

  const { author } = await requireAuthorAccess(book.author_id);
  const back = authorAdminPath(session, author.id);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <BackLink href={back} />
      <h1 className="mt-3 text-2xl font-semibold text-ink">
        Modifier « {book.title} »
      </h1>
      <BookForm author={author} book={book} redirectTo={back} />
    </div>
  );
}
