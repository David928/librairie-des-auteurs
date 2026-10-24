import { login } from "@/app/admin/actions";
import { inputClass, labelClass } from "@/components/admin/styles";
import { pageTitle } from "@/lib/site";

export const metadata = {
  title: pageTitle("Connexion"),
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-semibold text-ink">Espace auteur</h1>
      <p className="mt-1 text-sm text-ink-light">
        Connectez-vous avec les identifiants reçus par email pour gérer
        votre fiche, vos livres et vos dédicaces.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <form action={login} className="mt-6 flex flex-col gap-4">
        <label className={labelClass}>
          Email
          <input type="email" name="email" required autoComplete="email" className={inputClass} />
        </label>
        <label className={labelClass}>
          Mot de passe
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className={inputClass}
          />
        </label>
        <button
          type="submit"
          className="mt-2 rounded-full bg-ink px-5 py-2 text-sm font-medium text-cream-light transition hover:bg-ink-light"
        >
          Se connecter
        </button>
      </form>

      <p className="mt-6 text-xs text-ink-light">
        Vous êtes auteur et souhaitez apparaître dans l&apos;application ?
        Parlez-en à la librairie, qui créera votre accès.
      </p>
    </div>
  );
}
