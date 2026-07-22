"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-canvas px-6 overflow-hidden">
      <div className="hero-glow" aria-hidden="true" />
      <div className="relative w-full max-w-[680px] mx-auto text-center">
        {/* Section label */}
        <p className="hero-fade-up hero-fade-up-1 font-mono text-[11px] text-violet uppercase tracking-wider mb-6">
          Revenue Leak Assessment
        </p>

        {/* Headline */}
        <h1
          className="font-sans font-medium text-ink mb-5 leading-[1.08]"
          style={{ fontSize: "clamp(32px, 4.5vw, 52px)", letterSpacing: "-0.02em" }}
        >
          <span className="hero-fade-up hero-headline-line-1 block">
            Your store is{" "}
            <span className="hero-headline-accent">leaking revenue</span>.
          </span>
          <span className="hero-fade-up hero-headline-line-2 block">Find out where.</span>
        </h1>

        {/* Subline */}
        <p
          className="hero-fade-up hero-fade-up-3 text-stone mb-10 mx-auto"
          style={{ fontSize: 18, lineHeight: 1.65, maxWidth: 520 }}
        >
          Take the 8-minute Revenue Leak Assessment.
          <br />
          Get a personalized score across both critical areas.
          <br />
          See exactly where customers are slipping through.
        </p>

        {/* CTA row */}
        <div className="hero-fade-up hero-fade-up-4 flex flex-wrap items-center justify-center gap-4 mb-4">
          <Link
            href="/assessment"
            className="inline-flex items-center px-6 py-3 bg-violet text-white text-[14px] font-medium rounded-[4px] shadow-none hover:opacity-[0.88] hover:scale-[1.025] hover:shadow-[0_8px_20px_-6px_rgba(124,58,237,0.45)] transition-[opacity,transform,box-shadow] duration-150 motion-reduce:transition-none motion-reduce:hover:scale-100"
          >
            Take the Free Revenue Leak Assessment →
          </Link>
          <button
            onClick={() => {
              document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="scroll-cue w-9 h-9 rounded-full border border-stone/40 flex items-center justify-center text-stone hover:border-stone hover:text-ink transition-colors duration-150"
            aria-label="Scroll to learn more"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.5 1.5v10M2 7l4.5 4.5L11 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Meta */}
        <p className="hero-fade-up hero-fade-up-5 font-mono text-[11px] text-stone mb-16">
          Free · 8 minutes · No credit card
        </p>

      </div>
    </section>
  );
}
