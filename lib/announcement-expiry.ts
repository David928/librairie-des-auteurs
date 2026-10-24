export const MAX_ANNOUNCEMENT_DAYS = 15;

/** Un auteur ne peut avoir qu'une seule annonce en ligne (non expirée) à la fois. */
export const MAX_ACTIVE_ANNOUNCEMENTS_PER_AUTHOR = 1;

function maxExpiryDate(): Date {
  return new Date(Date.now() + MAX_ANNOUNCEMENT_DAYS * 24 * 60 * 60 * 1000);
}

/**
 * Calcule la date d'expiration d'une annonce : sans date choisie, ou avec une
 * date trop lointaine, elle est plafonnée à MAX_ANNOUNCEMENT_DAYS pour que
 * les annonces ne s'accumulent pas indéfiniment.
 */
export function computeExpiresAt(value: FormDataEntryValue | null): string {
  const max = maxExpiryDate();
  const str = String(value ?? "").trim();
  if (!str) return max.toISOString();

  // Une date seule (YYYY-MM-DD) court jusqu'à la fin de cette journée.
  const requested = new Date(`${str}T23:59:59`);
  if (isNaN(requested.getTime())) return max.toISOString();

  return requested.getTime() < max.getTime()
    ? requested.toISOString()
    : max.toISOString();
}

/** Date max sélectionnable dans le champ (format YYYY-MM-DD pour <input type="date">). */
export function maxExpiryDateInputValue(): string {
  return maxExpiryDate().toISOString().slice(0, 10);
}

/** Annonce actuellement en ligne (non expirée) d'un auteur, s'il y en a une. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getActiveAnnouncement(supabase: any, authorId: string) {
  const nowIso = new Date().toISOString();
  const { data } = await supabase
    .from("announcements")
    .select("id, title")
    .eq("author_id", authorId)
    .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
    .order("created_at", { ascending: false })
    .limit(1);
  return (data?.[0] as { id: string; title: string } | undefined) ?? null;
}
