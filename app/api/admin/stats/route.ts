import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { createClient as createAuthClient } from '@/lib/supabase/server';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET() {
  const authSupabase = await createAuthClient();
  const { data: { user } } = await authSupabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabase();

  const [messagesRes, chatLeadsRes, leadsRes] = await Promise.all([
    supabase.from('messages').select('session_id, role, source, created_at'),
    supabase.from('chat_leads').select('id, session_id, name, email, whatsapp, business_type, problem, preferred_contact, source, language, estimated_hours_saved, estimated_revenue_recovered, created_at').order('created_at', { ascending: false }),
    supabase.from('leads').select('id, name, email, source, total_score, score_chatbot, score_automation, company_name, website_url, industry, report_content, submitted_at').order('submitted_at', { ascending: false }),
  ]);

  const messages = messagesRes.data ?? [];
  const chatLeads = chatLeadsRes.data ?? [];
  const leads = leadsRes.data ?? [];

  // Distinct sessions = conversations
  const sessionSet = new Set<string>();
  const channelSessions: Record<string, Set<string>> = {};
  let totalMessages = 0;

  for (const m of messages) {
    sessionSet.add(m.session_id);
    totalMessages++;
    const src = m.source || 'web';
    if (!channelSessions[src]) channelSessions[src] = new Set();
    channelSessions[src].add(m.session_id);
  }

  const totalConversations = sessionSet.size;
  const totalChatLeads = chatLeads.length;
  const totalAllLeads = leads.length + totalChatLeads;

  const conversionRate =
    totalConversations > 0
      ? parseFloat(((totalChatLeads / totalConversations) * 100).toFixed(1))
      : 0;

  const channels = Object.entries(channelSessions)
    .map(([source, sessions]) => ({
      source,
      conversations: sessions.size,
    }))
    .sort((a, b) => b.conversations - a.conversations);

  return NextResponse.json({
    conversations: totalConversations,
    uniqueUsers: totalConversations,
    messages: totalMessages,
    chatLeads: totalChatLeads,
    totalLeads: totalAllLeads,
    conversionRate,
    channels,
    allChatLeads: chatLeads,
    allLeads: leads,
    recentChatLeads: chatLeads.slice(0, 10),
    recentLeads: leads.slice(0, 10),
  });
}
