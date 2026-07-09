import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

// Load .env.local manually (ts-node doesn't auto-load it)
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (key && !(key in process.env)) process.env[key] = value;
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const VOYAGE_API_KEY = process.env.VOYAGE_API_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const DOCUMENTS = [
  'Lenava builds AI agents and automation systems for independent ecommerce brands worldwide with €200k–2M annual revenue, with particular strength working with Italian brands growing internationally. Founded by Leila Nouri, based in Milan, Italy. Website: lenava.io. Contact: hello@lenava.io.',

  "Lenava's AI Chatbot service provides 24/7 customer support via website and WhatsApp. Handles product questions, sizing, shipping, returns, and order status in the brand's exact voice. Supports multiple languages. Escalates to a human only when genuinely needed. Key outcomes: faster response times, fewer lost sales, zero overnight gaps, consistent brand voice, human escalation when needed.",

  "Lenava's Workflow Automation service handles abandoned cart recovery, post-purchase sequences, upsell automation, review requests, loyalty follow-ups, and revenue tracking via email and WhatsApp. Most ecommerce brands lose revenue twice: abandoned carts they never recover, and customers they go silent with after the order.",

  "Lenava is not a generic automation agency or SaaS tool. Every system is built specifically for the client's brand — their voice, their products, their customers. Premium service, not a template.",

  "Lenava is platform-agnostic — since every system is custom-built rather than a pre-made app, Lenava works with any ecommerce platform, including Shopify, WooCommerce, and custom-built stores.",

  'Leila Nouri is the founder of Lenava. She works directly with every client. Contact via WhatsApp or email: hello@lenava.io. Responds within 24 hours.',

  "Lenava's ideal client: independent ecommerce founder, €200k–2M annual revenue, small or solo team, great product but losing revenue to unanswered messages, abandoned carts, and slow follow-ups. No dedicated tech or support team. Based anywhere in the world, with particular strength working with Italian brands selling internationally.",

  'After a lead is captured, Leila contacts them personally within 24 hours. Visitors choose WhatsApp or email. Leila reaches out directly — no automated sales sequence.',

  'Lenava operates in English and Italian. Future expansion into Spanish market planned. Active markets: independent ecommerce brands worldwide, with particular strength working with Italian brands growing internationally.',

  "Lenava's mission: help independent ecommerce brands replace slow, manual customer interactions with intelligent AI agents and automation systems — without agency overhead or a full tech team.",

  "Lenava's brand values: Systems over hustle. Small team, smart tools. Show don't sell — real demos, real numbers, working systems. Human feel, AI speed — every agent should feel warm, natural, and on-brand. Technology should be invisible. The experience should feel personal.",

  'Lenava does not publish case studies or client examples publicly. When prospects ask about past work or results, the correct response is to offer a direct conversation with Leila, who can walk them through what a real implementation would look like for their specific store.',
];

async function getEmbedding(text: string): Promise<number[]> {
  const response = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${VOYAGE_API_KEY}`,
    },
    body: JSON.stringify({
      input: text,
      model: 'voyage-3-lite',
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Voyage AI embeddings error: ${err}`);
  }

  const data = (await response.json()) as { data: Array<{ embedding: number[] }> };
  return data.data[0].embedding;
}

async function seed() {
  console.log('Starting RAG seed for Lenava...\n');

  for (let i = 0; i < DOCUMENTS.length; i++) {
    const content = DOCUMENTS[i];
    console.log(`[${i + 1}/${DOCUMENTS.length}] Embedding: "${content.slice(0, 60)}..."`);

    try {
      const embedding = await getEmbedding(content);

      const { error } = await supabase.from('documents').insert({
        client_id: 'lenava',
        content,
        embedding,
        metadata: { index: i + 1 },
      });

      if (error) {
        console.error(`  ✗ Supabase error:`, error.message);
      } else {
        console.log(`  ✓ Inserted`);
      }
    } catch (err) {
      console.error(`  ✗ Error:`, err instanceof Error ? err.message : err);
    }

    // Brief pause to avoid rate limits
    if (i < DOCUMENTS.length - 1) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  console.log('\nSeed complete.');
}

seed().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
