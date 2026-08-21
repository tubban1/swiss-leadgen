'use client';

import React, { useEffect, useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  ExternalLink, 
  Key, 
  Star, 
  Search, 
  CheckCircle2, 
  Clock, 
  MailWarning, 
  FileText,
  ShieldCheck
} from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  category: string;
  address: string;
  city: string;
  canton: string;
  language: string;
  email: string | null;
  phone: string | null;
  rating: number;
  review_count: number;
  subdomain: string;
  admin_pass: string;
  status: string;
  is_published: boolean;
  email_subject?: string;
  email_body?: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/leads');
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter(
    (item) =>
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.city?.toLowerCase().includes(search.toLowerCase()) ||
      item.category?.toLowerCase().includes(search.toLowerCase())
  );

  const totalLeads = leads.length;
  const deployedLeads = leads.filter((l) => l.is_published || l.status === 'deployed').length;
  const hasEmailCount = leads.filter((l) => l.email).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-10">
      {/* ── Top Header ────────────────────────────────────────── */}
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Swiss LeadGen SuperAdmin</h1>
              <p className="text-sm text-slate-400">瑞士无网站商家 AI 自动建站与 CRM 审核总控中心</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchLeads}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-colors border border-slate-700"
          >
            刷新数据
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-8">
        {/* ── Stats Bar ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800/80 shadow-lg">
            <div className="text-sm font-medium text-slate-400 flex items-center justify-between mb-2">
              <span>已抓取并发现商家</span>
              <Building2 className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">{totalLeads}</div>
          </div>
          <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800/80 shadow-lg">
            <div className="text-sm font-medium text-slate-400 flex items-center justify-between mb-2">
              <span>已自动建站激活</span>
              <Globe className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-400">{deployedLeads}</div>
          </div>
          <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800/80 shadow-lg">
            <div className="text-sm font-medium text-slate-400 flex items-center justify-between mb-2">
              <span>已提取到电子邮箱</span>
              <Mail className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-extrabold text-purple-400">{hasEmailCount}</div>
          </div>
        </div>

        {/* ── Search Bar ──────────────────────────────────────── */}
        <div className="flex items-center gap-4 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
          <Search className="w-5 h-5 text-slate-400 ml-2" />
          <input
            type="text"
            placeholder="搜索商家名字、城市或行业类别..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none text-slate-100 placeholder-slate-500 focus:outline-none text-sm w-full"
          />
        </div>

        {/* ── Leads Table / Cards ─────────────────────────────── */}
        {loading ? (
          <div className="text-center py-20 text-slate-500">正在从 Neon 数据库加载商家数据...</div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400">
            暂无已生成的商家记录。
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredLeads.map((lead) => {
              const websiteUrl = `https://${lead.subdomain || `${lead.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.sites.tubban.com`}`;
              const adminUrl = `${websiteUrl}/admin`;

              return (
                <div
                  key={lead.id}
                  className="bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-lg font-bold text-white">{lead.name}</h2>
                      <span className="px-2.5 py-0.5 text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md uppercase">
                        {lead.category || 'Bakery'}
                      </span>
                      <span className="px-2.5 py-0.5 text-xs font-semibold bg-slate-800 text-slate-300 rounded-md">
                        {lead.city} ({lead.canton})
                      </span>
                      {lead.rating && (
                        <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-md">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{lead.rating}</span>
                          <span className="text-slate-400">({lead.review_count}条好评)</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{lead.address || '瑞士未录入详细门牌'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{lead.phone || '暂无电话'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span className={lead.email ? 'text-purple-300 font-medium' : 'text-slate-500'}>
                          {lead.email || '未查到公开邮箱'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Passwords */}
                  <div className="flex items-center gap-3 flex-wrap md:flex-nowrap border-t md:border-t-0 border-slate-800 pt-4 md:pt-0">
                    <div className="bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs flex items-center gap-2">
                      <Key className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-slate-400">后台密码:</span>
                      <code className="text-amber-300 font-mono font-bold">{lead.admin_pass || 'YP9BR2YX'}</code>
                    </div>

                    {lead.email_body && (
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors border border-slate-700 flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-400" />
                        <span>预览邮件草稿</span>
                      </button>
                    )}

                    <a
                      href={websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center gap-1.5 shrink-0"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>查看在线成品网站</span>
                      <ExternalLink className="w-3 h-3 opacity-70" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ── Draft Modal ─────────────────────────────────────── */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-bold text-lg text-white">Outreach 邮件草稿预览</h3>
                <p className="text-xs text-slate-400">目标商家: {selectedLead.name} ({selectedLead.email || '未填邮箱'})</p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-slate-400 hover:text-white text-sm px-2 py-1 bg-slate-800 rounded-lg"
              >
                关闭
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400">邮件主题 (Subject):</label>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm font-semibold text-slate-200">
                {selectedLead.email_subject || 'Une nouvelle page web disponible pour votre commerce'}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400">邮件正文预览 (HTML Draft):</label>
              <div
                className="p-4 bg-white text-slate-900 rounded-xl max-h-96 overflow-y-auto text-sm"
                dangerouslySetInnerHTML={{ __html: selectedLead.email_body || '<p>暂无正文</p>' }}
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
              >
                完成预览
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
