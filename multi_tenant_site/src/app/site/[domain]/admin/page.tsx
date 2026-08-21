'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Lock, Key, CheckCircle, Save, Globe, Eye, ArrowLeft, RefreshCw, Sparkles, Sliders, Code2 } from 'lucide-react';

export default function TenantAdminPage() {
  const params = useParams();
  const rawDomain = (params?.domain as string) || '';
  const domain = decodeURIComponent(rawDomain);

  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [tenantName, setTenantName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [siteConfig, setSiteConfig] = useState<any>(null);
  const [jsonString, setJsonString] = useState('');
  const [activeTab, setActiveTab] = useState<'builder' | 'json'>('builder');

  // Form State
  const [heroTitleDe, setHeroTitleDe] = useState('');
  const [heroTitleFr, setHeroTitleFr] = useState('');
  const [heroSubtitleDe, setHeroSubtitleDe] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/site/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain, pass: password })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setTenantName(data.name);
        setSubdomain(data.subdomain);
        setSiteConfig(data.siteConfig || {});
        setJsonString(JSON.stringify(data.siteConfig || {}, null, 2));

        // Sync Form States
        const cfg = data.siteConfig || {};
        setHeroTitleDe(cfg?.content?.de?.hero?.title || '');
        setHeroTitleFr(cfg?.content?.fr?.hero?.title || '');
        setHeroSubtitleDe(cfg?.content?.de?.hero?.subtitle || '');
        setPhone(cfg?.business?.contact?.phone || '');
        setEmail(cfg?.business?.contact?.email || '');
      } else {
        setErrorMsg(data.error || 'Ungültiges Passwort (Invalid password)');
      }
    } catch (err: any) {
      setErrorMsg('Netzwerkfehler (Network Error)');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      let payloadConfig = siteConfig;

      if (activeTab === 'json') {
        try {
          payloadConfig = JSON.parse(jsonString);
        } catch (e) {
          setErrorMsg('Ungültiges JSON-Format (Invalid JSON format)');
          setLoading(false);
          return;
        }
      } else {
        // Sync Visual Builder state into siteConfig
        payloadConfig = JSON.parse(JSON.stringify(siteConfig || {}));
        if (!payloadConfig.content) payloadConfig.content = { de: { hero: {} }, fr: { hero: {} } };
        if (!payloadConfig.content.de) payloadConfig.content.de = { hero: {} };
        if (!payloadConfig.content.fr) payloadConfig.content.fr = { hero: {} };

        payloadConfig.content.de.hero.title = heroTitleDe;
        payloadConfig.content.fr.hero.title = heroTitleFr;
        payloadConfig.content.de.hero.subtitle = heroSubtitleDe;

        if (!payloadConfig.business) payloadConfig.business = { contact: {} };
        if (!payloadConfig.business.contact) payloadConfig.business.contact = {};
        payloadConfig.business.contact.phone = phone;
        payloadConfig.business.contact.email = email;
      }

      const res = await fetch('/api/site/admin/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain, pass: password, siteConfig: payloadConfig })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSiteConfig(payloadConfig);
        setJsonString(JSON.stringify(payloadConfig, null, 2));
        setSuccessMsg('✅ Änderungen erfolgreich in Datenbank gespeichert & Live veröffentlicht!');
      } else {
        setErrorMsg(data.error || 'Fehler beim Speichern');
      }
    } catch (err: any) {
      setErrorMsg('Fehler beim Speichern (Save error)');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07090e] text-white flex items-center justify-center p-6 selection:bg-amber-400 selection:text-black">
        {/* Ambient Backlight */}
        <div className="absolute w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="w-full max-w-md backdrop-blur-2xl bg-white/[0.03] border border-white/10 ring-1 ring-white/5 p-8 rounded-3xl space-y-6 relative z-10 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-black flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20 font-bold">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-white">Merchant Admin Login</h1>
            <p className="text-xs text-zinc-400 font-mono">{domain}</p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Passwort (Admin Password)</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Z.B. Pass_x89a2b"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 transition font-mono tracking-wider pl-10"
                />
                <Key className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Anmelden (Login)</span>}
            </button>
          </form>

          <div className="text-center pt-2">
            <a href={`/site/${domain}`} className="text-xs text-zinc-500 hover:text-amber-400 font-mono transition flex items-center justify-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Zurück zur Website</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-white selection:bg-amber-400 selection:text-black">
      {/* Header Bar */}
      <header className="border-b border-white/10 bg-[#07090e]/80 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-black font-bold flex items-center justify-center text-lg">
              ⚙️
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold text-white">{tenantName}</h1>
              <p className="text-xs text-amber-400 font-mono">{subdomain || domain}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`/site/${domain}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-mono text-zinc-300 transition flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>Live Website Öffnen</span>
            </a>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-mono transition"
            >
              Abmelden
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Dashboard Body */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-6">
        {/* Top Notification */}
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-xl animate-fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold shadow-xl">
            {errorMsg}
          </div>
        )}

        {/* Control Mode Switcher Tabs */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('builder')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'builder'
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                  : 'bg-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Visual Content Builder</span>
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'json'
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                  : 'bg-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Standard Site Config JSON</span>
            </button>
          </div>

          <button
            onClick={handleSaveConfig}
            disabled={loading}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition shadow-xl shadow-emerald-500/20 flex items-center gap-2"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Speichern & Veröffentlichen (Save & Publish)</span>
          </button>
        </div>

        {/* Tab 1: Visual Form Content Builder */}
        {activeTab === 'builder' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              {/* Hero Section Texts */}
              <div className="backdrop-blur-2xl bg-white/[0.03] border border-white/10 ring-1 ring-white/5 p-6 rounded-3xl space-y-4">
                <h3 className="text-sm font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Hero Section Content (Hauptbanner)</span>
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1 font-mono">Hero Title (Deutsch / DE)</label>
                    <input
                      type="text"
                      value={heroTitleDe}
                      onChange={(e) => setHeroTitleDe(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1 font-mono">Hero Title (Français / FR)</label>
                    <input
                      type="text"
                      value={heroTitleFr}
                      onChange={(e) => setHeroTitleFr(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1 font-mono">Hero Subtitle (DE)</label>
                    <textarea
                      rows={2}
                      value={heroSubtitleDe}
                      onChange={(e) => setHeroSubtitleDe(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="backdrop-blur-2xl bg-white/[0.03] border border-white/10 ring-1 ring-white/5 p-6 rounded-3xl space-y-4">
                <h3 className="text-sm font-mono font-bold text-amber-400 uppercase tracking-wider">
                  Kontaktdaten (Business Contact Info)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1 font-mono">Telefon (Phone)</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1 font-mono">E-Mail</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Info Card */}
            <div className="lg:col-span-4 space-y-6">
              <div className="backdrop-blur-2xl bg-white/[0.03] border border-white/10 ring-1 ring-white/5 p-6 rounded-3xl space-y-4">
                <h4 className="text-xs font-mono uppercase text-zinc-400 font-bold">Admin Credentials Information</h4>
                <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/30 space-y-2">
                  <div className="text-xs text-amber-300 font-mono">Random Admin Password:</div>
                  <div className="text-lg font-mono font-bold text-amber-400">{password}</div>
                  <div className="text-[10px] text-zinc-400">Stored securely in Neon PostgreSQL leads database table.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Advanced Raw JSON Config Editor */}
        {activeTab === 'json' && (
          <div className="backdrop-blur-2xl bg-white/[0.03] border border-white/10 ring-1 ring-white/5 p-6 rounded-3xl space-y-4">
            <h3 className="text-xs font-mono uppercase text-amber-400 font-bold">
              Standard Multi-Tenant Site Config Schema JSON Editor
            </h3>
            <textarea
              rows={22}
              value={jsonString}
              onChange={(e) => setJsonString(e.target.value)}
              className="w-full bg-[#05070a] border border-white/10 rounded-2xl p-5 text-xs text-emerald-400 font-mono focus:outline-none focus:border-amber-400 leading-relaxed shadow-inner"
            />
          </div>
        )}
      </main>
    </div>
  );
}
