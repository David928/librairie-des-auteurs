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
      {pending ? "Création..." : "Créer le compte"}
    </button>
  );
}

export function CreateAccountForm({ authorId }: { authorId: string }) {
  const [state, formAction] = useActionState(createAuthorAccount, initialState);

  if (state.success) return <CredentialsBox credentials={state.success} />;

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <p className="text-sm text-ink-light">
        Cet auteur n&apos;a pas encore de compte. Créez-en un pour qu&apos;il
        puisse gérer lui-même sa fiche, ses livres et ses dédicaces.
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
