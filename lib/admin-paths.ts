import type { Session } from "@/lib/auth";

/** Page où revenir après une modification : le tableau de bord pour sa propre fiche, sinon la fiche gérée. */
export function authorAdminPath(session: Session, authorId: string) {
  return session.author?.id === authorId ? "/admin" : `/admin/auteurs/${authorId}`;
}
