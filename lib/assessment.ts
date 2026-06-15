export interface ModuleScores {
  chatbot: number;
  automation: number;
}

export interface AssessmentResult {
  scores: ModuleScores;
  totalScore: number;
  highestLeak: keyof ModuleScores;
  scoreLabel: "High leak" | "Medium leak" | "Low leak" | "Minimal leak";
}

export function calculateResult(scores: ModuleScores): AssessmentResult {
  const totalScore = scores.chatbot + scores.automation;

  const highestLeak = (Object.entries(scores) as [keyof ModuleScores, number][]).reduce(
    (min, [key, val]) => (val < scores[min] ? key : min),
    "chatbot" as keyof ModuleScores
  );

  let scoreLabel: AssessmentResult["scoreLabel"];
  if (totalScore <= 40) scoreLabel = "High leak";
  else if (totalScore <= 65) scoreLabel = "Medium leak";
  else if (totalScore <= 85) scoreLabel = "Low leak";
  else scoreLabel = "Minimal leak";

  return { scores, totalScore, highestLeak, scoreLabel };
}

export const MODULE_NAMES: Record<keyof ModuleScores, string> = {
  chatbot: "AI Chatbot",
  automation: "Workflow Automation",
};

export const MODULE_MAX = 50;

export function getStatusBadge(score: number): string {
  if (score <= 20) return "Critical";
  if (score <= 34) return "Needs work";
  if (score <= 44) return "Good";
  return "Strong";
}

export const FINDING_COPY: Record<keyof ModuleScores, { high: string; medium: string; low: string }> = {
  chatbot: {
    high: "You're likely missing 20–40% of customer inquiries outside business hours. A 24/7 AI chatbot in your brand's voice would close this gap immediately and turn missed messages into sales.",
    medium: "Inconsistent response times — good during hours, gaps evenings and weekends. An AI chatbot handling after-hours queries captures the sales your team can't cover.",
    low: "Solid response rate. Minor gaps remain. Consider automating FAQ responses to free your team for complex queries.",
  },
  automation: {
    high: "No systematic cart recovery or post-purchase flow — most abandoned carts and repeat purchase opportunities are simply lost. Recovering even 10% of abandoned carts could add thousands in monthly revenue.",
    medium: "Some automation exists but it's incomplete. A full workflow covering cart recovery, post-purchase follow-up, and review requests would multiply your current results.",
    low: "Automation is working. Focus on optimizing timing, personalizing messages, and adding WhatsApp if not already running.",
  },
};

export const COST_COPY: Record<keyof ModuleScores, { high: string; medium: string; low: string }> = {
  chatbot: {
    high: "Every unanswered message is a potential sale lost. At 3+ hour response times, a significant portion of visitors are buying from whoever replied first.",
    medium: "Evening and weekend inquiries are converting at a fraction of daytime rates. You're leaving sales on the table every night.",
    low: "Minimal cost. The gap is in efficiency, not revenue loss.",
  },
  automation: {
    high: "With typical 70% cart abandonment and no recovery system, you're losing the majority of potential revenue before checkout — and going silent after every sale.",
    medium: "Incomplete automation means incomplete recovery. Every missed follow-up is a missed compounding revenue opportunity.",
    low: "Small gaps remain. Optimizing timing and personalization will drive marginal gains.",
  },
};

export const SERVICE_FOR_MODULE: Record<keyof ModuleScores, { name: string; path: string }> = {
  chatbot: { name: "AI Chatbot", path: "/#services" },
  automation: { name: "Workflow Automation", path: "/#services" },
};
