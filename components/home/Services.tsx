"use client";

import { useReveal } from "@/lib/useReveal";

const services = [
  {
    num: "01",
    category: "Support",
    channel: "24/7 Website + WhatsApp",
    name: "AI Chatbot",
    icon: ChatIcon,
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
    icon: WorkflowIcon,
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

function ChatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 5.5h16a1 1 0 0 1 1 1V15a1 1 0 0 1-1 1H9l-4.5 3.5V16H4a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WorkflowIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="5" cy="6" r="2.25" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="5" cy="18" r="2.25" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="18" cy="12" r="2.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7.2 6.9 15.8 11M7.2 17.1 15.8 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TypingIndicator() {
  return (
    <span className="typing-indicator" aria-hidden="true">
      <span className="typing-dot typing-dot-1" />
      <span className="typing-dot typing-dot-2" />
      <span className="typing-dot typing-dot-3" />
    </span>
  );
}

function WorkflowStepSequence() {
  return (
    <span className="workflow-steps" aria-hidden="true">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="workflow-step workflow-step-cart">
        <path
          d="M3 3h2l2.4 12.2a1.5 1.5 0 0 0 1.5 1.3h8.4a1.5 1.5 0 0 0 1.5-1.2L20 8H6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="workflow-step workflow-step-arrow">
        <path d="M4 12h14m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="workflow-step workflow-step-check">
        <path d="M4 12.5 9.5 18 20 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function ServiceCard({ service, delay }: { service: (typeof services)[0]; delay: number }) {
  const ref = useReveal(delay);
  const Icon = service.icon;
  return (
    <div
      ref={ref}
      className="reveal service-card bg-canvas border border-whisper rounded-[8px] mb-4 last:mb-0"
      style={{ padding: "28px 32px" }}
    >
      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
        <div>
          <p className="font-mono text-[11px] text-violet uppercase tracking-wider mb-1">
            {service.num} — {service.category} · {service.channel}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-violet/70">
              <Icon />
            </span>
            <h3 className="font-sans font-medium text-ink text-[22px]">{service.name}</h3>
            {service.num === "01" ? <TypingIndicator /> : <WorkflowStepSequence />}
          </div>
        </div>
      </div>

      <p className="text-[15px] text-stone leading-relaxed mb-5">{service.description}</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {service.features.map((f) => (
          <span
            key={f}
            className="font-mono text-[11px] text-stone bg-glow px-3 py-1.5 rounded-[4px]"
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
