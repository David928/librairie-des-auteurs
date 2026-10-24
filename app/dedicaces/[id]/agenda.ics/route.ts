import { createClient } from "@/lib/supabase/server";
import { signingIcs } from "@/lib/calendar";
import { slugify } from "@/lib/slugify";
import { SIGNING_SELECT, type SigningWithDetails } from "@/lib/supabase/types";

/** Fichier agenda (.ics) d'une dédicace, à ouvrir avec Calendrier / Outlook. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: signing } = await supabase
    .from("signings")
    .select(SIGNING_SELECT)
    .eq("id", id)
    .maybeSingle<SigningWithDetails>();

  if (!signing) {
    return new Response("Dédicace introuvable", { status: 404 });
  }

  const fileName = `dedicace-${slugify(signing.author.name)}.ics`;
  return new Response(signingIcs(signing), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `inline; filename="${fileName}"`,
    },
  });
}
