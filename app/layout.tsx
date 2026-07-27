import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://lenava.io"),
  title: "Lenava — AI Agents for Ecommerce Brands",
  description:
    "AI agents and automation systems for independent ecommerce brands growing internationally.",
  openGraph: {
    title: "Lenava — AI Agents for Ecommerce Brands",
    description:
      "Stop losing revenue to unanswered messages, abandoned carts, and weak follow-ups. Lenava builds AI systems that run 24/7 in your brand's voice.",
    url: "https://lenava.io",
    siteName: "Lenava",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lenava — AI Agents for Ecommerce Brands",
    description:
      "AI agents and automation systems for independent ecommerce brands.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased font-sans">
        {children}
        {/* Plausible analytics — fires custom events via usePlausible() hook */}
        <Script
          defer
          data-domain="lenava.io"
          src="https://plausible.io/js/script.js"
        />
      </body>
    </html>
  );
}
