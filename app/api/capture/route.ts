import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, revenue, scores, totalScore, timestamp, message, source } = body;

  const isAssessment = source !== "contact";

  try {
    // 1. Notify Leila
    await resend.emails.send({
      from: "Prime Lane <noreply@primelane.com>",
      to: "hello@primelane.com",
      subject: isAssessment
        ? `New lead: ${name} · Score ${totalScore}/100 · ${revenue}`
        : `New contact: ${name} · ${revenue}`,
      text: isAssessment
        ? `Name: ${name}\nEmail: ${email}\nRevenue: ${revenue}\nScore: ${totalScore}/100\n\nScores:\nResponse: ${scores?.response}/25\nRecovery: ${scores?.recovery}/25\nRetention: ${scores?.retention}/25\nAcquisition: ${scores?.acquisition}/25\n\nTimestamp: ${timestamp}`
        : `Name: ${name}\nEmail: ${email}\nRevenue: ${revenue}\n\nMessage:\n${message}\n\nTimestamp: ${timestamp}`,
    });

    // 2. Confirmation to lead
    await resend.emails.send({
      from: "Prime Lane <noreply@primelane.com>",
      to: email,
      subject: isAssessment
        ? "Your Revenue Leak Report — Prime Lane"
        : "Thanks for reaching out — Prime Lane",
      text: isAssessment
        ? `Hi ${name},\n\nYour Revenue Leak Score: ${totalScore}/100\n\nYour report is ready at: https://primelane.com/report\n\nThe area with the most room to improve is your lowest-scoring module — that's the highest-impact place to start.\n\nI'll follow up shortly to discuss what would make the most sense for your store.\n\n— Leila\nPrime Lane\nhello@primelane.com`
        : `Hi ${name},\n\nThanks for getting in touch. I'll reply within 24 hours.\n\n— Leila\nPrime Lane\nhello@primelane.com`,
    });
  } catch (err) {
    // Log error but don't fail the request — user experience takes priority
    console.error("[capture] Resend error:", err);
  }

  return NextResponse.json({ success: true });
}
