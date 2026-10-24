import Link from "next/link";
import { requireSuperAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteSigning } from "@/app/admin/dedicaces/actions";
import { AdminEmpty, AdminRow, EditLink } from "@/components/admin/AdminList";
import { BackLink } from "@/components/admin/BackLink";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { formatDay, formatTimeRange } from "@/lib/dates";
import { pageTitle } from "@/lib/site";
import { SIGNING_SELECT, type SigningWithDetails } from "@/lib/supabase/types";

export const metadata = {
  title: pageTitle("Toutes les dédicaces"),
};

export default async function AdminSigningsPage() {
  await requireSuperAdmin();

  const admin = createAdminClient();
  const { data: signings } = await admin
    .from("signings")
    .select(SIGNING_SELECT)
    .order("starts_at", { ascending: true })
    .returns<SigningWithDetails[]>();

  const now = new Date().getTime();
  const isPast = (s: SigningWithDetails) =>
    new Date(s.ends_at ?? s.starts_at).getTime() < now;
  const upcoming = (signings ?? []).filter((s) => !isPast(s));
  const past = (signings ?? []).filter(isPast).reverse();

  const row = (s: SigningWithDetails) => (
    <AdminRow
      key={s.id}
      title={
        <>
          <span className="capitalize">{formatDay(s.starts_at)}</span> ·{" "}
          {s.author.name}
        </>
      }
      subtitle={`${formatTimeRange(s.starts_at, s.ends_at)}${
        s.title ? ` · ${s.title}` : ""
      }`}
    >
      <EditLink href={`/admin/dedicaces/${s.id}`} />
      <form action={deleteSigning.bind(null, s.id)}>
        <ConfirmButton message="Supprimer cette dédicace ?">✕</ConfirmButton>
      </form>
    </AdminRow>
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <BackLink href="/admin" label="Tableau de bord" />
      <h1 className="mt-3 text-2xl font-semibold text-ink">Dédicaces</h1>
      <p className="mt-1 text-sm text-ink-light">
        Pour programmer une dédicace, ouvrez la fiche de l&apos;auteur dans{" "}
        <Link href="/admin/auteurs" className="text-accent hover:underline">
          Auteurs
        </Link>
        .
      </p>

      <h2 className="mt-8 text-lg font-semibold text-ink">À venir</h2>
      {upcoming.length > 0 ? (
        <ul className="mt-3 flex flex-col gap-2">{upcoming.map(row)}</ul>
      ) : (
        <AdminEmpty>Aucune dédicace à venir.</AdminEmpty>
      )}

      {past.length > 0 && (
        <>
          <h2 className="mt-10 text-lg font-semibold text-ink-light">Passées</h2>
          <ul className="mt-3 flex flex-col gap-2 opacity-70">{past.map(row)}</ul>
        </>
      )}
    </div>
  );
}
