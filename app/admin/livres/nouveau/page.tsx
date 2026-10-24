import { redirect } from "next/navigation";
import { requireAuthorAccess, requireSession } from "@/lib/auth";
import { authorAdminPath } from "@/lib/admin-paths";
import { BookForm } from "@/components/admin/BookForm";
import { BackLink } from "@/components/admin/BackLink";
import { pageTitle } from "@/lib/site";

export const metadata = {
  title: pageTitle("Nouveau livre"),
};

export default async function NewBookPage({
  searchParams,
}: {
  searchParams: Promise<{ auteur?: string }>;
}) {
  const session = await requireSession();
  const authorId = (await searchParams).auteur ?? session.author?.id;
  if (!authorId) redirect("/admin");
  const { author } = await requireAuthorAccess(authorId);
  const back = authorAdminPath(session, author.id);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <BackLink href={back} />
      <h1 className="mt-3 text-2xl font-semibold text-ink">Nouveau livre</h1>
      <p className="mt-1 text-sm text-ink-light">de {author.name}</p>
      <BookForm author={author} redirectTo={back} />
    </div>
  );
}
