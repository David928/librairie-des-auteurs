import Image from "next/image";
import Link from "next/link";
import { formatShortDate } from "@/lib/dates";
import { SITE } from "@/lib/site";
import type { AnnouncementWithAuthor } from "@/lib/supabase/types";

export function AnnouncementCard({
  announcement,
  showAuthor = true,
}: {
  announcement: AnnouncementWithAuthor;
  showAuthor?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-ink/10 bg-white/60">
      {announcement.image_url && (
        <div className="relative aspect-[16/9] w-full bg-ink/5">
          <Image
            src={announcement.image_url}
            alt={announcement.title}
            fill
            sizes="(max-width: 672px) 100vw, 672px"
            className="object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center justify-between gap-3 text-xs text-ink-light">
          {showAuthor ? (
            <span className="min-w-0 truncate">
              {announcement.author ? (
                <>
                  Par{" "}
                  <Link
                    href={`/auteurs/${announcement.author.slug}`}
                    className="font-medium text-accent hover:underline"
                  >
                    {announcement.author.name}
                  </Link>
                </>
              ) : (
                <span className="font-medium text-accent">{SITE.name}</span>
              )}
            </span>
          ) : (
            <span />
          )}
          <span className="shrink-0">
            {formatShortDate(announcement.created_at)}
          </span>
        </div>
        <h3 className="mt-1 font-serif text-base font-semibold text-ink">
          {announcement.title}
        </h3>
        {announcement.description && (
          <p className="mt-1 whitespace-pre-line text-sm text-ink-light">
            {announcement.description}
          </p>
        )}
      </div>
    </div>
  );
}
