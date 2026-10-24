/** Texte d'un champ de formulaire, nettoyé ; null si vide. */
export function text(formData: FormData, name: string): string | null {
  const value = String(formData.get(name) ?? "").trim();
  return value || null;
}

export function checked(formData: FormData, name: string): boolean {
  return formData.get(name) === "on";
}

export function price(formData: FormData, name: string): number | null {
  const value = text(formData, name);
  if (!value) return null;
  const number = Number(value.replace(",", "."));
  return Number.isFinite(number) ? number : null;
}
