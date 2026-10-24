/**
 * Toutes les dates de dédicace sont saisies et affichées à l'heure de Paris,
 * quel que soit le fuseau du serveur (Vercel tourne en UTC).
 */
export const TIME_ZONE = "Europe/Paris";

/** Décalage (en minutes) de l'heure de Paris par rapport à UTC à un instant donné. */
function parisOffsetMinutes(at: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(at);
  const get = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value);
  const asUtc = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour"),
    get("minute"),
    get("second")
  );
  return Math.round((asUtc - at.getTime()) / 60000);
}

/** "2026-11-14T14:00" (heure de Paris, champ datetime-local) → ISO UTC. */
export function parisLocalToIso(value: string): string | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(value.trim());
  if (!match) return null;
  const [, y, mo, d, h, mi] = match.map(Number);
  const naiveUtc = Date.UTC(y, mo - 1, d, h, mi);
  const offset = parisOffsetMinutes(new Date(naiveUtc));
  return new Date(naiveUtc - offset * 60000).toISOString();
}

/** ISO UTC → "2026-11-14T14:00" (heure de Paris), pour pré-remplir un champ datetime-local. */
export function isoToParisLocal(iso: string | null | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  const shifted = new Date(date.getTime() + parisOffsetMinutes(date) * 60000);
  return shifted.toISOString().slice(0, 16);
}

export function formatDay(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    timeZone: TIME_ZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function formatTime(iso: string) {
  return new Date(iso)
    .toLocaleTimeString("fr-FR", {
      timeZone: TIME_ZONE,
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(":", "h");
}

export function formatTimeRange(startsAt: string, endsAt: string | null) {
  return endsAt
    ? `${formatTime(startsAt)} – ${formatTime(endsAt)}`
    : `à partir de ${formatTime(startsAt)}`;
}

/** Jour (nombre) et mois abrégé, pour le pavé date des cartes de dédicace. */
export function dateBlock(iso: string) {
  const date = new Date(iso);
  return {
    day: date.toLocaleDateString("fr-FR", { timeZone: TIME_ZONE, day: "numeric" }),
    month: date
      .toLocaleDateString("fr-FR", { timeZone: TIME_ZONE, month: "short" })
      .replace(".", ""),
  };
}

export function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    timeZone: TIME_ZONE,
    day: "numeric",
    month: "long",
  });
}
