"use client";

import { useEffect, useState, useTransition } from "react";
import {
  subscribeToPush,
  unsubscribeFromPush,
} from "@/app/nouveautes/push-actions";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

type Status = "loading" | "unsupported" | "ios-not-installed" | "off" | "on";

function isIosNotInstalled() {
  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true;
  return isIos && !isStandalone;
}

export function PushSubscribeButton({
  label = "🔔 Activer les notifications",
}: {
  label?: string;
}) {
  const [status, setStatus] = useState<Status>("loading");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkStatus() {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        setStatus("unsupported");
        return;
      }
      if (isIosNotInstalled()) {
        setStatus("ios-not-installed");
        return;
      }
      const registration = await navigator.serviceWorker.ready;
      const existing = await registration.pushManager.getSubscription();
      setStatus(existing ? "on" : "off");
    }
    checkStatus();
  }, []);

  function handleSubscribe() {
    setError(null);
    startTransition(async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          setError("Autorisation refusée.");
          return;
        }
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
          ),
        });
        await subscribeToPush(subscription.toJSON() as {
          endpoint: string;
          keys: { p256dh: string; auth: string };
        });
        setStatus("on");
      } catch {
        setError("Impossible d'activer les notifications.");
      }
    });
  }

  function handleUnsubscribe() {
    setError(null);
    startTransition(async () => {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await unsubscribeFromPush(subscription.endpoint);
          await subscription.unsubscribe();
        }
        setStatus("off");
      } catch {
        setError("Impossible de désactiver les notifications.");
      }
    });
  }

  if (status === "loading" || status === "unsupported") return null;

  if (status === "ios-not-installed") {
    return (
      <p className="mb-5 rounded-xl border border-ink/10 bg-cream-light px-4 py-3 text-sm text-ink-light">
        📱 Pour recevoir les notifications sur iPhone, ajoutez d&apos;abord
        l&apos;appli à votre écran d&apos;accueil (voir{" "}
        <a href="/infos" className="text-accent hover:underline">
          Infos pratiques
        </a>
        ).
      </p>
    );
  }

  return (
    <div className="mb-5 flex flex-col gap-2">
      <button
        type="button"
        onClick={status === "on" ? handleUnsubscribe : handleSubscribe}
        disabled={pending}
        className="flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-medium text-accent disabled:opacity-50"
      >
        {status === "on"
          ? "🔔 Notifications activées"
          : label}
      </button>
      {error && <p className="text-xs text-red-700">{error}</p>}
    </div>
  );
}
