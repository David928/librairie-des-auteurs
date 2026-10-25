/**
 * Informations de la librairie, centralisées ici : modifiez ce fichier pour
 * changer le nom, l'adresse, les horaires ou l'URL du site partout dans l'app.
 */
export const SITE = {
  name: "La librairie des auteurs",
  shortName: "Librairie des auteurs",
  city: "Cusset",
  url: "https://librairie-des-auteurs.vercel.app",
  description:
    "Les nouveautés, les séances de dédicace et les auteurs de La librairie des auteurs, à Cusset.",
  // Adresse affichée sur la page Infos et utilisée par défaut pour les dédicaces.
  address: ["32 place Victor Hugo", "03300 Cusset"],
  phone: "06 11 13 89 19",
  hours: [
    "Mardi : 9h30 – 19h",
    "Mercredi : 14h30 – 18h30",
    "Jeudi : 9h30 – 18h30",
    "Vendredi : 9h30 – 13h",
    "Samedi : 9h – 13h",
    "Fermé le lundi et le dimanche",
  ],
  // Expéditeur des emails : doit être validé dans Brevo (Expéditeurs).
  // À remplacer par une adresse sur un nom de domaine de la librairie dès
  // qu'il y en aura un (meilleure arrivée en boîte de réception).
  emailFrom: "lalibrairiedesauteurs@gmail.com",
  contactEmail: "lalibrairiedesauteurs@gmail.com",
  // Dossier de stockage des images publiées au nom de la librairie.
  uploadFolder: "librairie",
} as const;

export const SITE_ADDRESS_ONE_LINE = SITE.address.join(", ");

export function pageTitle(title?: string) {
  return title ? `${title} — ${SITE.name}` : `${SITE.name} — ${SITE.city}`;
}
