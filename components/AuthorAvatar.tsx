import Image from "next/image";

export function AuthorAvatar({
  name,
  photoUrl,
  className = "h-16 w-16",
  priority,
}: {
  name: string;
  photoUrl: string | null;
  className?: string;
  priority?: boolean;
}) {
  const initials = name
    .replace(/\(.*?\)/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full bg-accent/10 ${className}`}
    >
      {photoUrl ? (
        <Image
          src={photoUrl}
          alt={name}
          fill
          sizes="160px"
          priority={priority}
          className="object-cover"
        />
      ) : (
        <div className="flex h-full items-center justify-center font-serif text-lg font-semibold text-accent">
          {initials}
        </div>
      )}
    </div>
  );
}
