"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    href: "/",
    label: "Accueil",
    icon: (active: boolean) => (
      <svg
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.8}
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 11.5 12 4l9 7.5M5.5 10v9a1 1 0 0 0 1 1H10v-6h4v6h3.5a1 1 0 0 0 1-1v-9"
        />
      </svg>
    ),
  },
  {
    href: "/nouveautes",
    label: "Nouveautés",
    icon: (active: boolean) => (
      <svg
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.8}
        className="h-6 w-6"
      >
        <path
          strokeLinejoin="round"
          d="M12 3c.7 3.6 2.1 5 5.7 5.7-3.6.7-5 2.1-5.7 5.7-.7-3.6-2.1-5-5.7-5.7C9.9 8 11.3 6.6 12 3Z"
        />
        <path
          strokeLinejoin="round"
          d="M18 14.5c.3 1.6.9 2.2 2.5 2.5-1.6.3-2.2.9-2.5 2.5-.3-1.6-.9-2.2-2.5-2.5 1.6-.3 2.2-.9 2.5-2.5Z"
        />
      </svg>
    ),
  },
  {
    href: "/dedicaces",
    label: "Dédicaces",
    icon: (active: boolean) => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="h-6 w-6"
      >
        <rect
          x="3.5"
          y="5"
          width="17"
          height="15.5"
          rx="2"
          fill={active ? "currentColor" : "none"}
        />
        <path strokeLinecap="round" d="M8 3v4M16 3v4" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke={active ? "var(--color-cream-light)" : "currentColor"}
          d="M7.5 16c1.2-2 2-3.2 2.7-3.2.9 0 .2 3 1.2 3 .8 0 1.5-2 2.4-2 .7 0 .7 1.2 1.6 1.2.6 0 1.2-.4 1.6-.8"
        />
      </svg>
    ),
  },
  {
    href: "/auteurs",
    label: "Auteurs",
    icon: (active: boolean) => (
      <svg
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.8}
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.5C9.8 5 6.9 4.5 4 4.8v13.4c2.9-.3 5.8.2 8 1.7 2.2-1.5 5.1-2 8-1.7V4.8c-2.9-.3-5.8.2-8 1.7Z"
        />
        <path
          d="M12 6.5v13.4"
          stroke={active ? "var(--color-cream-light)" : "currentColor"}
        />
      </svg>
    ),
  },
  {
    href: "/favoris",
    label: "Favoris",
    icon: (active: boolean) => (
      <svg
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.8}
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 20.5s-7.5-4.6-9.8-9.2C.7 8 2 4.8 5.2 4.1c2-.4 3.9.5 4.8 2.3.4.8 1.6.8 2 0 .9-1.8 2.8-2.7 4.8-2.3 3.2.7 4.5 3.9 3 7.2-2.3 4.6-9.8 9.2-9.8 9.2Z"
        />
      </svg>
    ),
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-ink/10 bg-cream-light/95 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-md items-stretch justify-around">
        {tabs.map((tab) => {
          const active =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href) ||
                (tab.href === "/auteurs" && pathname.startsWith("/livres"));
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition ${
                active ? "text-accent" : "text-ink-light"
              }`}
            >
              {tab.icon(active)}
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
