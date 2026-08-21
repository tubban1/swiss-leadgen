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
  ShieldCheck,
  RefreshCw,
  Sparkles
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
      if (data.success && Array.isArray(data.leads)) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCleanUrl = (subdomainStr: string, name: string) => {
    if (!subdomainStr) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
      return `https://${slug}.sites.tubban.com`;
    }
    let clean = subdomainStr.replace('https://', '').replace('http://', '');
    if (!clean.includes('.sites.tubban.com')) {
      clean = clean.replace('.tubban.com', '');
      clean = `${clean}.sites.tubban.com`;
    }
    return `https://${clean}`;
  };

  const filteredLeads = leads.filter(
    (item) =>
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.city?.toLowerCase().includes(search.toLowerCase()) ||
      item.category?.toLowerCase().includes(search.toLowerCase())
  );

  const totalLeads = leads.length;
  const deployedLeads = leads.filter((l) => l.is_published || l.status === 'deployed').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-8">
      {/* ── Header ────────────────────────────────────────────── */}
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Swiss LeadGen Admin-Konsole</h1>
              <p className="text-sm text-slate-400">Verwaltungszentrum für KI-Website-Generierung & CRM-Outreach in der Schweiz</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchLeads}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-colors border border-slate-700 flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 text-blue-400 ${loading ? 'animate-spin' : ''}`} />
            <span>Daten aktualisieren</span>
          </button>
        </div>
      </header>

      {/* ── Stats Bar ──────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Erfasste Leads</p>
            <p className="text-3xl font-extrabold text-white mt-1">{totalLeads}</p>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Aktive Webseiten</p>
            <p className="text-3xl font-extrabold text-emerald-400 mt-1">{deployedLeads}</p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <Globe className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Schweizer Regionen</p>
            <p className="text-3xl font-extrabold text-purple-400 mt-1">ZH / GE / BE</p>
          </div>
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
            <MapPin className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ── Search & Filter ────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Suche nach Name, Stadt (z.B. Biel) oder Kategorie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Zeige {filteredLeads.length} von {totalLeads} Einträgen</span>
        </div>
      </div>

      {/* ── Main Leads Table ───────────────────────────────────── */}
      <main className="max-w-7xl mx-auto">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-16 text-center text-slate-400 space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-400" />
              <p className="text-sm">Lade Schweizer Lead-Datenbank...</p>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-16 text-center text-slate-400">
              <p>Keine Einträge gefunden.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                    <th className="py-4 px-6">Unternehmensname</th>
                    <th className="py-4 px-6">Kategorie</th>
                    <th className="py-4 px-6">Standort & Region</th>
                    <th className="py-4 px-6">Bewertung</th>
                    <th className="py-4 px-6">Status & Subdomain</th>
                    <th className="py-4 px-6 text-right">Aktionen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredLeads.map((lead) => {
                    const targetUrl = getCleanUrl(lead.subdomain, lead.name);
                    return (
                      <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors group">
                        <td className="py-4 px-6">
                          <div className="font-semibold text-white group-hover:text-blue-400 transition-colors flex items-center gap-2">
                            <span>{lead.name}</span>
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <Phone className="w-3 h-3" />
                            <span>{lead.phone || 'Keine Telefonnummer'}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700/80">
                            {lead.category || 'Gewerbe'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-slate-200 font-medium">{lead.city} ({lead.canton})</div>
                          <div className="text-xs text-slate-500 truncate max-w-xs">{lead.address}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1 text-amber-400 font-semibold">
                            <Star className="w-4 h-4 fill-amber-400" />
                            <span>{Number(lead.rating || 4.5).toFixed(1)}</span>
                            <span className="text-xs text-slate-500 font-normal">({lead.review_count})</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span className="text-xs font-mono text-emerald-400 font-semibold">{lead.subdomain}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <a
                            href={targetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg transition-all shadow-md shadow-blue-600/20"
                          >
                            <span>Website öffnen</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
