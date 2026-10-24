import { SigningCard } from "@/components/SigningCard";
import { PushSubscribeButton } from "@/components/PushSubscribeButton";
import { getUpcomingSignings } from "@/lib/queries";
import { pageTitle } from "@/lib/site";
import { TIME_ZONE } from "@/lib/dates";

export const revalidate = 300;

export const metadata = {
  title: pageTitle("Dédicaces"),
  description: "Les prochaines séances de dédicace à la librairie.",
};

function monthLabel(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    timeZone: TIME_ZONE,
    month: "long",
    year: "numeric",
  });
}

export default async function DedicacesPage() {
  const signings = await getUpcomingSignings();

  // Regroupement par mois (« novembre 2026 », « décembre 2026 »...).
  const groups: { label: string; items: typeof signings }[] = [];
  for (const signing of signings) {
    const label = monthLabel(signing.starts_at);
    const last = groups[groups.length - 1];
    if (last?.label === label) last.items.push(signing);
    else groups.push({ label, items: [signing] });
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-10">
      <h1 className="text-2xl font-semibold text-ink">Dédicaces</h1>
      <p className="mt-1 text-sm text-ink-light">
        Rencontrez les auteurs et repartez avec un livre dédicacé.
        Ajoutez les rendez-vous qui vous intéressent à votre agenda.
      </p>

      <div className="mt-5">
        <PushSubscribeButton label="🔔 Être prévenu·e des nouvelles dédicaces" />
      </div>

      {groups.length > 0 ? (
        groups.map((group) => (
          <section key={group.label} className="mt-2 first:mt-0">
            <h2 className="mb-3 mt-6 text-sm font-semibold uppercase tracking-wide text-ink-light first:mt-0">
              {group.label}
            </h2>
            <div className="flex flex-col gap-3">
              {group.items.map((s) => (
                <SigningCard key={s.id} signing={s} />
              ))}
            </div>
          </section>
        ))
      ) : (
        <p className="mt-5 rounded-xl border border-dashed border-ink/15 px-4 py-6 text-center text-ink-light">
          Aucune dédicace programmée pour l&apos;instant. Revenez bientôt !
        </p>
      )}
    </div>
  );
}
