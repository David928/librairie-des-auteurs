import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = SITE.name;

/** Image affichée quand on partage un lien de l'app (WhatsApp, Facebook...). */
export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f3ece0",
        }}
      >
        <img src={logoSrc} width={960} height={404} alt="" />
        <div
          style={{
            marginTop: 36,
            fontSize: 30,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#8c2f39",
          }}
        >
          {`Nouveautés · Dédicaces · Auteurs — ${SITE.city}`}
        </div>
      </div>
    ),
    size
  );
}
