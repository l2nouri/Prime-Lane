export interface AnswerRecord {
  questionId: number;
  questionText: string;
  answerLabel: string;
  points: number;
  maxPoints: number;
}

// Specific insight per question × answer label
const INSIGHT_MAP: Record<number, Record<string, string>> = {
  1: {
    "Within 1 hour": "Fast response time is a competitive advantage — you're already capturing buyers before they move on.",
    "Same business day": "Same-day replies are solid, but evenings and weekends go uncovered. An AI chatbot would ensure no inquiry waits more than 60 seconds.",
    "1–3 days": "A 1–3 day response window means most prospects have already purchased from a faster competitor. Instant AI response could recapture that revenue.",
    "We often miss messages": "Missed messages are missed sales. With no system in place, you're handing customers to competitors by default.",
  },
  2: {
    "Email + WhatsApp + chat": "Multi-channel presence is excellent — customers can reach you wherever they prefer.",
    "Email + one other": "You're active on two channels, but buyers on the third are falling through entirely — often the highest-intent ones.",
    "Email only": "Email-only support means you're invisible on WhatsApp and chat, where many customers prefer quick questions before buying.",
    "We don't track this": "Without knowing which channels your customers use, you're optimising blind — and almost certainly missing high-intent buyers.",
  },
  3: {
    "Under 5%": "Very low missed inquiry rate — you're capturing nearly everyone who reaches out.",
    "5–15%": "At 5–15% missed inquiries, a meaningful share of your potential buyers are going unanswered — and moving on.",
    "Over 15%": "Over 15% unanswered means you're systematically losing potential sales before a conversation even starts.",
    "I don't know": "Not knowing your unanswered rate means you can't measure the revenue walking out the door — the actual number is likely significant.",
  },
  4: {
    "Yes — fully automated and branded": "A branded, fully automated chatbot is working for you around the clock — that's a real revenue asset.",
    "Yes — basic FAQ bot": "A basic FAQ bot is a start, but it won't qualify leads, recover abandoners, or handle complex queries — leaving money on the table.",
    "No but planning to": "You recognise the opportunity. A properly configured AI chatbot would immediately handle after-hours traffic and reduce pressure on your team.",
    "No and not considered": "Without a chatbot, every customer question needs a human — a costly, unscalable bottleneck that limits growth.",
  },
  5: {
    "Yes — email + WhatsApp, multi-step": "Multi-channel, multi-step cart recovery is your strongest revenue lever — you're already using it well.",
    "Yes — email only": "Email-only cart recovery captures some abandoners, but adding a WhatsApp step typically lifts recovery rates by 20–40%.",
    "Basic default only": "Default cart emails are easy to ignore. A custom sequence with your brand voice and a clear incentive converts significantly more abandoned carts.",
    "Nothing set up": "With no cart recovery, you're losing 70%+ of abandoned carts permanently. Even a simple 2-step sequence can recover thousands per month.",
  },
  6: {
    "Review request + upsell + check-in": "Your post-purchase automation is maximising customer lifetime value — review requests, upsells, and check-ins compound over time.",
    "Review request only": "You're collecting reviews but missing the upsell window. A cross-sell sequence 3–5 days after purchase can meaningfully boost average order value.",
    "Just order confirmation": "Order confirmation alone leaves the entire post-purchase relationship untapped — no social proof, no upsells, no loyalty building.",
    "Nothing automated": "Going silent after every sale is a compounding revenue loss: no reviews, no repeat purchases, no referrals.",
  },
  7: {
    "Product-specific and fully branded": "Personalised, branded messages drive engagement and conversion — customers notice when communication feels tailored.",
    "Generic but branded": "Branded messages are good. Adding product-specific personalisation will push click-through and conversion rates higher with minimal extra work.",
    "Generic template": "Generic templates feel impersonal and low-effort — easy to ignore. Personalisation signals that you know the customer and their purchase.",
    "No automated messages": "Without automated messages, every follow-up depends on someone remembering to send it. Most don't, and revenue opportunities slip away.",
  },
  8: {
    "Automated flow with escalation": "Automated returns handling with escalation protects customer satisfaction at scale — and reduces team burnout.",
    "Manual but fast under 24hrs": "Fast manual handling is good service, but automation would let you maintain that quality even during volume spikes.",
    "Manual and slow": "Slow returns handling erodes trust and increases churn — and unhappy customers share their experience faster than satisfied ones do.",
    "No clear process": "No clear returns or complaints process means every case is resolved differently, creating inconsistency that directly impacts repeat purchase rate and reviews.",
  },
};

export function getTopInsights(answers: AnswerRecord[]): string[] {
  const sorted = [...answers]
    .map((a) => ({ ...a, gap: a.maxPoints - a.points }))
    .filter((a) => a.gap > 0)
    .sort((a, b) => b.gap - a.gap);

  const top3 = sorted.slice(0, 3);

  return top3.map((a) => {
    return INSIGHT_MAP[a.questionId]?.[a.answerLabel]
      ?? `Your answer on "${a.questionText}" suggests room to improve here.`;
  });
}
