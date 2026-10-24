/**
 * Informations de la librairie, centralisées ici : modifiez ce fichier pour
 * changer le nom, l'adresse, les horaires ou l'URL du site partout dans l'app.
 */
export const SITE = {
  name: "La librairie des auteurs",
  shortName: "Librairie des auteurs",
  city: "Vichy",
  url: "https://librairie-des-auteurs.vercel.app",
  description:
    "Les nouveautés, les séances de dédicace et les auteurs de La librairie des auteurs, à Vichy.",
  // Adresse affichée sur la page Infos et utilisée par défaut pour les dédicaces.
  address: ["Centre Commercial Les 4 Chemins", "35 rue Lucas", "03200 Vichy"],
  hours: [
    "Lundi : 14h00 à 19h00",
    "Mardi au samedi : 9h30 à 19h00",
    "Dimanche : 14h30 à 19h00",
  ],
  // Expéditeur des emails (doit être un expéditeur validé dans Brevo).
  emailFrom: "boutique@gravetincelle.com",
  contactEmail: "contact@gravetincelle.com",
  // Dossier de stockage des images publiées au nom de la librairie.
  uploadFolder: "librairie",
} as const;

export const SITE_ADDRESS_ONE_LINE = SITE.address.join(", ");

export function pageTitle(title?: string) {
  return title ? `${title} — ${SITE.name}` : `${SITE.name} — ${SITE.city}`;
}
