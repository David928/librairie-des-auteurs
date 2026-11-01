"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  createAuthorAccount,
  type AccountState,
} from "@/app/admin/auteurs/actions";
import { CredentialsBox } from "@/components/admin/CredentialsBox";
import { FormError } from "@/components/admin/FormMessages";
import { inputClass, primaryButtonClass } from "@/components/admin/styles";

const initialState: AccountState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={primaryButtonClass}>
      {pending ? "En cours..." : "Relier ou créer le compte"}
    </button>
  );
}

export function CreateAccountForm({ authorId }: { authorId: string }) {
  const [state, formAction] = useActionState(createAuthorAccount, initialState);

  if (state.success) return <CredentialsBox credentials={state.success} />;

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <p className="text-sm text-ink-light">
        Cette fiche n&apos;est reliée à aucun compte. Indiquez l&apos;email
        de l&apos;auteur pour qu&apos;il gère lui-même sa fiche, ses livres et
        ses dédicaces. S&apos;il a déjà un compte (un superadmin par
        exemple), il est simplement relié ; sinon un compte est créé.
      </p>
      <FormError error={state.error} />
      <input type="hidden" name="authorId" value={authorId} />
      <input
        type="email"
        name="email"
        required
        placeholder="Email de l'auteur"
        className={inputClass}
      />
      <SubmitButton />
    </form>
  );
}
