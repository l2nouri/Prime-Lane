"use client";

import { useReveal } from "@/lib/useReveal";

const services = [
  {
    num: "01",
    category: "Support",
    channel: "24/7 Website + WhatsApp",
    name: "AI Chatbot",
    description:
      "Customers ask questions at all hours — and without someone there, they buy elsewhere. A human-feeling AI agent handles product questions, sizing, shipping, returns, and order status around the clock in your brand's exact voice. Handles multiple languages and escalates to a human only when genuinely needed.",
    features: [
      "Faster response times",
      "Fewer lost sales",
      "Zero overnight gaps",
      "Brand voice & tone",
      "Multi-language",
      "Human escalation",
    ],
  },
  {
    num: "02",
    category: "Convert + Retain",
    channel: "Email + WhatsApp",
    name: "Workflow Automation",
    description:
      "Most brands lose revenue twice: in abandoned carts they never recover, and in customers they go silent with after the order. Personalized cart follow-ups mention the specific product, in your tone, at the right moment. Post-purchase sequences handle review requests, upsells, and loyalty follow-ups automatically.",
    features: [
      "Cart recovery",
      "Post-purchase sequences",
      "Upsell automation",
      "Review requests",
      "Loyalty follow-ups",
      "Revenue tracking",
    ],
  },
];

function ServiceCard({ service, delay }: { service: (typeof services)[0]; delay: number }) {
  const ref = useReveal(delay);
  return (
    <div
      ref={ref}
      className="reveal bg-canvas border border-whisper rounded-[8px] mb-4 last:mb-0"
      style={{ padding: "28px 32px" }}
    >
      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
        <div>
          <p className="font-mono text-[11px] text-violet uppercase tracking-wider mb-1">
            {service.num} — {service.category} · {service.channel}
          </p>
          <h3 className="font-sans font-medium text-ink text-[22px]">{service.name}</h3>
        </div>
      </div>

      <p className="text-[15px] text-stone leading-relaxed mb-5">{service.description}</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {service.features.map((f) => (
          <span
            key={f}
            className="font-mono text-[11px] text-stone bg-mist px-3 py-1.5 rounded-[4px]"
          >
            {f}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Services() {
  const headerRef = useReveal();

  return (
    <section id="services" className="pt-[120px] pb-[48px] bg-canvas px-6">
      <div className="max-w-[800px] mx-auto">
        <div ref={headerRef} className="reveal mb-10">
          <p className="font-mono text-[11px] text-stone uppercase tracking-wider mb-4">
            What we build
          </p>
          <h2
            className="font-sans font-medium text-ink mb-4"
            style={{ fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-0.01em", lineHeight: 1.12 }}
          >
            Two AI systems. One goal: more revenue, less manual work.
          </h2>
          <p className="text-[17px] text-stone" style={{ maxWidth: 560 }}>
            Each system is built specifically for your brand — your voice, your products, your
            customers. Not a template. Not a SaaS tool.
          </p>
        </div>

        {services.map((s, i) => (
          <ServiceCard key={s.num} service={s} delay={i * 80} />
        ))}
      </div>
    </section>
  );
}
