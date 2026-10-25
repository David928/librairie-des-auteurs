"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const INSTALLED_KEY = "librairie-auteurs-installed";
const DISMISSED_AT_KEY = "librairie-auteurs-install-dismissed-at";
const DISMISS_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as { standalone?: boolean }).standalone === true
  );
}

function isIOS(): boolean {
  return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
}

export function InstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [ios, setIos] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (isStandalone()) {
      localStorage.setItem(INSTALLED_KEY, "1");
      return;
    }
    if (localStorage.getItem(INSTALLED_KEY)) return;

    const dismissedAt = Number(localStorage.getItem(DISMISSED_AT_KEY) ?? 0);
    if (dismissedAt && Date.now() - dismissedAt < DISMISS_COOLDOWN_MS) return;

    let showTimer: ReturnType<typeof setTimeout>;

    if (isIOS()) {
      showTimer = setTimeout(() => {
        setIos(true);
        setVisible(true);
      }, 2500);
    } else {
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        showTimer = setTimeout(() => setVisible(true), 2500);
      };
      window.addEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );

      const handleAppInstalled = () => {
        localStorage.setItem(INSTALLED_KEY, "1");
        setVisible(false);
      };
      window.addEventListener("appinstalled", handleAppInstalled);

      return () => {
        window.removeEventListener(
          "beforeinstallprompt",
          handleBeforeInstallPrompt
        );
        window.removeEventListener("appinstalled", handleAppInstalled);
        clearTimeout(showTimer);
      };
    }

    return () => clearTimeout(showTimer);
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISSED_AT_KEY, String(Date.now()));
    setVisible(false);
  }

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      localStorage.setItem(INSTALLED_KEY, "1");
    } else {
      localStorage.setItem(DISMISSED_AT_KEY, String(Date.now()));
    }
    setDeferredPrompt(null);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-20 z-[60] flex justify-center px-4">
      <div className="w-full max-w-sm animate-[splash-in_0.3s_ease-out] rounded-2xl border border-ink/10 bg-cream-light p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <Image
            src="/icon-192.png"
            alt=""
            width={44}
            height={44}
            className="h-11 w-11 shrink-0 rounded-xl"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-ink">
              Installer La librairie des auteurs
            </p>
            {ios ? (
              <p className="mt-1 text-sm text-ink-light">
                Appuyez sur{" "}
                <span aria-hidden className="font-medium">
                  •••
                </span>{" "}
                (ou l&apos;icône Partager), puis sur « Partager », puis sur
                « Sur l&apos;écran d&apos;accueil » pour un accès rapide,
                comme une vraie application.
              </p>
            ) : (
              <p className="mt-1 text-sm text-ink-light">
                Ajoutez-la sur votre écran d&apos;accueil pour un accès
                rapide, comme une vraie application.
              </p>
            )}
            <div className="mt-3 flex items-center gap-4">
              {!ios && (
                <button
                  type="button"
                  onClick={handleInstall}
                  className="rounded-full bg-ink px-4 py-1.5 text-sm font-medium text-cream-light transition hover:bg-ink-light"
                >
                  Installer
                </button>
              )}
              <button
                type="button"
                onClick={dismiss}
                className="text-sm text-ink-light hover:underline"
              >
                {ios ? "J'ai compris" : "Plus tard"}
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Fermer"
            className="shrink-0 text-ink-light hover:text-ink"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
