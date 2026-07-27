import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Lenava — AI Agents for Ecommerce Brands";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
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
          backgroundColor: "#7C3AED",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -180,
            width: 560,
            height: 560,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 28,
          }}
        >
          <svg width="40" height="27" viewBox="0 0 24 16" fill="none">
            <line x1="1" y1="13" x2="12" y2="13" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="4" y1="8" x2="18" y2="8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="7" y1="3" x2="23" y2="3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span
            style={{
              fontSize: 64,
              fontWeight: 500,
              color: "white",
              letterSpacing: 8,
              textTransform: "uppercase",
            }}
          >
            Lenava
          </span>
        </div>
        <span
          style={{
            fontSize: 30,
            color: "rgba(255,255,255,0.88)",
            letterSpacing: 1,
          }}
        >
          AI Agents for Ecommerce Brands
        </span>
      </div>
    ),
    { ...size }
  );
}
