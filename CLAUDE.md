# Lenava

AI-powered email automation services for e-commerce and DTC brands.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Database/Auth:** Supabase
- **Email:** Resend
- **Deployment:** Vercel
- **Analytics:** Plausible
- **Fonts:** Geist Sans, Geist Mono

## Brand

- **Primary color:** Electric Violet `#7C3AED`
- **Fonts:** Geist Sans (body/headings), Geist Mono (code/data)

## Services

1. **Customer Support Agent** — automated support via email
2. **Abandoned Cart Recovery** — re-engagement sequences for cart drops
3. **Post-Purchase Nurture** — lifecycle emails after purchase
4. **Customer Acquisition System** — top-of-funnel email campaigns

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Homepage — hero, services overview, CTA |
| `/assessment` | Revenue Leak Assessment (lead capture quiz) |
| `/report` | Personalized report generated from assessment |
| `/contact` | Contact form (post-report conversion step) |

## Lead Flow

```
Homepage CTA → /assessment (quiz) → /report (personalized output) → /contact (book a call / submit)
```

Assessment answers are stored in Supabase. Report is generated from those answers. Contact form submission triggers a Resend email.

## Integrations

- **Supabase:** stores assessment responses and contact form leads
- **Resend:** transactional emails (report delivery, lead notification, nurture sequences)
- **Plausible:** privacy-first analytics (no cookie banner needed)

## Current Status

- [x] Supabase connected
- [ ] `/assessment` page — in progress
- [ ] Resend email flow — next up
- [ ] `/report` dynamic generation
- [ ] `/contact` form + submission email

## Next Steps

1. Finish `/assessment` page (quiz UI + Supabase write)
2. Wire up Resend: send report email on assessment completion, notify team on contact form submit
3. Build `/report` page pulling from Supabase by session/ID
4. Complete `/contact` form with lead capture to Supabase + Resend notification
