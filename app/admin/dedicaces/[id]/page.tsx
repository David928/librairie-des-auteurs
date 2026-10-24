import { notFound } from "next/navigation";
import { requireAuthorAccess, requireSession } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { authorAdminPath } from "@/lib/admin-paths";
import { SigningForm } from "@/components/admin/SigningForm";
import { BackLink } from "@/components/admin/BackLink";
import { pageTitle } from "@/lib/site";
import type { Signing } from "@/lib/supabase/types";

export const metadata = {
  title: pageTitle("Modifier la dédicace"),
};

export default async function EditSigningPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireSession();
  const { id } = await params;

  const admin = createAdminClient();
  const { data: signing } = await admin
    .from("signings")
    .select("*")
    .eq("id", id)
    .maybeSingle<Signing>();
  if (!signing) notFound();

  const { author } = await requireAuthorAccess(signing.author_id);
  const back = authorAdminPath(session, author.id);

  const { data: books } = await admin
    .from("books")
    .select("id, title")
    .eq("author_id", author.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <BackLink href={back} />
      <h1 className="mt-3 text-2xl font-semibold text-ink">
        Modifier la dédicace
      </h1>
      <p className="mt-1 text-sm text-ink-light">avec {author.name}</p>
      <SigningForm
        authorId={author.id}
        books={books ?? []}
        signing={signing}
        redirectTo={back}
      />
    </div>
  );
}
