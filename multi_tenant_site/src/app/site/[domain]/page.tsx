import React from 'react';
import { neon } from '@neondatabase/serverless';
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
  Send,
  HeartHandshake,
  Wrench,
  Stethoscope,
  Scissors,
  Coffee,
  Croissant
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Props {
  params: {
    domain: string;
  };
}

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
         OR slug ILIKE ${'%' + cleanSlug + '%'}
      LIMIT 1;
    `;

    if (rows.length > 0) {
      return JSON.parse(JSON.stringify(rows[0]));
    }
    return null;
  } catch (err) {
    console.error('Failed to query lead from database:', err);
    return null;
  }
}

export default async function TenantPage({ params }: Props) {
  const rawDomain = params?.domain || 'swiss-business';
  
  // 1. 查询 Neon 数据库数据
  const leadData = await getLeadBySlug(rawDomain);

  // 2. 数据清洗与格式化
  const rawSlug = rawDomain.replace('.sites.tubban.com', '').replace('.tubban.com', '');
  const name = leadData?.name || rawSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const category = leadData?.category || 'general';
  const city = leadData?.city || 'Biel/Bienne';
  const canton = leadData?.canton || 'BE';
  const address = leadData?.address || `${city}, Schweiz`;
  const phone = leadData?.phone || '+41 32 320 00 00';
  const email = leadData?.email || `kontakt@${rawSlug}.ch`;
  const rating = leadData?.rating ? Number(leadData.rating).toFixed(1) : '4.8';
  const reviewCount = leadData?.review_count || 68;

  // ── 风格主题 1：Bäckerei / 烘焙店风格 (Warm Amber / Handcrafted Bakery) ─────────
  if (category === 'bakery') {
    return (
      <div className="min-h-screen bg-stone-950 text-amber-50 font-sans selection:bg-amber-500 selection:text-stone-950">
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-stone-950 font-bold text-xs py-2.5 px-4 text-center tracking-wide flex items-center justify-center gap-2">
          <Croissant className="w-4 h-4 shrink-0" />
          <span>Ofenfrische Schweizer Bäckerei & Handwerkskunst in {city}</span>
        </div>

        <header className="border-b border-amber-900/40 bg-stone-950/90 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 font-serif text-2xl font-black flex items-center justify-center shadow-lg shadow-amber-500/20">
                {name.charAt(0)}
              </div>
              <div>
                <h1 className="font-serif text-xl font-bold text-amber-100">{name}</h1>
                <p className="text-xs text-amber-400/90">Traditionelle Handwerksbäckerei · {city}</p>
              </div>
            </div>
            <a href="#contact" className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>{phone}</span>
            </a>
          </div>
        </header>

        <section className="py-20 px-6 max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Award className="w-4 h-4" />
            <span>Handgemacht nach Schweizer Tradition</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-serif font-black text-amber-50 leading-tight">
            Täglich frischer Genuss bei <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">
              {name}
            </span>
          </h2>
          <p className="text-lg text-amber-200/80 max-w-2xl mx-auto font-light">
            Wir backen täglich frisch für Sie mit besten Schweizer Zutaten aus der Region {city}. Vom knusprigen Gipfeli bis zum Spezialbrot.
          </p>
          <div className="flex items-center justify-center gap-2 text-amber-300 font-bold">
            <Star className="w-5 h-5 fill-amber-400" />
            <span>{rating} / 5.0</span>
            <span className="text-stone-400 font-normal">({reviewCount} Bewertungen)</span>
          </div>
        </section>

        <section className="py-16 bg-amber-950/20 border-t border-b border-amber-900/30">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-stone-900/80 rounded-3xl border border-amber-900/40">
              <Croissant className="w-8 h-8 text-amber-400 mb-4" />
              <h3 className="text-xl font-bold font-serif text-amber-100">100% Natursauerteig</h3>
              <p className="text-sm text-amber-200/60 mt-2">Lange Teigruhe für besten Geschmack und optimale Bekömmlichkeit.</p>
            </div>
            <div className="p-8 bg-stone-900/80 rounded-3xl border border-amber-900/40">
              <Award className="w-8 h-8 text-amber-400 mb-4" />
              <h3 className="text-xl font-bold font-serif text-amber-100">Regionale Zutaten</h3>
              <p className="text-sm text-amber-200/60 mt-2">Mehl und Butter direkt von zertifizierten Schweizer Höfen.</p>
            </div>
            <div className="p-8 bg-stone-900/80 rounded-3xl border border-amber-900/40">
              <Clock className="w-8 h-8 text-amber-400 mb-4" />
              <h3 className="text-xl font-bold font-serif text-amber-100">Früh geöffnet</h3>
              <p className="text-sm text-amber-200/60 mt-2">Täglich ab 06:00 Uhr warmes Brot und feiner Kaffee in {city}.</p>
            </div>
          </div>
        </section>
        
        <footer id="contact" className="py-12 bg-stone-950 border-t border-amber-900/30 text-center text-amber-200/60 text-sm">
          <p className="font-serif text-xl font-bold text-amber-100 mb-2">{name}</p>
          <p>{address} · Telefon: {phone}</p>
        </footer>
      </div>
    );
  }

  // ── 风格主题 2：Coiffeur / 理发造型美发风格 (Rose Gold Luxe Beauty) ─────────
  if (category === 'hair_salon') {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-rose-500 selection:text-zinc-950">
        <div className="bg-gradient-to-r from-rose-700 via-pink-600 to-rose-700 text-zinc-100 font-medium text-xs py-2.5 px-4 text-center tracking-widest uppercase">
          ✦ Premium Hair Styling & Beauty Salon in {city} ✦
        </div>

        <header className="border-b border-rose-900/30 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-rose-300 via-pink-400 to-amber-200 text-zinc-950 font-serif text-2xl font-serif flex items-center justify-center shadow-lg shadow-rose-500/20">
                {name.charAt(0)}
              </div>
              <div>
                <h1 className="font-serif text-xl font-bold text-rose-100 tracking-wide">{name}</h1>
                <p className="text-xs text-rose-400/90">Haarstyling · Coloration · Pflege</p>
              </div>
            </div>
            <a href={`tel:${phone}`} className="px-5 py-2.5 bg-rose-500 hover:bg-rose-400 text-zinc-950 font-bold text-sm rounded-full transition-all shadow-lg shadow-rose-500/20">
              Termin Buchen
            </a>
          </div>
        </header>

        <section className="py-24 px-6 max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            <Scissors className="w-4 h-4 text-rose-400" />
            <span>Exklusiver Vor-Ort Service in {city}</span>
          </div>
          <h2 className="text-5xl sm:text-7xl font-serif font-extralight text-zinc-50 tracking-tight leading-tight">
            Schönheit & Perfektion <br />
            <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-300 to-amber-200">
              {name}
            </span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-xl mx-auto font-light leading-relaxed">
            Ihr Spezialist für moderne Haarschnitte, Balayage, typgerechtes Styling und intensive Haartherapie in {city}.
          </p>
          <div className="flex items-center justify-center gap-2 text-rose-300 font-bold">
            <Star className="w-5 h-5 fill-rose-400 text-rose-400" />
            <span>{rating} / 5.0</span>
            <span className="text-zinc-500 font-normal">({reviewCount} Kundenstimmen)</span>
          </div>
        </section>

        <section className="py-16 bg-zinc-900/60 border-t border-b border-rose-900/20">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-zinc-900/90 rounded-3xl border border-rose-900/30 space-y-3">
              <h3 className="text-xl font-serif text-rose-200 font-bold">Damen & Herren Styling</h3>
              <p className="text-sm text-zinc-400">Präzise Haarschnitte, abgestimmt auf Ihre Persönlichkeit und Gesichtsform.</p>
            </div>
            <div className="p-8 bg-zinc-900/90 rounded-3xl border border-rose-900/30 space-y-3">
              <h3 className="text-xl font-serif text-rose-200 font-bold">Balayage & Coloration</h3>
              <p className="text-sm text-zinc-400">Schonende Farbtechniken mit edlen Pigmenten für langanhaltenden Glanz.</p>
            </div>
            <div className="p-8 bg-zinc-900/90 rounded-3xl border border-rose-900/30 space-y-3">
              <h3 className="text-xl font-serif text-rose-200 font-bold">VIP Intensivpflege</h3>
              <p className="text-sm text-zinc-400">Tiefenwirksame Masken und Kopfhautmassagen für maximale Vitalität.</p>
            </div>
          </div>
        </section>

        <footer id="contact" className="py-12 bg-zinc-950 border-t border-rose-900/20 text-center text-zinc-500 text-sm">
          <p className="font-serif text-xl text-rose-200 font-bold mb-2">{name}</p>
          <p>{address} · Telefon: {phone}</p>
        </footer>
      </div>
    );
  }

  // ── 风格主题 3：Zahnarzt / 牙科诊所医疗风格 (Swiss Medical Cyan & Pure Trust) ────
  if (category === 'dentist') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
        <div className="bg-gradient-to-r from-cyan-700 via-teal-600 to-cyan-700 text-white font-semibold text-xs py-2.5 px-4 text-center tracking-wide flex items-center justify-center gap-2">
          <Stethoscope className="w-4 h-4" />
          <span>Zahnmedizinische Exzellenz & Schonende Behandlung in {city}</span>
        </div>

        <header className="border-b border-cyan-900/40 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold text-2xl flex items-center justify-center">
                +
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{name}</h1>
                <p className="text-xs text-cyan-400">Schweizer Zahnarztpraxis · {city}</p>
              </div>
            </div>
            <a href={`tel:${phone}`} className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-cyan-500/20">
              Notfall & Termin
            </a>
          </div>
        </header>

        <section className="py-20 px-6 max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Swiss Dental Quality Standard</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-extrabold text-white leading-tight">
            Gesunde Zähne & Ein Strahlendes Lächeln <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-300 to-sky-400">
              {name}
            </span>
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto font-light">
            Moderne Zahnheilkunde, Prophylaxe und Implantologie. Wir sorgen für schmerzfreie Behandlungen in entspannter Atmosphäre.
          </p>
          <div className="flex items-center justify-center gap-2 text-cyan-300 font-bold">
            <Star className="w-5 h-5 fill-cyan-400 text-cyan-400" />
            <span>{rating} / 5.0</span>
            <span className="text-slate-400 font-normal">({reviewCount} Verifizierte Patientenbewertungen)</span>
          </div>
        </section>

        <section className="py-16 bg-slate-900/60 border-t border-b border-cyan-900/30">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-slate-900 rounded-2xl border border-cyan-900/40 space-y-3">
              <h3 className="text-xl font-bold text-white">Schmerzfreie Prophylaxe</h3>
              <p className="text-sm text-slate-400">Professionelle Zahnreinigung und vorsorgliche Pflege für dauerhafte Gesundheit.</p>
            </div>
            <div className="p-8 bg-slate-900 rounded-2xl border border-cyan-900/40 space-y-3">
              <h3 className="text-xl font-bold text-white">Ästhetische Zahnmedizin</h3>
              <p className="text-sm text-slate-400">Bleaching, Veneers und unsichtbare Zahnkorrekturen für höchste Ansprüche.</p>
            </div>
            <div className="p-8 bg-slate-900 rounded-2xl border border-cyan-900/40 space-y-3">
              <h3 className="text-xl font-bold text-white">Schnelle Notfallhilfe</h3>
              <p className="text-sm text-slate-400">Bei akuten Zahnschmerzen erhalten Sie am selben Tag einen Termin bei uns.</p>
            </div>
          </div>
        </section>

        <footer id="contact" className="py-12 bg-slate-950 border-t border-slate-800 text-center text-slate-400 text-sm">
          <p className="font-bold text-white text-lg mb-2">{name}</p>
          <p>{address} · Telefon: {phone}</p>
        </footer>
      </div>
    );
  }

  // ── 风格主题 4：Sanitär / 水暖工与工程修理 (Industrial Steel & Orange Power) ────
  if (category === 'sanitaer' || category === 'repair' || category === 'car_repair') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-orange-500 selection:text-slate-950">
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 text-slate-950 font-bold text-xs py-2.5 px-4 text-center tracking-wide flex items-center justify-center gap-2">
          <Wrench className="w-4 h-4" />
          <span>24/7 Notfallservice & Fachbetrieb in {city} ({canton})</span>
        </div>

        <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-400 font-bold text-2xl flex items-center justify-center">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{name}</h1>
                <p className="text-xs text-orange-400">Sanitär · Heizung · Reparatur</p>
              </div>
            </div>
            <a href={`tel:${phone}`} className="px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-orange-500/20">
              Notfall Anrufen
            </a>
          </div>
        </header>

        <section className="py-20 px-6 max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold">
            <Clock className="w-4 h-4" />
            <span>Schnelle Anfahrt in der Region {city}</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-white leading-tight">
            Zuverlässiger Service & Meisterqualität <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400">
              {name}
            </span>
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto font-light">
            Ihr erfahrener Partner für Sanitärinstallationen, Heizungsbau, Rohrsanierung und schnelle Reparaturen.
          </p>
          <div className="flex items-center justify-center gap-2 text-orange-400 font-bold">
            <Star className="w-5 h-5 fill-orange-400" />
            <span>{rating} / 5.0</span>
            <span className="text-slate-400 font-normal">({reviewCount} Zufriedene Kunden)</span>
          </div>
        </section>

        <section className="py-16 bg-slate-900/60 border-t border-b border-slate-800">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-xl font-bold text-white">24/7 Notfallservice</h3>
              <p className="text-sm text-slate-400">Wasserschaden oder Heizungsausfall? Wir sind taggleich bei Ihnen vor Ort.</p>
            </div>
            <div className="p-8 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-xl font-bold text-white">Faire & Transparente Preise</h3>
              <p className="text-sm text-slate-400">Verbindliche Kostenvoranschläge ohne versteckte Zusatzgebühren.</p>
            </div>
            <div className="p-8 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-xl font-bold text-white">Schweizer Qualitätssiegel</h3>
              <p className="text-sm text-slate-400">Ausführung nach strengsten Vorgaben und aktuellen Umweltstandards.</p>
            </div>
          </div>
        </section>

        <footer id="contact" className="py-12 bg-slate-950 border-t border-slate-800 text-center text-slate-400 text-sm">
          <p className="font-bold text-white text-lg mb-2">{name}</p>
          <p>{address} · Telefon: {phone}</p>
        </footer>
      </div>
    );
  }

  // ── 风格主题 5：Café / Restaurant 咖啡餐馆经典暗调风格 ──────────────────
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-amber-500 selection:text-stone-950">
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-stone-950 font-bold text-xs py-2.5 px-4 text-center tracking-wide flex items-center justify-center gap-2 shadow-md">
        <Coffee className="w-4 h-4 shrink-0" />
        <span>Exzellente Gastronomie & Herzliche Gastfreundschaft in {city}</span>
      </div>

      <header className="border-b border-stone-800/80 bg-stone-950/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 font-serif text-2xl font-black flex items-center justify-center shadow-lg shadow-amber-500/20">
              {name.charAt(0)}
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold tracking-tight text-white">{name}</h1>
              <p className="text-xs text-amber-400/90">Café · Restaurant · Bistrot</p>
            </div>
          </div>

          <a href="#contact" className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>Tisch Reservieren</span>
          </a>
        </div>
      </header>

      <section className="relative py-20 px-6 max-w-5xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <Award className="w-4 h-4" />
          <span>Beste Empfehlungen in {city}</span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-serif font-extrabold text-white leading-tight">
          Herzlich willkommen im <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
            {name}
          </span>
        </h2>

        <p className="text-lg sm:text-xl text-stone-300 max-w-2xl mx-auto font-light leading-relaxed">
          Genießen Sie feine Kaffeespezialitäten, kulinarische Köstlichkeiten und gemütliche Stunden in {city}.
        </p>

        <div className="pt-2 flex items-center justify-center gap-3">
          <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-2xl">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span className="text-lg font-bold text-amber-300">{rating}</span>
            <span className="text-xs text-stone-400">/ 5.0 ({reviewCount} Rezensionen)</span>
          </div>
        </div>
      </section>

      <section className="py-16 bg-stone-900/50 border-t border-b border-stone-800/80">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-stone-900/90 rounded-3xl border border-stone-800 space-y-4">
            <Coffee className="w-8 h-8 text-amber-400" />
            <h3 className="text-xl font-bold font-serif text-white">Barista Kaffeespezialitäten</h3>
            <p className="text-sm text-stone-400">Frisch geröstete Bohnen und meisterhafte Zubereitung.</p>
          </div>
          <div className="p-8 bg-stone-900/90 rounded-3xl border border-stone-800 space-y-4">
            <Award className="w-8 h-8 text-amber-400" />
            <h3 className="text-xl font-bold font-serif text-white">Saisonale Frische</h3>
            <p className="text-sm text-stone-400">Täglich wechselnde Menüs mit Produkten aus der Region.</p>
          </div>
          <div className="p-8 bg-stone-900/90 rounded-3xl border border-stone-800 space-y-4">
            <Clock className="w-8 h-8 text-amber-400" />
            <h3 className="text-xl font-bold font-serif text-white">Gemütliche Atmosphäre</h3>
            <p className="text-sm text-stone-400">Der perfekte Treffpunkt für Freunde, Familie und Business.</p>
          </div>
        </div>
      </section>

      <footer id="contact" className="py-12 bg-stone-950 border-t border-stone-800/80 text-stone-400 text-sm text-center">
        <div className="max-w-6xl mx-auto px-6 space-y-4">
          <p className="font-serif text-xl font-bold text-white">{name}</p>
          <p className="text-xs text-stone-500">{address} · Telefon: {phone}</p>
        </div>
      </footer>
    </div>
  );
}
