# Lenava.io — Website Evaluation Results

**Scope:** Current site with chatbot. SaaS (Market Watch) not yet integrated — excluded from this audit.
**Stack:** Next.js 14, Supabase, Vercel, Plausible, Cal.com, Chatbot widget.
**Audit type:** Read-only. Nothing was modified.

---

## 1. Conversion & Lead Capture

| ID | Status | Notes |
|---|---|---|
| 1.1 | ⚠️ | New scanner flow (`components/scan/ScanWidget.tsx`, `app/scan/[scanId]/page.tsx`) works end-to-end per `REVENUE-LEAK-SCANNER.md`. But the old questionnaire flow (`app/assessment/page.tsx`, `app/report/page.tsx`) is still fully live and orphaned — not linked from Nav/Hero/CTAs — a duplicate, confusing flow. |
| 1.2 | ✅ | Both scoring systems compute real results from actual answers: `lib/scan/score.ts:150-176` and `lib/assessment.ts:13-28`. Insight bullets from `lib/insights.ts:61-73`. |
| 1.3 | ⚠️/❌ | New scan flow gate is server-enforced (`lib/scan/gate.ts:33-41`), cannot be bypassed. **Old `/report` page (`app/report/page.tsx:16-62`) has no gate at all** — renders the full report straight from a `?scores=` URL param, fully bypassable via direct link/bookmark. |
| 1.4 | ⚠️ | New scan gate refreshes in place to reveal the report; a "Get in touch" CTA appears (→ `/contact`, not Cal.com directly). Old flow's `BookingCTA` (Cal.com) only renders if `NEXT_PUBLIC_BOOKING_URL` is set — silently disappears otherwise. |
| 1.5 | ✅ | Single consistent CTA ("Scan my store →") across `Hero.tsx:36`, `AssessmentCTA.tsx:33-38`, `FinalCTA.tsx:26-31`, `Nav.tsx:132-138`. |
| 1.6 | ✅/⚠️ | New flow (`app/api/scan/route.ts:104-125`, `app/api/scan/lead/route.ts:49-61`) checks insert errors properly. Old flow (`app/api/generate-report/route.ts:135-155`) silently swallows Supabase errors — returns `success:true` even on failed insert. |

## 2. Chatbot Quality

| ID | Status | Notes |
|---|---|---|
| 2.1 | ✅ | `app/api/chat/route.ts:190-191` — on-brand, direct opening line. |
| 2.2 | ✅ | Explicit off-topic redirect + jailbreak protection, `app/api/chat/route.ts:328-354`. |
| 2.3 | ✅ | Lead capture flow + `capture_lead` tool, `app/api/chat/route.ts:268-292, 386-440`. |
| 2.4 | ✅ | Tightly scoped system prompt + RAG context injection, `app/api/chat/route.ts:161-167, 380`. |
| 2.5 | ✅ | Fallback with next-step suggestion, `app/api/chat/route.ts:336-338`; thumbs up/down feedback wired end-to-end (`app/chat/page.tsx:208-219` → `app/api/feedback/route.ts`). |

## 3. Technical Reliability

| ID | Status | Notes |
|---|---|---|
| 3.1 | ⚠️ | 8 events found (Assessment/Scan/Gate/Contact lifecycle) but the spec'd **booking-click event is missing** — `BookingCTA.tsx` has no click tracking on its Cal.com links. |
| 3.2 | ✅ | Responsive breakpoints and max-width (not fixed-width) containers throughout scan/assessment/report components. |
| 3.3 | ✅ | Hero is text-only, no LCP image risk; widget script loads `afterInteractive`. |
| 3.4 | ⚠️ | Scan result page is server-rendered (good); old `/report` computes client-side inside a bare `<Suspense>` with no loading UI. |
| 3.5 | ✅ | No hardcoded secrets/keys/Supabase URLs found; `.env.local` gitignored. |
| 3.6 | ❌ | No `app/not-found.tsx` or `app/error.tsx` — falls back to default Next.js pages. |

## 4. SEO & Discoverability

| ID | Status | Notes |
|---|---|---|
| 4.1 | ⚠️ | Only `app/layout.tsx:7-26` defines metadata; no page exports its own — every route shares the homepage title/description. |
| 4.2 | ⚠️ | OG/Twitter blocks exist globally but no `images` field, and no per-page OG for the most shareable page (`/scan/[scanId]`). |
| 4.3 | ❌ | No structured data / JSON-LD anywhere. |
| 4.4 | ❌ | No `robots.ts` / `robots.txt`. |
| 4.5 | ❌ | No `sitemap.ts` / `sitemap.xml`. |
| 4.6 | ❌ | No canonical tags; no www/non-www redirect in `next.config.mjs`. |

## 5. Trust & Credibility

| ID | Status | Notes |
|---|---|---|
| 5.1 | ⚠️ | **Testimonials are fabricated placeholders** — `components/home/Testimonials.tsx:5` explicit comment "Replace these with real testimonials when available," yet shown live with fake names/revenue figures. |
| 5.2 | ✅ | Real founder section, `components/home/About.tsx:37-54` — name, photo, location. |
| 5.3 | ✅ | `#7C3AED` consistently applied (42 occurrences via `app/globals.css:12`); Geist Sans/Mono correctly wired; tagline live in `Nav.tsx:52,105-107`, `Footer.tsx:6`. |
| 5.4 | ✅ | Hero (`Hero.tsx:16-32`) is clear on problem, audience, and next action within seconds. |

## 6. Design & Desirability

| ID | Status | Notes |
|---|---|---|
| 6.1 | ✅ | Clean, minimal hero — mono label, bold clamp-sized headline, single input widget. |
| 6.2 | ✅ | Consistent heading scale and mono eyebrow labels across pages. |
| 6.3 | ✅ | Geist Sans/Mono applied consistently. |
| 6.4 | ❌ | **`app/admin/page.tsx`** uses a completely different gold/dark-green palette (`#C4A96A`, `#2D4A3E`) — a brand-system break (lower stakes since it's internal-only, but flagged as a real deviation). |
| 6.5 | ✅ | Consistent section/card padding rhythm (`py-[80–120px]`, `p-6/7`). |
| 6.6 | ⚠️ | Scan and assessment flows share consistent button/input/card styling; admin dashboard diverges (`rounded-2xl`, different palette). |
| 6.7 | ✅ | Chat widget (`public/widget.js:57,67`) and `app/chat/page.tsx` use exact brand violet and Geist fonts. |
| 6.8 | ✅ | Consistent direct, founder-to-founder tone across copy and chatbot prompt. |
| 6.9 | ⚠️ | No skeleton/spinner components anywhere — only text-based loading states ("Scanning…", "Generating your report…"). |
| 6.10 | ✅ | Hover/focus/transition classes used pervasively on buttons, inputs, nav, FAQ accordion. |

---

## Key Risks

- `/report` (old flow) has **zero server-side gating** — full report renders straight from a URL query param, so any shared/bookmarked link exposes gated content for free (`app/report/page.tsx:16-62`).
- **Two parallel, inconsistent lead-capture systems are live simultaneously** — the new gated `/scan` funnel and the old ungated `/assessment` → `/report` funnel — duplicating leads tables and confusing analytics/CTAs.
- **No SEO fundamentals shipped**: no robots.ts, sitemap.ts, JSON-LD, canonical/www handling, or per-page metadata.
- **Fabricated testimonials live on the homepage** with an explicit "replace before launch" comment still unaddressed (`components/home/Testimonials.tsx:5`).
- **No `not-found.tsx`/`error.tsx`** — 404s and errors fall through to generic Next.js defaults.
