import { createClient } from "@/lib/supabase/server";
import {
  SIGNING_SELECT,
  type AnnouncementWithAuthor,
  type Author,
  type BookWithAuthor,
  type SigningWithDetails,
} from "@/lib/supabase/types";

const BOOK_SELECT = "*, author:authors(slug, name)";

/** Nombre de jours pendant lesquels un livre est considéré comme « nouveauté ». */
export const NEW_BOOK_DAYS = 45;

/**
 * Dédicaces à venir ou en cours : pas encore terminées (ou, sans heure de
 * fin, commencées il y a moins de 2 heures). Triées de la plus proche à la
 * plus lointaine.
 */
export async function getUpcomingSignings({
  authorId,
  limit,
}: { authorId?: string; limit?: number } = {}) {
  const supabase = await createClient();
  const now = new Date();
  const nowIso = now.toISOString();
  const twoHoursAgo = new Date(now.getTime() - 2 * 3600 * 1000).toISOString();

  let query = supabase
    .from("signings")
    .select(SIGNING_SELECT)
    .or(`ends_at.gt.${nowIso},and(ends_at.is.null,starts_at.gt.${twoHoursAgo})`)
    .order("starts_at", { ascending: true });
  if (authorId) query = query.eq("author_id", authorId);
  if (limit) query = query.limit(limit);

  const { data } = await query.returns<SigningWithDetails[]>();
  return data ?? [];
}

/** Livres arrivés récemment (les plus récents d'abord). */
export async function getLatestBooks({
  limit,
  sinceDays,
}: { limit?: number; sinceDays?: number } = {}) {
  const supabase = await createClient();
  let query = supabase
    .from("books")
    .select(BOOK_SELECT)
    .eq("is_available", true)
    .order("created_at", { ascending: false });
  if (sinceDays) {
    const since = new Date(Date.now() - sinceDays * 24 * 3600 * 1000);
    query = query.gte("created_at", since.toISOString());
  }
  if (limit) query = query.limit(limit);

  const { data } = await query.returns<BookWithAuthor[]>();
  return data ?? [];
}

export async function getAllBooks() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("books")
    .select(BOOK_SELECT)
    .order("created_at", { ascending: false })
    .returns<BookWithAuthor[]>();
  return data ?? [];
}

/** Un livre disponible tiré au hasard (différent à chaque ouverture de l'accueil). */
export async function getRandomBook(excludeIds: string[] = []) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("books")
    .select(BOOK_SELECT)
    .eq("is_available", true)
    .returns<BookWithAuthor[]>();
  if (!data || data.length === 0) return null;

  const pool = data.filter((b) => !excludeIds.includes(b.id));
  const candidates = pool.length > 0 ? pool : data;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export async function getRandomAuthor() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("authors")
    .select("*")
    .returns<Author[]>();
  if (!data || data.length === 0) return null;
  return data[Math.floor(Math.random() * data.length)];
}

/** Annonces en ligne (non expirées), de la librairie et des auteurs. */
export async function getActiveAnnouncements({
  authorId,
}: { authorId?: string } = {}) {
  const supabase = await createClient();
  const nowIso = new Date().toISOString();
  let query = supabase
    .from("announcements")
    .select("*, author:authors(slug, name)")
    .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
    .order("created_at", { ascending: false });
  if (authorId) query = query.eq("author_id", authorId);

  const { data } = await query.returns<AnnouncementWithAuthor[]>();
  return data ?? [];
}
