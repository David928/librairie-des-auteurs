import webpush from "web-push";
import { SITE } from "@/lib/site";
import { createAdminClient } from "@/lib/supabase/admin";

let configured = false;

/** Configure les clés VAPID au premier envoi ; sans clés, les notifications sont ignorées. */
function configure(): boolean {
  if (configured) return true;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) return false;
  webpush.setVapidDetails(`mailto:${SITE.contactEmail}`, publicKey, privateKey);
  configured = true;
  return true;
}

export async function sendPushToAll(payload: {
  title: string;
  body?: string;
  url?: string;
}) {
  if (!configure()) return;

  const admin = createAdminClient();
  const { data: subscriptions } = await admin
    .from("push_subscriptions")
    .select("id, endpoint, p256dh, auth");

  if (!subscriptions || subscriptions.length === 0) return;

  await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          JSON.stringify(payload)
        );
      } catch (err) {
        const statusCode = (err as { statusCode?: number }).statusCode;
        if (statusCode === 404 || statusCode === 410) {
          await admin.from("push_subscriptions").delete().eq("id", sub.id);
        }
      }
    })
  );
}
