"use client";

import { useEffect, useState } from "react";
import { hintClass, inputClass, labelClass } from "@/components/admin/styles";

/** Formats d'affichage des photos dans l'app, et taille conseillée pour chacun. */
export const IMAGE_FORMATS = {
  announcement: {
    ratio: 16 / 9,
    aspectClass: "aspect-[16/9] w-full max-w-sm rounded-lg",
    advice: "Format paysage 16:9, idéalement 1600 × 900 pixels.",
  },
  cover: {
    ratio: 2 / 3,
    aspectClass: "aspect-[2/3] w-32 rounded-md",
    advice: "Format portrait 2:3, comme un livre : idéalement 1000 × 1500 pixels.",
  },
  portrait: {
    ratio: 1,
    aspectClass: "aspect-square w-32 rounded-full",
    advice: "Format carré, visage au centre : idéalement 800 × 800 pixels.",
  },
} as const;

/**
 * Champ photo avec la taille conseillée et un aperçu recadré exactement comme
 * dans l'app, pour que l'auteur voie avant d'enregistrer ce qui sera coupé.
 */
export function ImageField({
  name,
  label,
  format,
  currentUrl,
}: {
  name: string;
  label: string;
  format: keyof typeof IMAGE_FORMATS;
  currentUrl?: string | null;
}) {
  const { ratio, aspectClass, advice } = IMAGE_FORMATS[format];
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mismatch, setMismatch] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setMismatch(false);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  }

  const shown = previewUrl ?? currentUrl ?? null;

  return (
    <div className="flex flex-col gap-2">
      <label className={labelClass}>
        {label}
        <input
          type="file"
          name={name}
          accept="image/*"
          onChange={handleChange}
          className={inputClass}
        />
        <span className={hintClass}>
          📐 {advice}
          {currentUrl && !previewUrl && " Laisser vide pour garder la photo actuelle."}
        </span>
      </label>

      {shown && (
        <div>
          <p className="mb-1 text-xs text-ink-light">
            {previewUrl ? "Aperçu tel qu'affiché dans l'app :" : "Photo actuelle :"}
          </p>
          <div className={`relative overflow-hidden border border-ink/10 bg-ink/5 ${aspectClass}`}>
            {/* eslint-disable-next-line @next/next/no-img-element -- aperçu local (blob:) */}
            <img
              src={shown}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              onLoad={(e) => {
                if (!previewUrl) return;
                const img = e.currentTarget;
                const actual = img.naturalWidth / img.naturalHeight;
                setMismatch(Math.abs(actual - ratio) / ratio > 0.15);
              }}
            />
          </div>
          {mismatch && (
            <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
              ⚠️ Votre photo n&apos;a pas le bon format : une partie sera
              coupée, comme dans l&apos;aperçu. Pour choisir vous-même le
              cadrage, recadrez-la avant de l&apos;envoyer (sur iPhone :
              Photos → Modifier → icône recadrer → format{" "}
              {format === "announcement" ? "16:9" : format === "cover" ? "2:3" : "Carré"}
              ).
            </p>
          )}
        </div>
      )}
    </div>
  );
}
