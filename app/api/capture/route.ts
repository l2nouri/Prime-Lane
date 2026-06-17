import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const body = await req.json();
  const { name, email, revenue, scores, totalScore, timestamp, message, source } = body;

  const isAssessment = source !== "contact";

  // Save to Supabase
  const { error: dbError } = await supabase.from("leads").insert({
    name,
    email,
    revenue,
    source: isAssessment ? "assessment" : "contact",
    total_score: isAssessment ? totalScore : null,
    score_chatbot: isAssessment ? scores?.chatbot : null,
    score_automation: isAssessment ? scores?.automation : null,
    message: message ?? null,
    submitted_at: timestamp ?? new Date().toISOString(),
  });
  if (dbError) console.error("[capture] Supabase error:", dbError.message);

  try {
    // 1. Notify Leila
    await resend.emails.send({
      from: "Lenava <noreply@lenava.io>",
      to: "hello@lenava.io",
      subject: isAssessment
        ? `New lead: ${name} · Score ${totalScore}/100 · ${revenue}`
        : `New contact: ${name} · ${revenue}`,
      text: isAssessment
        ? `Name: ${name}\nEmail: ${email}\nRevenue: ${revenue}\nScore: ${totalScore}/100\n\nScores:\nAI Chatbot: ${scores?.chatbot}/50\nWorkflow Automation: ${scores?.automation}/50\n\nTimestamp: ${timestamp}`
        : `Name: ${name}\nEmail: ${email}\nRevenue: ${revenue}\n\nMessage:\n${message}\n\nTimestamp: ${timestamp}`,
    });

    // 2. Confirmation to lead
    await resend.emails.send({
      from: "Lenava <noreply@lenava.io>",
      to: email,
      subject: isAssessment
        ? "Your Revenue Leak Report — Lenava"
        : "Thanks for reaching out — Lenava",
      text: isAssessment
        ? `Hi ${name},\n\nYour Revenue Leak Score: ${totalScore}/100\n\nYour report is ready at: https://lenava.io/report\n\nThe area with the most room to improve is your lowest-scoring module — that's the highest-impact place to start.\n\nI'll follow up shortly to discuss what would make the most sense for your store.\n\n— Leila\nLenava\nhello@lenava.io`
        : `Hi ${name},\n\nThanks for getting in touch. I'll reply within 24 hours.\n\n— Leila\nLenava\nhello@lenava.io`,
    });
  } catch (err) {
    // Log error but don't fail the request — user experience takes priority
    console.error("[capture] Resend error:", err);
  }

  return NextResponse.json({ success: true });
}
