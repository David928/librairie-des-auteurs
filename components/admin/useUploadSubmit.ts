"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { uploadImageClient } from "@/lib/supabase/upload";

/**
 * Soumission d'un formulaire avec photo : la photo (champ `fileField`) est
 * d'abord envoyée vers le stockage, son URL est ajoutée au formulaire sous
 * `urlField`, puis l'action serveur est appelée.
 */
export function useUploadSubmit({
  folder,
  fileField,
  urlField,
  action,
  redirectTo,
  onSuccess,
}: {
  folder: string;
  fileField: string;
  urlField: string;
  action: (formData: FormData) => Promise<void>;
  redirectTo?: string;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const file = formData.get(fileField) as File | null;
    formData.delete(fileField);

    startTransition(async () => {
      try {
        if (file && file.size > 0) {
          formData.set(urlField, await uploadImageClient(folder, file));
        }
        await action(formData);
        onSuccess?.();
        if (redirectTo) router.push(redirectTo);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue.");
      }
    });
  }

  return { pending, error, handleSubmit };
}
