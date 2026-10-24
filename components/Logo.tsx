import { SITE } from "@/lib/site";

export function BookMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <rect width="48" height="48" rx="12" fill="#8c2f39" />
      <path
        d="M24 15c-3.2-2.2-7.4-2.9-11-2.4v21.2c3.6-.5 7.8.2 11 2.4 3.2-2.2 7.4-2.9 11-2.4V12.6c-3.6-.5-7.8.2-11 2.4Z"
        fill="#faf6ee"
      />
      <path d="M24 15v21.2" stroke="#8c2f39" strokeWidth="1.6" />
      <path d="M29 12.9v8.6l2-1.5 2 1.5v-8.9" fill="#b8893b" />
    </svg>
  );
}

export function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  const large = size === "lg";
  return (
    <span className="inline-flex items-center gap-2.5">
      <BookMark className={large ? "h-14 w-14" : "h-9 w-9"} />
      <span className="flex flex-col text-left leading-none">
        <span
          className={`font-serif font-semibold text-ink ${
            large ? "text-2xl sm:text-3xl" : "text-lg"
          }`}
        >
          {SITE.name}
        </span>
        <span
          className={`mt-1 uppercase tracking-[0.2em] text-accent ${
            large ? "text-xs" : "text-[10px]"
          }`}
        >
          {SITE.city}
        </span>
      </span>
    </span>
  );
}
