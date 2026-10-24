import { revalidatePath } from "next/cache";

/**
 * Le catalogue est petit : après chaque modification, on rafraîchit toutes
 * les pages (accueil, nouveautés, dédicaces, fiches...) plutôt que de cibler
 * une par une celles qui affichent la donnée modifiée.
 */
export function revalidateCatalog() {
  revalidatePath("/", "layout");
}
