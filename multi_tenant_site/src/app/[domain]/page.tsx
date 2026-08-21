import React from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  Clock, 
  CheckCircle2, 
  Award,
  Calendar,
  Sparkles
} from 'lucide-react';

interface Props {
  params: {
    domain: string;
  };
}

export default async function TenantPage({ params }: Props) {
  // 提取传入的域名或子域名前缀
  const rawDomain = params.domain || 'swiss-business';
  const cleanName = rawDomain
    .replace('.sites.tubban.com', '')
    .replace('.tubban.com', '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 font-sans">
      {/* ── Top Announcement ────────────────────────────────────── */}
      <div className="bg-amber-600/90 text-stone-900 font-bold text-xs py-2 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 shrink-0" />
        <span>Traditionelle Schweizer Qualität & Exzellenz in Ihrer Region</span>
      </div>

      {/* ── Header ────────────────────────────────────────────── */}
      <header className="border-b border-stone-800 bg-stone-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-serif text-xl font-bold">
              {cleanName.charAt(0)}
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold tracking-tight text-white">{cleanName}</h1>
              <p className="text-xs text-stone-400">Schweiz · Meisterbetrieb</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-300">
            <a href="#about" className="hover:text-amber-400 transition-colors">Über Uns</a>
            <a href="#services" className="hover:text-amber-400 transition-colors">Leistungen</a>
            <a href="#contact" className="hover:text-amber-400 transition-colors">Kontakt</a>
          </nav>

          <a
            href="#contact"
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20"
          >
            Jetzt Anfragen
          </a>
        </div>
      </header>

      {/* ── Hero Section ──────────────────────────────────────── */}
      <section className="relative py-24 px-6 max-w-5xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <Award className="w-4 h-4" />
          <span>Erstklassiger Service seit vielen Jahren</span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-serif font-extrabold text-white leading-tight">
          Herzlich willkommen bei <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
            {cleanName}
          </span>
        </h2>

        <p className="text-lg sm:text-xl text-stone-300 max-w-2xl mx-auto font-light leading-relaxed">
          Ihr zuverlässiger Ansprechpartner für höchste Präzision, erstklassigen Service und Schweizer Tradition. Wir stehen für Qualität ohne Kompromisse.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#contact"
            className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-base rounded-2xl transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            <span>Termin vereinbaren</span>
          </a>
          <a
            href="#services"
            className="w-full sm:w-auto px-8 py-4 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-base rounded-2xl transition-colors border border-stone-700"
          >
            Unsere Angebote
          </a>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────── */}
      <section id="services" className="py-16 bg-stone-950/60 border-t border-b border-stone-800/80">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-stone-900/80 rounded-3xl border border-stone-800 space-y-4">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-serif text-white">Schweizer Qualität</h3>
            <p className="text-sm text-stone-400 leading-relaxed">
              Höchste Sorgfalt und maßgeschneiderte Lösungen für alle Ihre Anforderungen.
            </p>
          </div>

          <div className="p-8 bg-stone-900/80 rounded-3xl border border-stone-800 space-y-4">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-serif text-white">Kundenvertrauen</h3>
            <p className="text-sm text-stone-400 leading-relaxed">
              Ausgezeichnete Bewertungen und langjährige Zufriedenheit unserer Kunden.
            </p>
          </div>

          <div className="p-8 bg-stone-900/80 rounded-3xl border border-stone-800 space-y-4">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-serif text-white">Zuverlässig & Pünktlich</h3>
            <p className="text-sm text-stone-400 leading-relaxed">
              Termintreue Ausführung und transparente Kommunikation auf jedem Schritt.
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer id="contact" className="py-12 bg-stone-950 border-t border-stone-800 text-stone-400 text-sm text-center">
        <div className="max-w-6xl mx-auto px-6 space-y-4">
          <p className="font-serif text-lg font-bold text-white">{cleanName}</p>
          <p>© {new Date().getFullYear()} {cleanName} · Alle Rechte vorbehalten. Impressum & Datenschutz</p>
        </div>
      </footer>
    </div>
  );
}
