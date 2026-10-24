import { SITE, SITE_ADDRESS_ONE_LINE } from "@/lib/site";
import type { SigningWithDetails } from "@/lib/supabase/types";

/** Durée par défaut d'une dédicace sans heure de fin, pour l'agenda. */
const DEFAULT_DURATION_MS = 2 * 60 * 60 * 1000;

export function signingTitle(signing: SigningWithDetails) {
  return `${signing.title || "Dédicace"} — ${signing.author.name}`;
}

export function signingLocation(signing: Pick<SigningWithDetails, "location">) {
  return signing.location || `${SITE.name}, ${SITE_ADDRESS_ONE_LINE}`;
}

function signingEnd(signing: SigningWithDetails) {
  return signing.ends_at
    ? new Date(signing.ends_at)
    : new Date(new Date(signing.starts_at).getTime() + DEFAULT_DURATION_MS);
}

/** 2026-11-14T13:00:00.000Z → 20261114T130000Z */
function icsDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function icsEscape(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function signingDetails(signing: SigningWithDetails) {
  const lines = [];
  if (signing.book) lines.push(`Livre : ${signing.book.title}`);
  if (signing.description) lines.push(signing.description);
  lines.push(`${SITE.url}/dedicaces#${signing.id}`);
  return lines.join("\n\n");
}

export function signingIcs(signing: SigningWithDetails) {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${SITE.name}//Dedicaces//FR`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${signing.id}@${new URL(SITE.url).hostname}`,
    `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(new Date(signing.starts_at))}`,
    `DTEND:${icsDate(signingEnd(signing))}`,
    `SUMMARY:${icsEscape(signingTitle(signing))}`,
    `LOCATION:${icsEscape(signingLocation(signing))}`,
    `DESCRIPTION:${icsEscape(signingDetails(signing))}`,
    `URL:${SITE.url}/dedicaces`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

export function signingGoogleCalendarUrl(signing: SigningWithDetails) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: signingTitle(signing),
    dates: `${icsDate(new Date(signing.starts_at))}/${icsDate(signingEnd(signing))}`,
    location: signingLocation(signing),
    details: signingDetails(signing),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
