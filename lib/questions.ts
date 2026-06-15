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
  // Module 1 — AI Chatbot (50 pts)
  {
    id: 1,
    module: "chatbot",
    moduleName: "AI Chatbot",
    moduleTotal: 50,
    text: "How quickly do you typically respond to customer messages?",
    options: [
      { label: "Within 1 hour", points: 15 },
      { label: "Same business day", points: 9 },
      { label: "1–3 days", points: 4 },
      { label: "We often miss messages", points: 0 },
    ],
  },
  {
    id: 2,
    module: "chatbot",
    moduleName: "AI Chatbot",
    moduleTotal: 50,
    text: "Which channels do customers contact you on?",
    options: [
      { label: "Email + WhatsApp + chat", points: 15 },
      { label: "Email + one other", points: 10 },
      { label: "Email only", points: 5 },
      { label: "We don't track this", points: 2 },
    ],
  },
  {
    id: 3,
    module: "chatbot",
    moduleName: "AI Chatbot",
    moduleTotal: 50,
    text: "What percentage of inquiries go unanswered within 24 hours?",
    options: [
      { label: "Under 5%", points: 10 },
      { label: "5–15%", points: 5 },
      { label: "Over 15%", points: 2 },
      { label: "I don't know", points: 0 },
    ],
  },
  {
    id: 4,
    module: "chatbot",
    moduleName: "AI Chatbot",
    moduleTotal: 50,
    text: "Do you currently have a chatbot or AI assistant on your website?",
    options: [
      { label: "Yes — fully automated and branded", points: 10 },
      { label: "Yes — basic FAQ bot", points: 6 },
      { label: "No but planning to", points: 2 },
      { label: "No and not considered", points: 0 },
    ],
  },

  // Module 2 — Workflow Automation (50 pts)
  {
    id: 5,
    module: "automation",
    moduleName: "Workflow Automation",
    moduleTotal: 50,
    text: "Do you currently have an abandoned cart recovery sequence?",
    options: [
      { label: "Yes — email + WhatsApp, multi-step", points: 15 },
      { label: "Yes — email only", points: 9 },
      { label: "Basic default only", points: 4 },
      { label: "Nothing set up", points: 0 },
    ],
  },
  {
    id: 6,
    module: "automation",
    moduleName: "Workflow Automation",
    moduleTotal: 50,
    text: "What happens automatically after someone makes a purchase?",
    options: [
      { label: "Review request + upsell + check-in", points: 15 },
      { label: "Review request only", points: 9 },
      { label: "Just order confirmation", points: 3 },
      { label: "Nothing automated", points: 0 },
    ],
  },
  {
    id: 7,
    module: "automation",
    moduleName: "Workflow Automation",
    moduleTotal: 50,
    text: "How personalized are your automated messages to customers?",
    options: [
      { label: "Product-specific and fully branded", points: 10 },
      { label: "Generic but branded", points: 6 },
      { label: "Generic template", points: 2 },
      { label: "No automated messages", points: 0 },
    ],
  },
  {
    id: 8,
    module: "automation",
    moduleName: "Workflow Automation",
    moduleTotal: 50,
    text: "How do you handle returns and complaints?",
    options: [
      { label: "Automated flow with escalation", points: 10 },
      { label: "Manual but fast under 24hrs", points: 6 },
      { label: "Manual and slow", points: 2 },
      { label: "No clear process", points: 0 },
    ],
  },
];

export const MODULES = [
  { key: "chatbot" as keyof ModuleScores, name: "AI Chatbot", questions: [1, 2, 3, 4] },
  { key: "automation" as keyof ModuleScores, name: "Workflow Automation", questions: [5, 6, 7, 8] },
];
