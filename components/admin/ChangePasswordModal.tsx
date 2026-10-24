"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { changePassword } from "@/app/admin/actions";

export function ChangePasswordModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-fit rounded-full border border-ink/20 px-5 py-2 text-sm font-medium text-ink transition hover:bg-white/50"
      >
        Changer mon mot de passe
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/40 p-4"
            onClick={() => setOpen(false)}
          >
            <div
              className="w-full max-w-sm rounded-2xl bg-cream-light p-6 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-ink">
                  Changer mon mot de passe
                </h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Fermer"
                  className="text-ink-light hover:text-ink"
                >
                  ✕
                </button>
              </div>

              <form action={changePassword} className="mt-4 flex flex-col gap-4">
                <label className="flex flex-col gap-1 text-sm text-ink">
                  Nouveau mot de passe
                  <input
                    type="password"
                    name="password"
                    required
                    minLength={6}
                    className="rounded-lg border border-ink/20 bg-white px-3 py-2 text-ink outline-none focus:border-accent"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm text-ink">
                  Confirmer le mot de passe
                  <input
                    type="password"
                    name="confirm"
                    required
                    minLength={6}
                    className="rounded-lg border border-ink/20 bg-white px-3 py-2 text-ink outline-none focus:border-accent"
                  />
                </label>
                <button
                  type="submit"
                  className="w-fit rounded-full bg-ink px-5 py-2 text-sm font-medium text-cream-light transition hover:bg-ink-light"
                >
                  Mettre à jour
                </button>
              </form>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
