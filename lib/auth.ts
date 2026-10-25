import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Author } from "@/lib/supabase/types";

export type Session = {
  userId: string;
  email: string | null;
  /** Fiche auteur reliée au compte (via profiles), s'il y en a une. */
  author: Author | null;
  superAdmin: boolean;
};

/** Le compte connecté, sa fiche auteur éventuelle et s'il est superadmin. */
export async function getSession(): Promise<Session | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // SUPERADMIN_EMAIL peut contenir plusieurs emails séparés par des virgules.
  const superadminEmails = (process.env.SUPERADMIN_EMAIL ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  const superAdmin =
    !!user.email && superadminEmails.includes(user.email.toLowerCase());

  const { data: profile } = await supabase
    .from("profiles")
    .select("author_id")
    .eq("id", user.id)
    .maybeSingle();

  let author: Author | null = null;
  if (profile) {
    const { data } = await supabase
      .from("authors")
      .select("*")
      .eq("id", profile.author_id)
      .maybeSingle<Author>();
    author = data;
  }

  return { userId: user.id, email: user.email ?? null, author, superAdmin };
}

export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function requireSuperAdmin(): Promise<Session> {
  const session = await requireSession();
  if (!session.superAdmin) redirect("/admin");
  return session;
}

/**
 * Vérifie que le compte connecté peut gérer cette fiche auteur (c'est la
 * sienne, ou c'est le superadmin) et renvoie la fiche. Sinon, renvoie vers
 * le tableau de bord.
 */
export async function requireAuthorAccess(
  authorId: string
): Promise<{ session: Session; author: Author }> {
  const session = await requireSession();

  if (session.author?.id === authorId) {
    return { session, author: session.author };
  }
  if (!session.superAdmin) redirect("/admin");

  const admin = createAdminClient();
  const { data: author } = await admin
    .from("authors")
    .select("*")
    .eq("id", authorId)
    .maybeSingle<Author>();
  if (!author) redirect("/admin");

  return { session, author };
}
