import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: 1200,
        height: 630,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #10b981 0%, #0d9488 50%, #06b6d4 100%)",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ fontSize: 96, marginBottom: 24 }}>🏷️</div>
      <div
        style={{
          fontSize: 72,
          fontWeight: "bold",
          color: "white",
          marginBottom: 20,
          textShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}
      >
        フリマ図鑑
      </div>
      <div style={{ fontSize: 32, color: "rgba(255,255,255,0.9)" }}>
        全国のフリーマーケット情報
      </div>
    </div>,
    { ...size }
  );
}
