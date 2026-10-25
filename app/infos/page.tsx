import Link from "next/link";
import { SITE, pageTitle } from "@/lib/site";

export const metadata = {
  title: pageTitle("Infos pratiques"),
};

export default function InfosPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-6 sm:px-6 sm:py-10">
      <h1 className="text-2xl font-semibold text-ink">Infos pratiques</h1>

      <p className="mt-3 text-sm text-ink-light">
        Cette application vous fait découvrir les nouveautés de la
        librairie, les prochaines séances de dédicace et les auteurs dont
        nous proposons les livres.
      </p>

      <p className="mt-4 text-sm text-ink-light">
        Mais rien ne remplace une visite : passez flâner entre les rayons,
        demander conseil ou commander un livre qui n&apos;est pas en stock !
      </p>

      <div className="mt-5 rounded-xl border border-ink/10 bg-white/60 px-4 py-4 text-sm text-ink-light">
        <p className="font-semibold text-ink">Retrouvez-nous :</p>
        <p className="mt-1">
          📍 <span className="font-medium text-ink">{SITE.name}</span>
          {SITE.address.map((line) => (
            <span key={line}>
              <br />
              {line}
            </span>
          ))}
        </p>
        <p className="mt-2">
          📞{" "}
          <a
            href={`tel:${SITE.phone.replace(/\s/g, "")}`}
            className="text-accent hover:underline"
          >
            {SITE.phone}
          </a>
          <br />
          ✉️{" "}
          <a
            href={`mailto:${SITE.contactEmail}`}
            className="break-all text-accent hover:underline"
          >
            {SITE.contactEmail}
          </a>
        </p>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            [SITE.name, ...SITE.address].join(" ")
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-medium text-white transition hover:bg-accent-light"
        >
          Voir l&apos;itinéraire →
        </a>
        <p className="mt-4 font-semibold text-ink">
          🕒 Nos horaires d&apos;ouverture :
        </p>
        <ul className="mt-1 space-y-0.5">
          {SITE.hours.map((line) => (
            <li key={line}>• {line}</li>
          ))}
        </ul>
      </div>

      <div className="mt-5 rounded-xl border border-accent/30 bg-accent/10 px-4 py-4 text-sm text-ink-light">
        <p className="font-semibold text-ink">📱 Installation</p>
        <p className="mt-1">
          Ce site est une <strong>web app</strong>{" "}
          : pas besoin de passer par l&apos;App Store ou le Play Store.
          Installez-la sur votre écran d&apos;accueil pour l&apos;ouvrir
          comme une vraie application, en plein écran.
        </p>
        <p className="mt-2">
          C&apos;est important : sans installation, les{" "}
          <strong>notifications des nouveautés et des dédicaces</strong>{" "}
          ne fonctionnent pas sur iPhone, et l&apos;appli est bien plus
          rapide à retrouver au quotidien une fois installée.
        </p>

        <p className="mt-4 font-semibold text-ink">Sur iPhone (Safari)</p>
        <ol className="mt-1 list-decimal space-y-0.5 pl-5">
          <li>Ouvrez ce site dans Safari</li>
          <li>
            Appuyez sur le bouton <strong>Partager</strong>{" "}
            (le carré avec une flèche vers le haut, en bas de
            l&apos;écran)
          </li>
          <li>
            Choisissez <strong>« Sur l&apos;écran d&apos;accueil »</strong>
          </li>
          <li>
            Appuyez sur <strong>Ajouter</strong>
          </li>
        </ol>

        <p className="mt-4 font-semibold text-ink">Sur Android (Chrome)</p>
        <ol className="mt-1 list-decimal space-y-0.5 pl-5">
          <li>Ouvrez ce site dans Chrome</li>
          <li>
            Appuyez sur le menu <strong>⋮</strong>{" "}
            (trois points, en haut à droite)
          </li>
          <li>
            Choisissez <strong>« Installer l&apos;application »</strong>{" "}
            (ou « Ajouter à l&apos;écran d&apos;accueil »)
          </li>
          <li>
            Confirmez avec <strong>Installer</strong>
          </li>
        </ol>
      </div>

      <p className="mt-6 text-center text-xs text-ink-light">
        Vous êtes auteur et vos livres sont à la librairie ?{" "}
        <Link href="/admin" className="font-medium text-accent hover:underline">
          Accéder à votre espace
        </Link>
      </p>
    </div>
  );
}
