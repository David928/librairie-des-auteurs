"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { createAuthor, type CreateAuthorState } from "@/app/admin/auteurs/actions";
import { CredentialsBox } from "@/components/admin/CredentialsBox";
import { FormError } from "@/components/admin/FormMessages";
import {
  hintClass,
  inputClass,
  labelClass,
  primaryButtonClass,
} from "@/components/admin/styles";
import { slugify } from "@/lib/slugify";

const initialState: CreateAuthorState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={primaryButtonClass}>
      {pending ? "Création..." : "Créer la fiche auteur"}
    </button>
  );
}

export function NewAuthorForm() {
  const [state, formAction] = useActionState(createAuthor, initialState);
  const [name, setName] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [slug, setSlug] = useState("");

  if (state.success) {
    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-ink/10 bg-white/60 p-5">
          <h2 className="text-lg font-semibold text-ink">
            {state.success.name} a été ajouté·e !
          </h2>
          <p className="mt-1 text-sm text-ink-light">
            Fiche publique : /auteurs/{state.success.slug}
          </p>
        </div>
        {state.success.credentials && (
          <CredentialsBox credentials={state.success.credentials} />
        )}
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/admin/auteurs/${state.success.id}`}
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white"
          >
            Compléter la fiche et ajouter ses livres →
          </Link>
          {/* Rechargement complet volontaire, pour repartir d'un formulaire vide. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/admin/auteurs/nouveau"
            className="rounded-full border border-ink/20 px-4 py-2 text-sm font-medium text-ink"
          >
            Ajouter un autre auteur
          </a>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FormError error={state.error} />

      <label className={labelClass}>
        Nom de l&apos;auteur (ou nom de plume)
        <input
          type="text"
          name="name"
          required
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!slugEdited) setSlug(slugify(e.target.value));
          }}
          className={inputClass}
        />
      </label>
      <label className={labelClass}>
        Identifiant (utilisé dans l&apos;adresse de sa fiche)
        <input
          type="text"
          name="slug"
          required
          value={slug}
          onChange={(e) => {
            setSlugEdited(true);
            setSlug(e.target.value);
          }}
          className={`${inputClass} font-mono text-sm`}
        />
      </label>
      <label className={labelClass}>
        Accroche (optionnelle)
        <input
          type="text"
          name="tagline"
          placeholder="Ex. Romancière · Polar"
          className={inputClass}
        />
      </label>
      <label className="flex items-center gap-2 text-sm text-ink">
        <input type="checkbox" name="is_local" className="accent-accent" />
        Auteur de la région
      </label>

      <div className="rounded-xl border border-ink/10 bg-white/60 p-4">
        <label className={labelClass}>
          Email de connexion (optionnel)
          <input type="email" name="email" className={inputClass} />
        </label>
        <p className={`mt-1.5 ${hintClass}`}>
          Renseignez-le pour que l&apos;auteur puisse gérer lui-même sa fiche,
          ses livres et ses dédicaces : un mot de passe est généré et envoyé
          par email. Laissez vide pour une fiche gérée uniquement par la
          librairie.
        </p>
      </div>

      <SubmitButton />
    </form>
  );
}
