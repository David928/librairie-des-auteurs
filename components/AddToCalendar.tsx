import { signingGoogleCalendarUrl } from "@/lib/calendar";
import type { SigningWithDetails } from "@/lib/supabase/types";

/**
 * Deux options : le fichier .ics (ouvert directement par l'agenda de
 * l'iPhone, du Mac ou d'Outlook) et le lien Google Agenda (Android).
 */
export function AddToCalendar({ signing }: { signing: SigningWithDetails }) {
  return (
    <details className="group relative">
      <summary className="flex w-fit cursor-pointer list-none items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent [&::-webkit-details-marker]:hidden">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          className="h-4 w-4"
        >
          <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
          <path strokeLinecap="round" d="M8 3v4M16 3v4M3.5 10h17M12 13v5M9.5 15.5h5" />
        </svg>
        Ajouter à mon agenda
      </summary>
      <div className="absolute left-0 z-20 mt-1.5 flex w-56 flex-col overflow-hidden rounded-xl border border-ink/10 bg-white text-sm shadow-lg">
        <a
          href={`/dedicaces/${signing.id}/agenda.ics`}
          className="px-4 py-2.5 text-ink hover:bg-cream"
        >
          📅 iPhone, Mac, Outlook
        </a>
        <a
          href={signingGoogleCalendarUrl(signing)}
          target="_blank"
          rel="noopener noreferrer"
          className="border-t border-ink/10 px-4 py-2.5 text-ink hover:bg-cream"
        >
          🗓️ Google Agenda
        </a>
      </div>
    </details>
  );
}
