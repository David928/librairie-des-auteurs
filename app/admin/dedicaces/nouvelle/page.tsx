import { redirect } from "next/navigation";
import { requireAuthorAccess, requireSession } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { authorAdminPath } from "@/lib/admin-paths";
import { SigningForm } from "@/components/admin/SigningForm";
import { BackLink } from "@/components/admin/BackLink";
import { pageTitle } from "@/lib/site";

export const metadata = {
  title: pageTitle("Nouvelle dédicace"),
};

export default async function NewSigningPage({
  searchParams,
}: {
  searchParams: Promise<{ auteur?: string }>;
}) {
  const session = await requireSession();
  const authorId = (await searchParams).auteur ?? session.author?.id;
  if (!authorId) redirect("/admin");
  const { author } = await requireAuthorAccess(authorId);
  const back = authorAdminPath(session, author.id);

  const admin = createAdminClient();
  const { data: books } = await admin
    .from("books")
    .select("id, title")
    .eq("author_id", author.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <BackLink href={back} />
      <h1 className="mt-3 text-2xl font-semibold text-ink">
        Programmer une dédicace
      </h1>
      <p className="mt-1 text-sm text-ink-light">avec {author.name}</p>
      <SigningForm authorId={author.id} books={books ?? []} redirectTo={back} />
    </div>
  );
}
