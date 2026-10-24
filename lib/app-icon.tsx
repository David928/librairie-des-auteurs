import { ImageResponse } from "next/og";

/** Icône de l'application (livre ouvert crème sur fond bordeaux), en PNG. */
export function appIconResponse(size: number, { rounded = false } = {}) {
  const book = Math.round(size * 0.62);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#8c2f39",
          borderRadius: rounded ? size * 0.22 : 0,
        }}
      >
        <svg width={book} height={book} viewBox="0 0 48 48">
          <path
            d="M24 13c-4-2.8-9.3-3.6-14-3v26.5c4.7-.6 10 .2 14 3 4-2.8 9.3-3.6 14-3V10c-4.7-.6-10 .2-14 3Z"
            fill="#faf6ee"
          />
          <path d="M24 13v26.5" stroke="#8c2f39" strokeWidth="1.8" />
          <path d="M30.5 10.6v11l2.5-1.9 2.5 1.9V10.2" fill="#b8893b" />
        </svg>
      </div>
    ),
    { width: size, height: size }
  );
}
