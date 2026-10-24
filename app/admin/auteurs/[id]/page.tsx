import Link from "next/link";
import { requireAuthorAccess, requireSuperAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteAuthor } from "@/app/admin/auteurs/actions";
import { AuthorForm } from "@/components/admin/AuthorForm";
import { AuthorContent } from "@/components/admin/AuthorContent";
import { BackLink } from "@/components/admin/BackLink";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { CreateAccountForm } from "@/components/admin/CreateAccountForm";
import { ResetPasswordButton } from "@/components/admin/ResetPasswordButton";
import { pageTitle } from "@/lib/site";

export const metadata = {
  title: pageTitle("Gérer un auteur"),
};

export default async function AdminAuthorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireSuperAdmin();
  const { id } = await params;
  const { author } = await requireAuthorAccess(id);

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("id")
    .eq("author_id", author.id)
    .maybeSingle();
  const accountEmail = profile
    ? (await admin.auth.admin.getUserById(profile.id)).data.user?.email
    : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <BackLink href="/admin/auteurs" label="Auteurs" />
      <div className="mt-3 flex items-center justify-between gap-3">
        <h1 className="min-w-0 truncate text-2xl font-semibold text-ink">
          {author.name}
        </h1>
        <Link
          href={`/auteurs/${author.slug}`}
          className="shrink-0 text-sm text-accent hover:underline"
        >
          Voir la fiche →
        </Link>
      </div>

      <section className="mt-6 rounded-2xl border border-ink/10 bg-white/60 p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-ink">Fiche</h2>
        <AuthorForm author={author} asSuperAdmin />
      </section>

      <AuthorContent author={author} superAdmin />

      <section className="mt-10 rounded-2xl border border-ink/10 bg-white/60 p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-ink">Compte de connexion</h2>
        <div className="mt-3">
          {profile ? (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-ink-light">
                Connexion avec{" "}
                <span className="font-medium text-ink">{accountEmail}</span>
              </p>
              <ResetPasswordButton authorId={author.id} />
            </div>
          ) : (
            <CreateAccountForm authorId={author.id} />
          )}
        </div>
      </section>

      <div className="mt-8 border-t border-ink/10 pt-6">
        <form action={deleteAuthor.bind(null, author.id)}>
          <ConfirmButton
            message={`Supprimer définitivement « ${author.name} » ? Sa fiche, ses livres, ses dédicaces et ses annonces seront supprimés, ainsi que son compte de connexion. Cette action est irréversible.`}
          >
            Supprimer cet auteur
          </ConfirmButton>
        </form>
      </div>
    </div>
  );
}
