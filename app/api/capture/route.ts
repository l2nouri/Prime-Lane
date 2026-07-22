import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import {
  MODULE_NAMES,
  FINDING_COPY,
  COST_COPY,
  SERVICE_FOR_MODULE,
  getFindingRange,
  hasSignificantLeakGap,
  calculateResult,
  type ModuleScores,
} from "@/lib/assessment";

function buildReportEmailHtml(scores: ModuleScores, totalScore: number): string {
  const result = calculateResult(scores);
  const significantGap = hasSignificantLeakGap(scores);
  const modules = (Object.entries(scores) as [keyof ModuleScores, number][]).sort(
    ([, a], [, b]) => a - b
  );

  const findingsHtml = modules
    .map(([key, score], i) => {
      const range = getFindingRange(score);
      const finding = FINDING_COPY[key][range];
      const cost = COST_COPY[key][range];
      const service = SERVICE_FOR_MODULE[key];
      return `
        <table cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 16px;border:1px solid #ececec;border-radius:8px;">
          <tr><td style="padding:20px 24px;">
            <p style="font-family:'Courier New',monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:#7c3aed;margin:0 0 14px;">0${i + 1} — ${MODULE_NAMES[key]} (${score}/50)</p>
            <p style="font-family:'Courier New',monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#8a7f72;margin:0 0 4px;">What we found</p>
            <p style="font-size:14px;line-height:1.6;color:#3d3530;margin:0 0 14px;">${finding}</p>
            <p style="font-family:'Courier New',monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#8a7f72;margin:0 0 4px;">What this costs</p>
            <p style="font-size:14px;line-height:1.6;color:#3d3530;margin:0 0 14px;">${cost}</p>
            <p style="font-family:'Courier New',monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#8a7f72;margin:0 0 4px;">The fix</p>
            <p style="font-size:14px;line-height:1.6;color:#3d3530;margin:0;">${service.name}</p>
          </td></tr>
        </table>`;
    })
    .join("\n");

  const highlightHtml = significantGap
    ? `<p style="font-family:'Courier New',monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#7c3aed;margin:0 0 8px;">Your highest-impact fix</p>
       <p style="font-size:17px;font-weight:500;color:#1a1a1a;margin:0 0 8px;">${MODULE_NAMES[result.highestLeak]}</p>
       <p style="font-size:14px;line-height:1.6;color:#5c534a;margin:0;">This is your biggest revenue leak. It's also the fastest to fix.</p>`
    : `<p style="font-family:'Courier New',monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#7c3aed;margin:0 0 8px;">Both areas need attention</p>
       <p style="font-size:17px;font-weight:500;color:#1a1a1a;margin:0 0 8px;">AI Chatbot &amp; Workflow Automation</p>
       <p style="font-size:14px;line-height:1.6;color:#5c534a;margin:0;">Your scores are close — there's no single standout leak. Fixing either area first will move the needle; doing both compounds the result.</p>`;

  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL;

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#faf9f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf9f7;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #f0ede8;">
        <tr>
          <td style="padding:36px 40px 28px;border-bottom:1px solid #f0ede8;">
            <p style="font-family:'Courier New',monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#8a7f72;margin:0 0 12px;">Lenava · Revenue Leak Report</p>
            <h1 style="font-size:26px;font-weight:500;letter-spacing:-0.01em;margin:0;color:#1a1a1a;">Your full report is ready</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 40px 0;">
            <table cellpadding="0" cellspacing="0" style="background:#f7f5f2;border-radius:8px;margin-bottom:24px;">
              <tr>
                <td style="padding:16px 24px;">
                  <p style="font-family:'Courier New',monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#8a7f72;margin:0 0 4px;">Your Revenue Leak Score</p>
                  <p style="font-size:52px;font-weight:500;letter-spacing:-0.02em;margin:0;color:#1a1a1a;line-height:1;">${totalScore}<span style="font-size:18px;color:#8a7f72;font-weight:400;">/100</span></p>
                  <p style="font-family:'Courier New',monospace;font-size:11px;color:#8a7f72;margin:6px 0 0;">Chatbot: ${scores.chatbot}/50 &nbsp;·&nbsp; Automation: ${scores.automation}/50</p>
                </td>
              </tr>
            </table>
            ${findingsHtml}
            <table cellpadding="0" cellspacing="0" width="100%" style="background:#f3ebfe;border-radius:8px;margin:8px 0 24px;">
              <tr><td style="padding:20px 24px;">${highlightHtml}</td></tr>
            </table>
            ${bookingUrl ? `<p style="text-align:center;margin:0 0 28px;"><a href="${bookingUrl}" style="display:inline-block;padding:12px 24px;background:#7c3aed;color:#ffffff;text-decoration:none;border-radius:4px;font-size:14px;font-weight:500;">Book a free 20-minute Revenue Leak Review →</a></p>` : ""}
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px 36px;border-top:1px solid #f0ede8;">
            <p style="font-size:15px;color:#5c534a;margin:0 0 6px;">Questions? Just reply to this email.</p>
            <p style="font-size:15px;color:#5c534a;margin:0;">— Leila<br>Lenava<br><a href="mailto:hello@lenava.io" style="color:#6b4fbb;text-decoration:none;">hello@lenava.io</a></p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const body = await req.json();
  const { name, email, revenue, scores, totalScore, timestamp, message, source } = body;

  const isAssessment = source === "assessment";
  const isBookingClick = source === "booking-click";
  const hasEmail = typeof email === "string" && email.trim().length > 0;

  // Save to Supabase
  const { error: dbError } = await supabase.from("leads").insert({
    name,
    email,
    revenue,
    source: isBookingClick ? "booking-click" : isAssessment ? "assessment" : "contact",
    total_score: isAssessment || isBookingClick ? totalScore ?? null : null,
    score_chatbot: isAssessment || isBookingClick ? scores?.chatbot ?? null : null,
    score_automation: isAssessment || isBookingClick ? scores?.automation ?? null : null,
    message: message ?? null,
    submitted_at: timestamp ?? new Date().toISOString(),
  });
  if (dbError) console.error("[capture] Supabase error:", dbError.message);

  // Booking-click pings don't always carry an email — skip emails entirely when there's nothing to send to/about
  if (isBookingClick && !hasEmail) {
    return NextResponse.json({ success: true });
  }

  try {
    // 1. Notify Leila
    await resend.emails.send({
      from: "Lenava <noreply@lenava.io>",
      to: "hello@lenava.io",
      subject: isBookingClick
        ? `Booking CTA clicked: ${email}`
        : isAssessment
        ? `New lead: ${name} · Score ${totalScore}/100 · ${revenue}`
        : `New contact: ${name} · ${revenue}`,
      text: isBookingClick
        ? `Email: ${email}\nScore: ${totalScore ?? "n/a"}/100\n\nTimestamp: ${timestamp}`
        : isAssessment
        ? `Name: ${name}\nEmail: ${email}\nRevenue: ${revenue}\nScore: ${totalScore}/100\n\nScores:\nAI Chatbot: ${scores?.chatbot}/50\nWorkflow Automation: ${scores?.automation}/50\n\nTimestamp: ${timestamp}`
        : `Name: ${name}\nEmail: ${email}\nRevenue: ${revenue}\n\nMessage:\n${message}\n\nTimestamp: ${timestamp}`,
    });

    // 2. Confirmation to lead (skipped for booking-click pings — the booking page itself confirms)
    if (isAssessment && hasEmail && scores) {
      await resend.emails.send({
        from: "Lenava <noreply@lenava.io>",
        to: email,
        subject: "Your full Revenue Leak Report — Lenava",
        html: buildReportEmailHtml(scores as ModuleScores, totalScore),
      });
    } else if (!isAssessment && !isBookingClick && hasEmail) {
      await resend.emails.send({
        from: "Lenava <noreply@lenava.io>",
        to: email,
        subject: "Thanks for reaching out — Lenava",
        text: `Hi ${name},\n\nThanks for getting in touch. I'll reply within 24 hours.\n\n— Leila\nLenava\nhello@lenava.io`,
      });
    }
  } catch (err) {
    // Log error but don't fail the request — user experience takes priority
    console.error("[capture] Resend error:", err);
  }

  return NextResponse.json({ success: true });
}
