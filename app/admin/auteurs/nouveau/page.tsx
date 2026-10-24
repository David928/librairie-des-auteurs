import { requireSuperAdmin } from "@/lib/auth";
import { NewAuthorForm } from "@/components/admin/NewAuthorForm";
import { BackLink } from "@/components/admin/BackLink";
import { pageTitle } from "@/lib/site";

export const metadata = {
  title: pageTitle("Ajouter un auteur"),
};

export default async function NewAuthorPage() {
  await requireSuperAdmin();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <BackLink href="/admin/auteurs" label="Auteurs" />
      <h1 className="mt-3 text-2xl font-semibold text-ink">Ajouter un auteur</h1>
      <p className="mt-1 text-sm text-ink-light">
        Crée sa fiche, et si vous le souhaitez son compte de connexion.
      </p>
      <div className="mt-6">
        <NewAuthorForm />
      </div>
    </div>
  );
}
