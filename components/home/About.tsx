"use client";

import { useReveal } from "@/lib/useReveal";

export default function About() {
  const ref = useReveal();

  return (
    <section id="about" className="py-[120px] px-6" style={{ backgroundColor: "var(--color-mist)" }}>
      <div className="max-w-[680px] mx-auto">
        <div ref={ref} className="reveal">
          <p className="font-mono text-[11px] text-stone uppercase tracking-wider mb-6">
            About Prime Lane
          </p>
          <p
            className="font-sans font-medium text-ink mb-8"
            style={{ fontSize: "clamp(24px, 3vw, 36px)", letterSpacing: "-0.01em", lineHeight: 1.2 }}
          >
            Built for brands that are great at their product — but losing revenue to systems that
            aren&apos;t working.
          </p>
          <div className="space-y-5 text-[17px] text-graphite" style={{ lineHeight: 1.7 }}>
            <p>
              Prime Lane builds AI agents and automation systems for independent ecommerce brands. We
              work with brands that are great at their product — but losing revenue to slow response
              times, abandoned carts, and one-time buyers who never come back.
            </p>
            <p>
              Based in Milan. Focused on Italian brands growing internationally, and independent
              ecommerce brands across Europe.
            </p>
            <p>
              We don&apos;t do retainers before results. Every project starts with a free Revenue Leak
              Assessment. We identify your highest-impact system, build it, and let the results speak.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
