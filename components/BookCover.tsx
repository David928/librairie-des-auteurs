import Image from "next/image";

/** Couverture au format livre (2:3), avec une couverture « typographique » si pas de photo. */
export function BookCover({
  title,
  coverUrl,
  sizes = "(max-width: 640px) 33vw, 180px",
  priority,
  className = "",
}: {
  title: string;
  coverUrl: string | null;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative aspect-[2/3] w-full overflow-hidden rounded-md bg-ink/5 shadow-sm ${className}`}
    >
      {coverUrl ? (
        <Image
          src={coverUrl}
          alt={title}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center border-l-4 border-accent/70 bg-cream px-2 text-center">
          <span className="line-clamp-4 font-serif text-xs font-semibold text-ink">
            {title}
          </span>
        </div>
      )}
    </div>
  );
}
