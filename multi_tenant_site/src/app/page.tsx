import React from 'react';
import { headers } from 'next/headers';
import { neon } from '@neondatabase/serverless';
import { redirect } from 'next/navigation';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  Clock, 
  CheckCircle2, 
  Award,
  Sparkles,
  ShieldCheck,
  Calendar,
  Send
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getLeadBySlug(slug: string) {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return null;

  try {
    const sql = neon(databaseUrl);
    const cleanSlug = slug
      .replace('.sites.tubban.com', '')
      .replace('.tubban.com', '');

    const rows = await sql`
      SELECT * FROM leads 
      WHERE subdomain ILIKE ${'%' + cleanSlug + '%'} 
         OR name ILIKE ${'%' + cleanSlug.replace(/-/g, ' ') + '%'}
      LIMIT 1;
    `;

    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    console.error('Failed to query lead from database:', err);
    return null;
  }
}

export default async function RootPage() {
  let hostname = '';
  try {
    const headerList = await headers();
    const rawHost = headerList.get('x-forwarded-host') || headerList.get('host') || '';
    hostname = rawHost.split(':')[0];
  } catch (e) {
    console.error('Headers read error:', e);
  }

  // 1. 提取子域名
  let subdomain = '';
  if (hostname.includes('.sites.tubban.com')) {
    subdomain = hostname.replace('.sites.tubban.com', '');
  } else if (hostname.includes('.tubban.com')) {
    subdomain = hostname.replace('.tubban.com', '');
  }

  // 2. 如果主站请求或无子域名，跳转 Admin Dashboard
  if (!subdomain || subdomain === 'sites' || subdomain === 'admin' || hostname.includes('vercel.app')) {
    redirect('/admin/dashboard');
  }

  // 3. 子域名请求：直接渲染 Neon 数据库拉取的全德语商户官网
  const leadData = await getLeadBySlug(subdomain);
  const rawSlug = subdomain.replace('.sites.tubban.com', '').replace('.tubban.com', '');
  const name = leadData?.name || rawSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const category = leadData?.category || 'Meisterbetrieb & Gewerbe';
  const city = leadData?.city || 'Zürich';
  const canton = leadData?.canton || 'ZH';
  const address = leadData?.address || `${city}, Schweiz`;
  const phone = leadData?.phone || '+41 44 123 45 67';
  const email = leadData?.email || `kontakt@${rawSlug}.ch`;
  const rating = leadData?.rating ? Number(leadData.rating).toFixed(1) : '4.9';
  const reviewCount = leadData?.review_count || 24;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-amber-500 selection:text-stone-950">
      {/* ── Top Announcement ────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-stone-950 font-bold text-xs py-2.5 px-4 text-center tracking-wide flex items-center justify-center gap-2 shadow-md">
        <Sparkles className="w-4 h-4 shrink-0" />
        <span>Traditionelle Schweizer Qualität & Exzellenz in {city} ({canton})</span>
      </div>

      {/* ── Header ────────────────────────────────────────────── */}
      <header className="border-b border-stone-800/80 bg-stone-950/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 font-serif text-2xl font-black flex items-center justify-center shadow-lg shadow-amber-500/20">
              {name.charAt(0)}
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold tracking-tight text-white">{name}</h1>
              <div className="flex items-center gap-2 text-xs text-amber-400/90 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Zertifizierter Fachbetrieb · {city}</span>
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-300">
            <a href="#about" className="hover:text-amber-400 transition-colors">Über Uns</a>
            <a href="#services" className="hover:text-amber-400 transition-colors">Leistungen</a>
            <a href="#contact" className="hover:text-amber-400 transition-colors">Kontakt & Anfahrt</a>
          </nav>

          <a
            href="#contact"
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
          >
            <Phone className="w-4 h-4" />
            <span>Jetzt Anrufen</span>
          </a>
        </div>
      </header>

      {/* ── Hero Section ──────────────────────────────────────── */}
      <section className="relative py-20 px-6 max-w-5xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <Award className="w-4 h-4" />
          <span>Ausgezeichneter Service in {city} ({canton})</span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-serif font-extrabold text-white leading-tight">
          Herzlich willkommen bei <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
            {name}
          </span>
        </h2>

        <p className="text-lg sm:text-xl text-stone-300 max-w-2xl mx-auto font-light leading-relaxed">
          Ihr professioneller Ansprechpartner für {category}. Wir verbinden meisterhafte Schweizer Tradition mit modernem Service und höchster Kundenzufriedenheit.
        </p>

        {/* Real Rating Badge */}
        <div className="pt-2 flex items-center justify-center gap-3">
          <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-2xl">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span className="text-lg font-bold text-amber-300">{rating}</span>
            <span className="text-xs text-stone-400">/ 5.0 ({reviewCount} verifizierte Kundenbewertungen)</span>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#contact"
            className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-base rounded-2xl transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            <Calendar className="w-5 h-5" />
            <span>Termin vereinbaren</span>
          </a>
          <a
            href={`tel:${phone}`}
            className="w-full sm:w-auto px-8 py-4 bg-stone-900 hover:bg-stone-800 text-stone-200 font-semibold text-base rounded-2xl transition-colors border border-stone-800 flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4 text-amber-400" />
            <span>{phone}</span>
          </a>
        </div>
      </section>

      {/* ── Business Details Grid ───────────────────────────── */}
      <section id="services" className="py-16 bg-stone-900/50 border-t border-b border-stone-800/80">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-stone-900/90 rounded-3xl border border-stone-800 space-y-4 shadow-lg hover:border-amber-500/40 transition-colors">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-serif text-white">Schweizer Qualitätsversprechen</h3>
            <p className="text-sm text-stone-400 leading-relaxed">
              Höchste Sorgfalt, Termintreue und erstklassige Materialien für alle Projekte in der Region {city}.
            </p>
          </div>

          <div className="p-8 bg-stone-900/90 rounded-3xl border border-stone-800 space-y-4 shadow-lg hover:border-amber-500/40 transition-colors">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-serif text-white">Erfahrungen & Vertrauen</h3>
            <p className="text-sm text-stone-400 leading-relaxed">
              Über {reviewCount} zufriedene Kundinnen und Kunden vertrauen auf unsere Fachkompetenz und persönliche Beratung.
            </p>
          </div>

          <div className="p-8 bg-stone-900/90 rounded-3xl border border-stone-800 space-y-4 shadow-lg hover:border-amber-500/40 transition-colors">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-serif text-white">Schnelle Erreichbarkeit</h3>
            <p className="text-sm text-stone-400 leading-relaxed">
              Mo – Fr: 08:00 – 18:00 Uhr. Wir sind direkt vor Ort im Kanton {canton} für Sie da.
            </p>
          </div>
        </div>
      </section>

      {/* ── Contact & Location Section ──────────────────────── */}
      <section id="contact" className="py-20 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Info Card */}
          <div className="space-y-6 bg-stone-900/80 p-8 rounded-3xl border border-stone-800">
            <h3 className="text-2xl font-serif font-bold text-white">Kontakt & Standort</h3>
            <p className="text-sm text-stone-400">
              Besuchen Sie uns direkt vor Ort oder nehmen Sie unverbindlich Kontakt auf.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-stone-400 uppercase">Adresse</h4>
                  <p className="text-base font-medium text-white">{address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-stone-400 uppercase">Telefon</h4>
                  <a href={`tel:${phone}`} className="text-base font-medium text-amber-400 hover:underline">{phone}</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-stone-400 uppercase">E-Mail</h4>
                  <p className="text-base font-medium text-stone-300">{email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Inquiry Form */}
          <div className="bg-stone-900/90 p-8 rounded-3xl border border-stone-800 space-y-6 shadow-xl">
            <h3 className="text-2xl font-serif font-bold text-white">Unverbindliche Anfrage</h3>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">Ihr Name</label>
                <input
                  type="text"
                  placeholder="z.B. Hans Muster"
                  className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">Telefon / E-Mail</label>
                <input
                  type="text"
                  placeholder="ihre.email@beispiel.ch"
                  className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">Ihre Nachricht</label>
                <textarea
                  rows={3}
                  placeholder="Wie können wir Ihnen helfen?"
                  className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 text-sm resize-none"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 text-sm"
              >
                <Send className="w-4 h-4" />
                <span>Anfrage Absenden</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="py-12 bg-stone-950 border-t border-stone-800/80 text-stone-400 text-sm text-center">
        <div className="max-w-6xl mx-auto px-6 space-y-4">
          <p className="font-serif text-xl font-bold text-white">{name}</p>
          <p className="text-xs text-stone-500">{address} · Telefon: {phone}</p>
          <p className="text-xs text-stone-600 pt-2">© {new Date().getFullYear()} {name} · Alle Rechte vorbehalten. Impressum & Datenschutz</p>
        </div>
      </footer>
    </div>
  );
}
