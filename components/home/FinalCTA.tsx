"use client";

import Link from "next/link";
import { useReveal } from "@/lib/useReveal";

export default function FinalCTA() {
  const ref = useReveal();

  return (
    <section className="py-[120px] bg-canvas px-6">
      <div className="max-w-[600px] mx-auto text-center">
        <div ref={ref} className="reveal">
          <p className="font-mono text-[11px] text-stone uppercase tracking-wider mb-6">
            Ready to find your leaks?
          </p>
          <h2
            className="font-sans font-medium text-ink mb-5"
            style={{ fontSize: "clamp(28px, 4vw, 48px)", letterSpacing: "-0.01em", lineHeight: 1.12 }}
          >
            Take the free assessment. Fix your biggest leak first.
          </h2>
          <p className="text-[17px] text-stone mb-10 leading-relaxed">
            8 minutes. A personalized score across 4 critical areas. A clear recommendation — no
            fluff, no agency pitch. Just a starting point that makes sense for your store.
          </p>
          <Link
            href="/assessment"
            className="inline-flex items-center px-6 py-3 bg-violet text-white text-[14px] font-medium rounded-[4px] hover:opacity-[0.88] transition-opacity duration-150"
          >
            Find my revenue leaks →
          </Link>
          <p className="font-mono text-[11px] text-stone mt-4">
            Free · No credit card · Results in minutes
          </p>
        </div>
      </div>
    </section>
  );
}
