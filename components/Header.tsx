"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";

export function Header() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream-light/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2.5 sm:px-6">
        <Link href="/">
          <Logo />
        </Link>
        <Link
          href="/admin"
          aria-label="Espace auteur"
          className={`rounded-full p-2 transition hover:bg-ink/5 ${
            pathname.startsWith("/admin") ? "text-accent" : "text-ink-light"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            className="h-6 w-6"
          >
            <circle cx="12" cy="8" r="3.5" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 20c0-4.1 3.4-6.5 7.5-6.5s7.5 2.4 7.5 6.5"
            />
          </svg>
        </Link>
      </div>
    </header>
  );
}
