import Image from "next/image";
import { SITE } from "@/lib/site";

const SIZES = {
  // En-tête des pages (hors accueil)
  sm: "h-11 w-auto sm:h-12",
  // Haut de la page d'accueil
  lg: "mx-auto h-28 w-auto sm:h-36",
  // Écran de démarrage
  xl: "mx-auto h-auto w-64 sm:w-80",
};

export function Logo({
  size = "sm",
  priority = true,
}: {
  size?: keyof typeof SIZES;
  priority?: boolean;
}) {
  return (
    <Image
      src="/logo.png"
      alt={SITE.name}
      width={1200}
      height={505}
      className={SIZES[size]}
      priority={priority}
    />
  );
}
