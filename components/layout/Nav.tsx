"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "How it works", href: "#how-it-works" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "/contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-canvas"
        style={{
          height: 64,
          borderBottom: scrolled
            ? "0.5px solid var(--color-whisper)"
            : "0.5px solid transparent",
          transition: "border-color 200ms ease",
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 no-underline">
<div className="flex flex-col items-start leading-none gap-[8px]">
              <span className="font-sans font-medium text-ink tracking-widest uppercase text-[14px]">
                Prime Lane
              </span>
              <span className="font-sans text-[9px] text-stone tracking-[0.14em]">
                Built to be found.
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className="text-[14px] text-stone hover:text-ink transition-colors duration-150"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden flex flex-col gap-[5px] p-2"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <span className="w-5 h-px bg-ink block" />
            <span className="w-5 h-px bg-ink block" />
            <span className="w-5 h-px bg-ink block" />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col px-6 py-8">
          <div className="flex justify-between items-center mb-12">
            <Link href="/" className="flex items-center gap-3 no-underline" onClick={() => setMenuOpen(false)}>
              <svg
                width="24"
                height="16"
                viewBox="0 0 24 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-ink flex-shrink-0"
              >
                <line x1="1" y1="13" x2="12" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="4" y1="8" x2="18" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="7" y1="3" x2="23" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <div className="flex flex-col items-start leading-none gap-[8px]">
                <span className="font-sans font-medium text-ink tracking-widest uppercase text-[14px]">
                  Prime Lane
                </span>
                <span className="font-sans text-[9px] text-stone tracking-[0.14em] uppercase">
                  Built to be found.
                </span>
              </div>
            </Link>
            <button
              onClick={() => setMenuOpen(false)}
              className="text-stone text-2xl leading-none"
              aria-label="Close menu"
            >
              ×
            </button>
          </div>

          <div className="flex flex-col gap-8 flex-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className="text-[28px] font-medium text-ink"
              >
                {link.label}
              </a>
            ))}
          </div>

          <Link
            href="/assessment"
            onClick={() => setMenuOpen(false)}
            className="w-full text-center py-4 bg-violet text-white text-[14px] font-medium rounded-[4px] hover:opacity-[0.88] transition-opacity duration-150"
          >
            Take the assessment →
          </Link>
        </div>
      )}
    </>
  );
}
