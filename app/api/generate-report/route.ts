import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import type { AnswerRecord } from "@/lib/insights";
import { normalizeUrl } from "@/lib/url";

function markdownToHtml(text: string): string {
  const lines = text.split("\n");
  const html: string[] = [];
  let listType: "ol" | "ul" | null = null;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (listType) {
        html.push(listType === "ol" ? "</ol>" : "</ul>");
        listType = null;
      }
      const heading = line.slice(3).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      html.push(
        `<h2 style="font-size:17px;font-weight:600;margin:28px 0 10px;color:#1a1a1a;letter-spacing:-0.01em;">${heading}</h2>`
      );
    } else if (/^\d+\.\s/.test(line)) {
      if (listType !== "ol") {
        if (listType === "ul") html.push("</ul>");
        html.push('<ol style="padding-left:22px;margin:10px 0 16px;">');
        listType = "ol";
      }
      const item = line.replace(/^\d+\.\s/, "").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      html.push(`<li style="margin-bottom:8px;font-size:15px;line-height:1.65;color:#3d3530;">${item}</li>`);
    } else if (line.startsWith("- ")) {
      if (listType !== "ul") {
        if (listType === "ol") html.push("</ol>");
        html.push('<ul style="padding-left:22px;margin:10px 0 16px;">');
        listType = "ul";
      }
      const item = line.slice(2).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      html.push(`<li style="margin-bottom:8px;font-size:15px;line-height:1.65;color:#3d3530;">${item}</li>`);
    } else {
      if (listType) {
        html.push(listType === "ol" ? "</ol>" : "</ul>");
        listType = null;
      }
      if (line.trim()) {
        const para = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
        html.push(
          `<p style="font-size:15px;line-height:1.7;color:#3d3530;margin:0 0 14px;">${para}</p>`
        );
      }
    }
  }

  if (listType) html.push(listType === "ol" ? "</ol>" : "</ul>");
  return html.join("\n");
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    firstName,
    email,
    companyName,
    websiteUrl: rawWebsiteUrl,
    industry,
    answers,
    scores,
    totalScore,
    timestamp,
  }: {
    firstName: string;
    email: string;
    companyName: string;
    websiteUrl: string;
    industry: string;
    answers: AnswerRecord[];
    scores: { chatbot: number; automation: number };
    totalScore: number;
    timestamp: string;
  } = body;

  const websiteUrl = normalizeUrl(rawWebsiteUrl);

  // Build answers text for the prompt
  const answersText = answers
    .map((a) => `Q: ${a.questionText}\nA: ${a.answerLabel} (${a.points}/${a.maxPoints} pts)`)
    .join("\n\n");

  const prompt = `You are a business automation consultant at Lenava, specialising in AI chatbots and workflow automation for ecommerce and service businesses.

Generate a personalised Revenue Leak Report for the following business owner. Be specific to their situation — reference their actual answers, industry context, and company name. Do not be generic.

BUSINESS:
- Company: ${companyName}
- Website: ${websiteUrl}
- Industry: ${industry}
- Contact: ${firstName}

ASSESSMENT RESULTS:
- Total Revenue Leak Score: ${totalScore}/100 (higher = fewer leaks)
- AI Chatbot Score: ${scores.chatbot}/50
- Workflow Automation Score: ${scores.automation}/50

THEIR ACTUAL ANSWERS:
${answersText}

Write the report using the following three sections. Use markdown formatting (## for headers, numbered lists for the next steps). Be direct and specific — this person is a busy business owner. Total length: 350–420 words.

## Your Biggest Revenue Gaps
Identify 2–3 specific gaps based on their answers. Name the concrete business impact for each (lost sales, missed repeat purchases, etc.). Reference their industry where relevant.

## How Automation Can Help ${companyName}
Explain specifically how AI chatbot and/or workflow automation would address their gaps, given their industry (${industry}) and current setup. Be concrete — not a generic pitch.

## Your 3 Prioritised Next Steps
List exactly 3 actionable steps, ordered by impact. Each step should name the specific action, not a vague category.`;

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const resend = new Resend(process.env.RESEND_API_KEY);

  let reportContent = "";
  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });
    reportContent =
      message.content[0].type === "text" ? message.content[0].text : "";
  } catch (err) {
    console.error("[generate-report] Anthropic error:", err);
    reportContent = `## Your Biggest Revenue Gaps\n\nBased on your score of ${totalScore}/100, there are meaningful opportunities in both AI Chatbot (${scores.chatbot}/50) and Workflow Automation (${scores.automation}/50).\n\n## How Automation Can Help ${companyName}\n\nA targeted automation strategy — covering real-time customer response and post-purchase flows — would directly address the gaps identified in your assessment.\n\n## Your 3 Prioritised Next Steps\n\n1. Reply to this email so Leila can review your specific answers and recommend the highest-impact fix.\n2. Book a 20-minute call to walk through what an AI chatbot setup would look like for ${companyName}.\n3. Review your current post-purchase email sequence against the benchmark Leila will share.`;
  }

  // Save lead + report to Supabase (after generation, so the full report is stored)
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.from("leads").insert({
      name: firstName,
      email,
      source: "assessment",
      total_score: totalScore,
      score_chatbot: scores.chatbot,
      score_automation: scores.automation,
      company_name: companyName,
      website_url: websiteUrl,
      industry,
      report_content: reportContent,
      submitted_at: timestamp ?? new Date().toISOString(),
    });
  } catch (err) {
    console.error("[generate-report] Supabase error:", err);
  }

  const reportHtml = markdownToHtml(reportContent);

  const emailHtml = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#faf9f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf9f7;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #f0ede8;">
        <!-- Header -->
        <tr>
          <td style="padding:36px 40px 28px;border-bottom:1px solid #f0ede8;">
            <p style="font-family:'Courier New',monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#8a7f72;margin:0 0 12px;">Lenava · Revenue Leak Report</p>
            <h1 style="font-size:26px;font-weight:500;letter-spacing:-0.01em;margin:0;color:#1a1a1a;">Hi ${firstName},</h1>
          </td>
        </tr>
        <!-- Score -->
        <tr>
          <td style="padding:28px 40px 0;">
            <p style="font-size:15px;line-height:1.65;color:#5c534a;margin:0 0 20px;">Here&apos;s your personalised Revenue Leak Report for <strong>${companyName}</strong>.</p>
            <table cellpadding="0" cellspacing="0" style="background:#f7f5f2;border-radius:8px;">
              <tr>
                <td style="padding:16px 24px;">
                  <p style="font-family:'Courier New',monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#8a7f72;margin:0 0 4px;">Your Revenue Leak Score</p>
                  <p style="font-size:52px;font-weight:500;letter-spacing:-0.02em;margin:0;color:#1a1a1a;line-height:1;">${totalScore}<span style="font-size:18px;color:#8a7f72;font-weight:400;">/100</span></p>
                  <p style="font-family:'Courier New',monospace;font-size:11px;color:#8a7f72;margin:6px 0 0;">Chatbot: ${scores.chatbot}/50 &nbsp;·&nbsp; Automation: ${scores.automation}/50</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Report body -->
        <tr>
          <td style="padding:24px 40px 8px;">
            ${reportHtml}
          </td>
        </tr>
        <!-- Footer -->
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

  try {
    await resend.emails.send({
      from: "Lenava <noreply@lenava.io>",
      to: email,
      subject: `Your Revenue Leak Report — ${companyName}`,
      html: emailHtml,
    });
  } catch (err) {
    console.error("[generate-report] Resend send error:", err);
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 });
  }

  // Notify Leila
  try {
    await resend.emails.send({
      from: "Lenava <noreply@lenava.io>",
      to: "hello@lenava.io",
      subject: `New report: ${firstName} · ${companyName} · ${totalScore}/100`,
      text: `Name: ${firstName}\nEmail: ${email}\nCompany: ${companyName}\nWebsite: ${websiteUrl}\nIndustry: ${industry}\nScore: ${totalScore}/100\nChatbot: ${scores.chatbot}/50\nAutomation: ${scores.automation}/50\n\n---\n\n${reportContent}`,
    });
  } catch {
    // Don't block on notification failure
  }

  return NextResponse.json({ success: true });
}
