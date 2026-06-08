"use client";

import { useReveal } from "@/lib/useReveal";

// Replace these with real testimonials when available
const testimonials = [
  {
    quote:
      "The customer support agent handles 80% of our inquiries automatically — in perfect Italian and English. Our response time went from 12 hours to under 2 minutes.",
    name: "Founder, Italian skincare brand",
    detail: "Milan · Beauty · €400k revenue",
  },
  {
    quote:
      "We recovered 23 abandoned carts in the first month. That's revenue we were simply leaving on the table every week.",
    name: "Co-founder, fashion accessories brand",
    detail: "Florence · Fashion · €280k revenue",
  },
];

function TestimonialCard({ quote, name, detail, delay }: { quote: string; name: string; detail: string; delay: number }) {
  const ref = useReveal(delay);
  return (
    <div
      ref={ref}
      className="reveal bg-canvas border border-whisper rounded-[8px] p-7"
    >
      <p
        className="text-graphite italic mb-5"
        style={{ fontSize: 17, lineHeight: 1.75 }}
      >
        &ldquo;{quote}&rdquo;
      </p>
      <div>
        <p className="text-[13px] font-medium text-ink">{name}</p>
        <p className="font-mono text-[11px] text-stone mt-1">{detail}</p>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const headerRef = useReveal();
  const noteRef = useReveal(300);

  return (
    <section className="py-[100px] bg-canvas px-6">
      <div className="max-w-[900px] mx-auto">
        <div ref={headerRef} className="reveal mb-10">
          <p className="font-mono text-[11px] text-stone uppercase tracking-wider mb-4">
            What clients say
          </p>
          <h2
            className="font-sans font-medium text-ink"
            style={{ fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-0.01em" }}
          >
            Real results from real brands.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} {...t} delay={i * 100} />
          ))}
        </div>

        <div ref={noteRef} className="reveal mt-10 text-center">
          <p className="font-mono text-[11px] text-stone">
            Results vary. These represent typical outcomes for brands
            <br />
            with similar revenue and automation maturity.
          </p>
        </div>
      </div>
    </section>
  );
}
