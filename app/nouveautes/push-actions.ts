"use server";

import { createClient } from "@/lib/supabase/server";

export async function subscribeToPush(subscription: {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("push_subscriptions").insert({
    endpoint: subscription.endpoint,
    p256dh: subscription.keys.p256dh,
    auth: subscription.keys.auth,
  });
  // 23505 = déjà abonné avec cet endpoint : rien à faire, ce n'est pas une erreur.
  if (error && error.code !== "23505") throw new Error(error.message);
}

export async function unsubscribeFromPush(endpoint: string) {
  const supabase = await createClient();
  await supabase.from("push_subscriptions").delete().eq("endpoint", endpoint);
}
