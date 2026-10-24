"use client";

import { useFormStatus } from "react-dom";

/** Bouton de soumission qui demande confirmation (suppressions). */
export function ConfirmButton({
  message,
  children,
  className = "text-sm text-red-700 hover:underline disabled:opacity-50",
}: {
  message: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
      className={className}
    >
      {pending ? "..." : children}
    </button>
  );
}
