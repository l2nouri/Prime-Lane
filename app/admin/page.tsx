'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type ChannelData = { source: string; conversations: number };

type ChatLead = {
  id: string;
  name: string;
  email: string | null;
  whatsapp: string | null;
  business_type: string | null;
  problem: string | null;
  preferred_contact: string;
  source: string;
  language: string;
  estimated_hours_saved: string | null;
  estimated_revenue_recovered: string | null;
  created_at: string;
};

type Lead = {
  id: string;
  name: string;
  email: string;
  source: string;
  total_score: number | null;
  submitted_at: string;
};

type Stats = {
  conversations: number;
  uniqueUsers: number;
  messages: number;
  chatLeads: number;
  totalLeads: number;
  conversionRate: number;
  channels: ChannelData[];
  allChatLeads: ChatLead[];
  allLeads: Lead[];
  recentChatLeads: ChatLead[];
  recentLeads: Lead[];
};

const NAV_ITEMS = [
  'Dashboard',
  'Leads',
  'Knowledge Base',
  'Models',
  'Conversations',
  'Feedback',
  'Playground',
  'Persona',
  'Widget',
  'Telegram',
];

const CHANNEL_LABELS: Record<string, string> = {
  telegram: 'Telegram',
  widget: 'Widget',
  web: 'Chat Page',
};

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8E0D8] px-6 py-5 flex flex-col items-center justify-center min-h-[130px]">
      <span className="text-[13px] text-[#8A8078] tracking-wide">{label}</span>
      <span className="text-[40px] font-medium text-[#1A1A1A] leading-tight mt-1 font-mono">
        {value}
      </span>
      {sub && (
        <span className="text-[12px] text-[#A8A098] mt-1">{sub}</span>
      )}
    </div>
  );
}

function ChannelBar({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-4">
      <span className="text-[14px] text-[#6B6560] w-24 text-right shrink-0">
        {label}
      </span>
      <div className="flex-1 bg-[#EDE8E2] rounded-full h-7 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${Math.max(pct, 4)}%`,
            background: 'linear-gradient(90deg, #C4A96A 0%, #2D4A3E 45%)',
          }}
        />
      </div>
      <span className="text-[14px] font-mono text-[#1A1A1A] w-10 shrink-0">
        {value}
      </span>
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function LeadsTab({ stats }: { stats: Stats }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'chatbot' | 'assessment' | 'contact'>('all');
  const [selectedLead, setSelectedLead] = useState<ChatLead | Lead | null>(null);

  const allCombined: Array<{
    type: 'chatbot' | 'assessment' | 'contact';
    id: string;
    name: string;
    email: string | null;
    whatsapp?: string | null;
    source: string;
    channel: string;
    score: number | null;
    business_type?: string | null;
    problem?: string | null;
    preferred_contact?: string;
    estimated_hours_saved?: string | null;
    estimated_revenue_recovered?: string | null;
    date: string;
    raw: ChatLead | Lead;
  }> = [
    ...stats.allChatLeads.map((l) => ({
      type: 'chatbot' as const,
      id: l.id,
      name: l.name || '—',
      email: l.email,
      whatsapp: l.whatsapp,
      source: l.source,
      channel: CHANNEL_LABELS[l.source] || l.source,
      score: null,
      business_type: l.business_type,
      problem: l.problem,
      preferred_contact: l.preferred_contact,
      estimated_hours_saved: l.estimated_hours_saved,
      estimated_revenue_recovered: l.estimated_revenue_recovered,
      date: l.created_at,
      raw: l,
    })),
    ...stats.allLeads.map((l) => ({
      type: (l.source === 'assessment' ? 'assessment' : 'contact') as 'assessment' | 'contact',
      id: l.id,
      name: l.name,
      email: l.email,
      source: l.source,
      channel: l.source,
      score: l.total_score,
      date: l.submitted_at,
      raw: l,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filtered = allCombined.filter((l) => {
    if (filter !== 'all' && l.type !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        l.name.toLowerCase().includes(q) ||
        (l.email?.toLowerCase().includes(q) ?? false) ||
        (l.whatsapp?.toLowerCase().includes(q) ?? false) ||
        (l.business_type?.toLowerCase().includes(q) ?? false)
      );
    }
    return true;
  });

  const typeBadge = (type: string) => {
    const colors: Record<string, string> = {
      chatbot: 'bg-[#7C3AED]/10 text-[#7C3AED]',
      assessment: 'bg-[#2D4A3E]/10 text-[#2D4A3E]',
      contact: 'bg-[#C4A96A]/20 text-[#8A7340]',
    };
    return colors[type] || 'bg-[#F0EBE5] text-[#6B6560]';
  };

  return (
    <>
      <p className="text-[14px] text-[#8A8078] mb-6">
        All leads from chatbot conversations, assessments, and contact form.
      </p>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name, email, or business..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 h-10 px-4 rounded-lg border border-[#E8E0D8] text-[14px] text-[#1A1A1A] outline-none focus:border-[#7C3AED] transition-colors bg-white"
        />
        <div className="flex gap-2">
          {(['all', 'chatbot', 'assessment', 'contact'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-[12px] font-medium transition-colors ${
                filter === f
                  ? 'bg-[#7C3AED] text-white'
                  : 'bg-white border border-[#E8E0D8] text-[#8A8078] hover:text-[#5A5550]'
              }`}
            >
              {f === 'all' ? `All (${allCombined.length})` : `${f.charAt(0).toUpperCase() + f.slice(1)} (${allCombined.filter((l) => l.type === f).length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        {/* Table */}
        <div className={`bg-white rounded-2xl border border-[#E8E0D8] p-6 ${selectedLead ? 'flex-1' : 'w-full'}`}>
          {filtered.length === 0 ? (
            <p className="text-[14px] text-[#8A8078] text-center py-8">
              {search ? 'No leads match your search.' : 'No leads yet.'}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-[#E8E0D8] text-[#8A8078]">
                    <th className="text-left pb-3 font-medium">Name</th>
                    <th className="text-left pb-3 font-medium">Contact</th>
                    <th className="text-left pb-3 font-medium">Type</th>
                    <th className="text-left pb-3 font-medium">Channel</th>
                    <th className="text-left pb-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((lead) => (
                    <tr
                      key={`${lead.type}-${lead.id}`}
                      onClick={() => setSelectedLead(lead.raw)}
                      className={`border-b border-[#F0EBE5] last:border-0 cursor-pointer transition-colors ${
                        selectedLead && 'id' in selectedLead && selectedLead.id === lead.id
                          ? 'bg-[#F5F0EB]'
                          : 'hover:bg-[#FAFAF8]'
                      }`}
                    >
                      <td className="py-3 text-[#1A1A1A] font-medium">{lead.name}</td>
                      <td className="py-3 text-[#6B6560]">
                        {lead.email || lead.whatsapp || '—'}
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${typeBadge(lead.type)}`}>
                          {lead.type}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F0EBE5] text-[#6B6560]">
                          {lead.channel}
                        </span>
                      </td>
                      <td className="py-3 text-[#A8A098] font-mono text-[12px]">
                        {formatDate(lead.date)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selectedLead && (
          <div className="w-80 shrink-0 bg-white rounded-2xl border border-[#E8E0D8] p-6 sticky top-32 self-start">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-medium text-[#1A1A1A]">Lead Details</h3>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-[#A8A098] hover:text-[#6B6560] text-[18px] leading-none"
              >
                &times;
              </button>
            </div>
            <div className="flex flex-col gap-3 text-[13px]">
              {'name' in selectedLead && (
                <DetailRow label="Name" value={selectedLead.name || '—'} />
              )}
              {'email' in selectedLead && selectedLead.email && (
                <DetailRow label="Email" value={selectedLead.email} />
              )}
              {'whatsapp' in selectedLead && (selectedLead as ChatLead).whatsapp && (
                <DetailRow label="WhatsApp" value={(selectedLead as ChatLead).whatsapp!} />
              )}
              {'preferred_contact' in selectedLead && (
                <DetailRow label="Preferred Contact" value={(selectedLead as ChatLead).preferred_contact} />
              )}
              {'business_type' in selectedLead && (selectedLead as ChatLead).business_type && (
                <DetailRow label="Business" value={(selectedLead as ChatLead).business_type!} />
              )}
              {'problem' in selectedLead && (selectedLead as ChatLead).problem && (
                <DetailRow label="Problem" value={(selectedLead as ChatLead).problem!} />
              )}
              {'estimated_hours_saved' in selectedLead && (selectedLead as ChatLead).estimated_hours_saved && (
                <DetailRow label="Hours Saved" value={(selectedLead as ChatLead).estimated_hours_saved!} />
              )}
              {'estimated_revenue_recovered' in selectedLead && (selectedLead as ChatLead).estimated_revenue_recovered && (
                <DetailRow label="Revenue Recovered" value={(selectedLead as ChatLead).estimated_revenue_recovered!} />
              )}
              {'total_score' in selectedLead && (selectedLead as Lead).total_score != null && (
                <DetailRow label="Assessment Score" value={`${(selectedLead as Lead).total_score}/100`} />
              )}
              {'source' in selectedLead && (
                <DetailRow label="Source" value={selectedLead.source} />
              )}
              {'language' in selectedLead && (
                <DetailRow label="Language" value={(selectedLead as ChatLead).language === 'it' ? 'Italian' : 'English'} />
              )}
              {'created_at' in selectedLead && (
                <DetailRow label="Date" value={formatDate((selectedLead as ChatLead).created_at)} />
              )}
              {'submitted_at' in selectedLead && (
                <DetailRow label="Date" value={formatDate((selectedLead as Lead).submitted_at)} />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-[11px] text-[#A8A098] uppercase tracking-wide">{label}</span>
      <p className="text-[#1A1A1A] mt-0.5 break-words">{value}</p>
    </div>
  );
}

function ComingSoonTab({ name }: { name: string }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8E0D8] p-12 text-center">
      <p className="text-[16px] text-[#8A8078]">
        <span className="font-medium text-[#1A1A1A]">{name}</span> is coming soon.
      </p>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/admin/login');
        return;
      }
      fetch('/api/admin/stats')
        .then((res) => {
          if (!res.ok) throw new Error('Failed');
          return res.json();
        })
        .then((data) => {
          setStats(data);
          setLoading(false);
        })
        .catch(() => {
          setError(true);
          setLoading(false);
        });
    });
  }, [router, supabase.auth]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  const maxChannel = stats
    ? Math.max(...stats.channels.map((c) => c.conversations), 1)
    : 1;

  return (
    <div className="min-h-screen" style={{ background: '#F5F0EB' }}>
      {/* Top Bar */}
      <header className="bg-white border-b border-[#E8E0D8] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <div className="flex gap-[3px]">
              <div className="w-[3px] h-5 bg-[#7C3AED] rounded-full" />
              <div className="w-[3px] h-3 bg-[#7C3AED] rounded-full mt-auto" />
              <div className="w-[3px] h-5 bg-[#7C3AED] rounded-full" />
            </div>
            <span className="font-mono text-lg font-semibold tracking-wide text-[#7C3AED]">
              Lenava
            </span>
            <span className="text-[13px] text-[#A8A098] ml-1">Admin Panel</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-[13px] text-[#8A8078] border border-[#E8E0D8] rounded-lg px-4 py-1.5 hover:bg-[#F5F0EB] transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-[#E8E0D8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {NAV_ITEMS.map((item) => (
              <button
                key={item}
                onClick={() => setActiveTab(item)}
                className={`px-4 py-3 text-[14px] whitespace-nowrap transition-colors relative ${
                  activeTab === item
                    ? 'text-[#7C3AED] font-medium'
                    : 'text-[#8A8078] hover:text-[#5A5550]'
                }`}
              >
                {item}
                {activeTab === item && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#7C3AED] rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-[#8A8078]">
              Failed to load dashboard data. Check your Supabase connection.
            </p>
          </div>
        ) : stats ? (
          <>
            {/* Dashboard Tab */}
            {activeTab === 'Dashboard' && (
              <>
                <p className="text-[14px] text-[#8A8078] mb-6">
                  Overview of chatbot performance across all channels.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <StatCard label="Conversations" value={stats.conversations} />
                  <StatCard label="Unique Users" value={stats.uniqueUsers} />
                  <StatCard label="Messages" value={stats.messages} />
                  <StatCard label="Chatbot Leads" value={stats.chatLeads} sub={`of ${stats.totalLeads} total leads`} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <StatCard label="Lead Conversion Rate" value={`${stats.conversionRate}%`} sub="leads captured ÷ conversations" />
                  <StatCard label="Satisfaction Rate" value="—" sub="feedback not yet tracked" />
                  <StatCard label="Estimated Cost" value="—" sub="token tracking not yet enabled" />
                  <StatCard label="Unsourced Answers" value="—" sub="knowledge gaps not yet tracked" />
                </div>

                {stats.channels.length > 0 && (
                  <div className="bg-white rounded-2xl border border-[#E8E0D8] p-6 mb-8">
                    <h2 className="text-[16px] font-medium text-[#1A1A1A] mb-5">Conversations by Channel</h2>
                    <div className="flex flex-col gap-3">
                      {stats.channels.map((ch) => (
                        <ChannelBar key={ch.source} label={CHANNEL_LABELS[ch.source] || ch.source} value={ch.conversations} max={maxChannel} />
                      ))}
                    </div>
                  </div>
                )}

                {stats.conversations === 0 && stats.chatLeads === 0 && stats.totalLeads === 0 && (
                  <div className="bg-white rounded-2xl border border-[#E8E0D8] p-12 text-center">
                    <p className="text-[16px] text-[#8A8078]">
                      No data yet. Conversations and leads will appear here once visitors start chatting.
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Leads Tab */}
            {activeTab === 'Leads' && <LeadsTab stats={stats} />}

            {/* Coming Soon Tabs */}
            {!['Dashboard', 'Leads'].includes(activeTab) && (
              <ComingSoonTab name={activeTab} />
            )}
          </>
        ) : null}
      </main>
    </div>
  );
}
