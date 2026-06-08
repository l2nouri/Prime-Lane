export interface ModuleScores {
  response: number;
  recovery: number;
  retention: number;
  acquisition: number;
}

export interface AssessmentResult {
  scores: ModuleScores;
  totalScore: number;
  highestLeak: keyof ModuleScores;
  scoreLabel: "High leak" | "Medium leak" | "Low leak" | "Minimal leak";
}

export function calculateResult(scores: ModuleScores): AssessmentResult {
  const totalScore = scores.response + scores.recovery + scores.retention + scores.acquisition;

  const highestLeak = (Object.entries(scores) as [keyof ModuleScores, number][]).reduce(
    (min, [key, val]) => (val < scores[min] ? key : min),
    "response" as keyof ModuleScores
  );

  let scoreLabel: AssessmentResult["scoreLabel"];
  if (totalScore <= 40) scoreLabel = "High leak";
  else if (totalScore <= 65) scoreLabel = "Medium leak";
  else if (totalScore <= 85) scoreLabel = "Low leak";
  else scoreLabel = "Minimal leak";

  return { scores, totalScore, highestLeak, scoreLabel };
}

export const MODULE_NAMES: Record<keyof ModuleScores, string> = {
  response: "Customer Response",
  recovery: "Cart Recovery",
  retention: "Post-Purchase",
  acquisition: "Customer Acquisition",
};

export const MODULE_MAX = 25;

export function getStatusBadge(score: number): string {
  if (score <= 10) return "Critical";
  if (score <= 17) return "Needs work";
  if (score <= 22) return "Good";
  return "Strong";
}

export const FINDING_COPY: Record<keyof ModuleScores, { high: string; medium: string; low: string }> = {
  response: {
    high: "You're likely missing 20–40% of customer inquiries outside business hours. A 24/7 AI support agent in your brand's voice would close this gap immediately.",
    medium: "Inconsistent response times — good during hours, gaps evenings/weekends. An agent handling after-hours queries captures the sales your team can't cover.",
    low: "Solid response rate. Minor gaps remain. Consider automating FAQ responses to free your team for complex queries.",
  },
  recovery: {
    high: "No systematic cart recovery — most abandoned carts are simply lost. Recovering even 10% could add €3,000–15,000/month in revenue.",
    medium: "Recovery exists but likely single-touch and generic. A 3-step personalized sequence recovers 2–3× more than one generic reminder.",
    low: "Cart recovery is working. A/B test timing and add WhatsApp if not running.",
  },
  retention: {
    high: "Silence after purchase kills repeat purchase rate. A post-purchase nurture sequence adds reviews, drives upsells, and turns one-time buyers into loyal customers.",
    medium: "Basic post-purchase flow exists but gaps remain. Review timing, upsell sequences, and return handling can all be improved.",
    low: "Post-purchase flow is solid. Focus on optimizing upsell sequencing and review timing for marginal gains.",
  },
  acquisition: {
    high: "No systematic outreach means you're fully dependent on paid ads. One algorithm change can cut your pipeline in half. A systematic acquisition system fixes this.",
    medium: "Some outreach exists but it's inconsistent. An automated pipeline for prospects and micro-influencers would multiply current results.",
    low: "Acquisition is working. Automate and scale what's already converting.",
  },
};

export const COST_COPY: Record<keyof ModuleScores, { high: string; medium: string; low: string }> = {
  response: {
    high: "Every unanswered message is a potential sale lost. At 3+ hour response times, a significant portion of visitors are buying from whoever replied first.",
    medium: "Evening and weekend inquiries are converting at a fraction of daytime rates. You're leaving sales on the table every night.",
    low: "Minimal cost. The gap is in efficiency, not revenue loss.",
  },
  recovery: {
    high: "With typical 70% cart abandonment and no recovery, you're losing the majority of potential revenue before checkout.",
    medium: "A single-touch sequence recovers a fraction of what a multi-step personalized flow would. The gap compounds monthly.",
    low: "Recovery is strong. Incremental gains available.",
  },
  retention: {
    high: "A one-time buyer staying a one-time buyer is a silent revenue killer. Repeat customers spend 2–3× more than first-time buyers.",
    medium: "You're leaving repeat purchases and reviews on the table. Each missed follow-up is a missed compounding revenue opportunity.",
    low: "Small gaps in loyalty sequences. Minimal immediate cost.",
  },
  acquisition: {
    high: "100% dependence on paid ads is expensive and fragile. A systematic outreach engine pays for itself once running.",
    medium: "Inconsistent outreach means inconsistent pipeline. Revenue becomes unpredictable when acquisition is manual.",
    low: "Acquisition cost is low. Optimizing what works is the next step.",
  },
};

export const SERVICE_FOR_MODULE: Record<keyof ModuleScores, { name: string; path: string }> = {
  response: { name: "Customer Support Agent", path: "/#services" },
  recovery: { name: "Abandoned Cart Recovery", path: "/#services" },
  retention: { name: "Post-Purchase Nurture", path: "/#services" },
  acquisition: { name: "Customer Acquisition System", path: "/#services" },
};
