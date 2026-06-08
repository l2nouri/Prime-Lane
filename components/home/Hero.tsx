"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-canvas px-6">
      <div className="w-full max-w-[680px] mx-auto text-center">
        {/* Section label */}
        <p className="font-mono text-[11px] text-violet uppercase tracking-wider mb-6">
          Revenue Leak Assessment
        </p>

        {/* Headline */}
        <h1
          className="font-sans font-medium text-ink mb-5 leading-[1.08]"
          style={{ fontSize: "clamp(32px, 4.5vw, 52px)", letterSpacing: "-0.02em" }}
        >
          Your store is leaking revenue. Find out where.
        </h1>

        {/* Subline */}
        <p
          className="text-stone mb-10 mx-auto"
          style={{ fontSize: 18, lineHeight: 1.65, maxWidth: 520 }}
        >
          Take the 8-minute Revenue Leak Assessment.
          <br />
          Get a personalized score across 4 critical areas.
          <br />
          See exactly where customers are slipping through.
        </p>

        {/* CTA row */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
          <Link
            href="/assessment"
            className="inline-flex items-center px-6 py-3 bg-violet text-white text-[14px] font-medium rounded-[4px] hover:opacity-[0.88] transition-opacity duration-150"
          >
            Find my revenue leaks →
          </Link>
          <button
            onClick={() => {
              document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-9 h-9 rounded-full border border-stone/40 flex items-center justify-center text-stone hover:border-stone hover:text-ink transition-colors duration-150 animate-bounce"
            aria-label="Scroll to learn more"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.5 1.5v10M2 7l4.5 4.5L11 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Meta */}
        <p className="font-mono text-[11px] text-stone mb-16">
          Free · 8 minutes · No credit card
        </p>

      </div>
    </section>
  );
}
