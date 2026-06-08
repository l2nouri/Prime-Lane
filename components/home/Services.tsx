"use client";

import { useReveal } from "@/lib/useReveal";

const services = [
  {
    num: "01",
    category: "Support",
    channel: "24/7 Website + WhatsApp",
    name: "Customer Support Agent",
    description:
      "A human-feeling AI agent that answers customer questions around the clock — product info, sizing, shipping, returns, order status — in your brand's own voice. Handles multiple languages. Escalates to a human only when genuinely needed.",
    features: [
      "Website chat widget",
      "WhatsApp integration",
      "Brand voice & tone",
      "Multi-language",
      "FAQ knowledge base",
      "Human escalation",
    ],
    setup: "€900",
    monthly: "€450–550",
  },
  {
    num: "02",
    category: "Convert",
    channel: "Email + WhatsApp",
    name: "Abandoned Cart Recovery",
    description:
      "An AI-powered recovery system that detects abandoned carts and sends personalized follow-up messages — mentioning the specific product, in your tone, at the right moment. Not a generic reminder. A message that feels like it came from you personally.",
    features: [
      "Cart detection",
      "Personalized email",
      "WhatsApp follow-up",
      "Product-specific copy",
      "Multi-step timing",
      "Revenue tracking",
    ],
    setup: "€800",
    monthly: "€380–480",
  },
  {
    num: "03",
    category: "Retain",
    channel: "Post-Purchase Loyalty",
    name: "Post-Purchase Nurture",
    description:
      "An automated post-purchase system that builds loyalty and drives repeat sales. Review requests at the perfect moment, complementary product suggestions, return handling, and keep-warm sequences between purchases — all automatic.",
    features: [
      "Review automation",
      "Upsell sequences",
      "Return handling",
      "Loyalty follow-ups",
      "Repeat triggers",
      "Satisfaction check",
    ],
    setup: "€1,000",
    monthly: "€480–580",
  },
  {
    num: "04",
    category: "Acquire",
    channel: "Outreach + Pipeline",
    name: "Customer Acquisition System",
    description:
      "An AI-powered outreach system that identifies potential customers and micro-influencers, personalizes every message, follows up automatically, and manages the entire pipeline from first contact to conversion.",
    features: [
      "Prospect identification",
      "AI personalization",
      "Influencer outreach",
      "Follow-up sequences",
      "Lead qualification",
      "Pipeline management",
    ],
    setup: "€1,400",
    monthly: "€600–700",
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

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-5">
        {service.features.map((f) => (
          <span
            key={f}
            className="font-mono text-[11px] text-stone bg-mist px-3 py-1.5 rounded-[4px]"
          >
            {f}
          </span>
        ))}
      </div>

      <div className="flex gap-3">
        <span className="font-mono text-[12px] font-medium text-canvas bg-ink px-3 py-1.5 rounded-[4px]">
          Setup {service.setup}
        </span>
        <span className="font-mono text-[12px] font-medium text-canvas bg-violet px-3 py-1.5 rounded-[4px]">
          Monthly {service.monthly}
        </span>
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
            Four AI systems. One goal: more revenue, less manual work.
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
