"use client";

import { useState } from "react";
import { useReveal } from "@/lib/useReveal";

const faqs = [
  {
    q: "Do I need to be technical to work with you?",
    a: "No. I handle everything technical. You provide context about your brand, products, and customers — I build the systems.",
  },
  {
    q: "How long does it take to build?",
    a: "Most systems are live within 7–14 days of project start. The assessment helps identify the right starting point.",
  },
  {
    q: "What platforms do you work with?",
    a: "Shopify, WooCommerce, and most major ecommerce platforms. I also integrate with Gmail, WhatsApp, Notion, Airtable, and others.",
  },
  {
    q: "Do I need to commit to a monthly retainer?",
    a: "No long-term commitment required for the first project. Pay the setup fee, see the system running, then decide.",
  },
  {
    q: "What makes this different from a Shopify app or Zapier?",
    a: "Every system is built for your specific brand, your voice, your products. A Shopify app gives you a template. This gives you a system that works like you wrote it yourself.",
  },
];

function FAQItem({ q, a, delay }: { q: string; a: string; delay: number }) {
  const [open, setOpen] = useState(false);
  const ref = useReveal(delay);

  return (
    <div ref={ref} className="reveal border-b border-whisper last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-5 text-left gap-4"
      >
        <span className="text-[16px] font-medium text-ink">{q}</span>
        <span
          className="flex-shrink-0 text-stone text-xl leading-none transition-transform duration-200"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          +
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-200 ease-out"
        style={{ maxHeight: open ? 200 : 0 }}
      >
        <p className="text-[15px] text-stone leading-relaxed pb-5">{a}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const headerRef = useReveal();

  return (
    <section
      className="py-[100px] px-6"
      style={{ backgroundColor: "var(--color-mist)" }}
    >
      <div className="max-w-[680px] mx-auto">
        <div ref={headerRef} className="reveal mb-8">
          <p className="font-mono text-[11px] text-stone uppercase tracking-wider mb-4">
            Common questions
          </p>
          <h2
            className="font-sans font-medium text-ink"
            style={{ fontSize: "clamp(28px, 4vw, 48px)", letterSpacing: "-0.01em" }}
          >
            Answers.
          </h2>
        </div>

        <div className="border-t border-whisper">
          {faqs.map((f, i) => (
            <FAQItem key={i} {...f} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}
