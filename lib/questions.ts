import type { ModuleScores } from "./assessment";

export interface AnswerOption {
  label: string;
  points: number;
}

export interface Question {
  id: number;
  module: keyof ModuleScores;
  moduleName: string;
  moduleTotal: number;
  text: string;
  options: AnswerOption[];
}

export const QUESTIONS: Question[] = [
  // Module 1 — Customer Response (25 pts)
  {
    id: 1,
    module: "response",
    moduleName: "Customer Response",
    moduleTotal: 25,
    text: "How quickly do you typically respond to customer messages?",
    options: [
      { label: "Within 1 hour", points: 10 },
      { label: "Same business day", points: 6 },
      { label: "1–3 days", points: 3 },
      { label: "We often miss messages", points: 0 },
    ],
  },
  {
    id: 2,
    module: "response",
    moduleName: "Customer Response",
    moduleTotal: 25,
    text: "Which channels do customers contact you on?",
    options: [
      { label: "Email + WhatsApp + chat", points: 10 },
      { label: "Email + one other", points: 7 },
      { label: "Email only", points: 4 },
      { label: "We don't track this", points: 2 },
    ],
  },
  {
    id: 3,
    module: "response",
    moduleName: "Customer Response",
    moduleTotal: 25,
    text: "What percentage of inquiries go unanswered within 24 hours?",
    options: [
      { label: "Under 5%", points: 5 },
      { label: "5–15%", points: 3 },
      { label: "Over 15% / I don't know", points: 0 },
    ],
  },

  // Module 2 — Cart Recovery (25 pts)
  {
    id: 4,
    module: "recovery",
    moduleName: "Cart Recovery",
    moduleTotal: 25,
    text: "Do you currently have an abandoned cart recovery sequence?",
    options: [
      { label: "Yes — email + WhatsApp", points: 10 },
      { label: "Yes — email only", points: 6 },
      { label: "Basic Shopify default", points: 3 },
      { label: "Nothing / not sure", points: 0 },
    ],
  },
  {
    id: 5,
    module: "recovery",
    moduleName: "Cart Recovery",
    moduleTotal: 25,
    text: "How many follow-up messages does your cart sequence have?",
    options: [
      { label: "3 or more", points: 10 },
      { label: "2 messages", points: 6 },
      { label: "1 message", points: 3 },
      { label: "None", points: 0 },
    ],
  },
  {
    id: 6,
    module: "recovery",
    moduleName: "Cart Recovery",
    moduleTotal: 25,
    text: "How personalized are your cart recovery messages?",
    options: [
      { label: "Product-specific + personalized", points: 5 },
      { label: "Generic but branded", points: 3 },
      { label: "Generic template", points: 1 },
      { label: "No messages", points: 0 },
    ],
  },

  // Module 3 — Post-Purchase (25 pts)
  {
    id: 7,
    module: "retention",
    moduleName: "Post-Purchase",
    moduleTotal: 25,
    text: "What happens automatically after someone makes a purchase?",
    options: [
      { label: "Review request + upsell + check-in", points: 10 },
      { label: "Review request only", points: 6 },
      { label: "Just order confirmation", points: 2 },
      { label: "Nothing automated", points: 0 },
    ],
  },
  {
    id: 8,
    module: "retention",
    moduleName: "Post-Purchase",
    moduleTotal: 25,
    text: "Do you have a system for requesting reviews at the right moment?",
    options: [
      { label: "Yes — timed after delivery", points: 10 },
      { label: "Yes — but generic timing", points: 5 },
      { label: "Sometimes manually", points: 2 },
      { label: "No review system", points: 0 },
    ],
  },
  {
    id: 9,
    module: "retention",
    moduleName: "Post-Purchase",
    moduleTotal: 25,
    text: "How do you handle returns and complaints?",
    options: [
      { label: "Automated + escalation path", points: 5 },
      { label: "Manual but fast (<24hrs)", points: 3 },
      { label: "Manual and slow", points: 1 },
      { label: "No clear process", points: 0 },
    ],
  },

  // Module 4 — Customer Acquisition (25 pts)
  {
    id: 10,
    module: "acquisition",
    moduleName: "Customer Acquisition",
    moduleTotal: 25,
    text: "Beyond paid ads, how do you find new customers?",
    options: [
      { label: "Systematic outreach + referrals", points: 10 },
      { label: "Some organic content", points: 5 },
      { label: "Mostly word of mouth", points: 3 },
      { label: "Only paid ads", points: 0 },
    ],
  },
  {
    id: 11,
    module: "acquisition",
    moduleName: "Customer Acquisition",
    moduleTotal: 25,
    text: "Do you have an influencer or partnership outreach system?",
    options: [
      { label: "Yes — automated pipeline", points: 10 },
      { label: "Manual but consistent", points: 6 },
      { label: "Occasionally reach out", points: 2 },
      { label: "No influencer strategy", points: 0 },
    ],
  },
  {
    id: 12,
    module: "acquisition",
    moduleName: "Customer Acquisition",
    moduleTotal: 25,
    text: "How do you follow up with leads who showed interest but didn't buy?",
    options: [
      { label: "Automated multi-step sequence", points: 5 },
      { label: "One follow-up email", points: 3 },
      { label: "Manually sometimes", points: 1 },
      { label: "No follow-up process", points: 0 },
    ],
  },
];

export const MODULES = [
  { key: "response" as keyof ModuleScores, name: "Customer Response", questions: [1, 2, 3] },
  { key: "recovery" as keyof ModuleScores, name: "Cart Recovery", questions: [4, 5, 6] },
  { key: "retention" as keyof ModuleScores, name: "Post-Purchase", questions: [7, 8, 9] },
  { key: "acquisition" as keyof ModuleScores, name: "Customer Acquisition", questions: [10, 11, 12] },
];
