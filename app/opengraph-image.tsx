import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = SITE.name;

export default function OpengraphImage() {
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
          color: "#2f2a26",
          fontFamily: "Georgia, serif",
        }}
      >
        <svg width="160" height="160" viewBox="0 0 48 48">
          <rect width="48" height="48" rx="12" fill="#8c2f39" />
          <path
            d="M24 15c-3.2-2.2-7.4-2.9-11-2.4v21.2c3.6-.5 7.8.2 11 2.4 3.2-2.2 7.4-2.9 11-2.4V12.6c-3.6-.5-7.8.2-11 2.4Z"
            fill="#faf6ee"
          />
          <path d="M24 15v21.2" stroke="#8c2f39" strokeWidth="1.6" />
          <path d="M29 12.9v8.6l2-1.5 2 1.5v-8.9" fill="#b8893b" />
        </svg>
        <div style={{ marginTop: 40, fontSize: 76, fontWeight: 700 }}>
          {SITE.name}
        </div>
        <div
          style={{
            marginTop: 16,
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
