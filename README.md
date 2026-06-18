# Lenava Chatbot — Deployment Checklist

## 1. Supabase
- Run the SQL schema in your Supabase dashboard (find it in `/app/api/chat/route.ts` comments at the top of the file)
- Copy your project URL, anon key, and service role key

## 2. Environment Variables — add in Vercel dashboard AND `.env.local`
- `ANTHROPIC_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `TELEGRAM_BOT_TOKEN`
- `NEXT_PUBLIC_SITE_URL` (https://lenava.io)
- `OPENAI_API_KEY` — required for RAG embeddings (text-embedding-3-small)

## 3. Deploy
- Push to GitHub
- Vercel auto-deploys from main branch

## 4. Register Telegram Webhook (run once after deploy)
Visit this URL in your browser:
```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://lenava.io/api/telegram
```

## 5. Seed RAG knowledge base
```bash
npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/seed-rag.ts
```
Requires `OPENAI_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`.

## 6. Test
- Visit https://lenava.io/chat
- Message your Telegram bot
- Open /widget-test.html

---

## Architecture Notes

### Chat API (`/api/chat`)
- Edge runtime — no timeout limit on Vercel Hobby plan
- Streams SSE tokens directly from Claude as they arrive
- RAG retrieval via OpenAI text-embedding-3-small → Supabase pgvector
- Short-term memory: last 10 messages per session stored in Supabase
- Tool calling: `capture_lead` saves qualified leads to Supabase

### Telegram Bot (`/api/telegram`)
- Standard serverless function (maxDuration: 30s)
- Full response collected before replying (Telegram doesn't support streaming)
- Same conversation memory and lead capture as web

### Widget (`/widget.js`)
- Install: `<script src="https://lenava.io/widget.js"></script>`
- Shadow DOM isolation — no style conflicts with host site
- Loads chat page in iframe at `/chat?widget=true`
