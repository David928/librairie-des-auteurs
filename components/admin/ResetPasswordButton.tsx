"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  resetAuthorPassword,
  type ResetPasswordState,
} from "@/app/admin/auteurs/actions";

const initialState: ResetPasswordState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-sm text-accent hover:underline disabled:opacity-50"
    >
      {pending ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
    </button>
  );
}

export function ResetPasswordButton({ authorId }: { authorId: string }) {
  const [state, formAction] = useActionState(
    resetAuthorPassword,
    initialState
  );

  if (state.success) {
    return (
      <div className="rounded-lg border border-accent/30 bg-accent/10 p-3 text-sm">
        {state.success.emailSent ? (
          <p className="text-ink-light">
            Un email avec le nouveau mot de passe a été envoyé à{" "}
            <span className="font-medium">{state.success.email}</span>.
          </p>
        ) : (
          <p className="text-ink-light">
            L&apos;email automatique n&apos;a pas pu être envoyé
            {state.success.emailError ? ` (${state.success.emailError})` : ""}
            . Communiquez ce mot de passe à l&apos;auteur vous-même :
          </p>
        )}
        <p className="mt-1 break-all font-mono text-ink">
          {state.success.password}
        </p>
      </div>
    );
  }

  return (
    <form
      action={(formData) => {
        const confirmed = window.confirm(
          "Réinitialiser le mot de passe de cet auteur ? Un nouveau mot de passe sera généré et envoyé par email."
        );
        if (!confirmed) return;
        formAction(formData);
      }}
    >
      <input type="hidden" name="authorId" value={authorId} />
      {state.error && (
        <p className="mb-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      <SubmitButton />
    </form>
  );
}
