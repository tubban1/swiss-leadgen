'use client';

import React, { useState } from 'react';
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
  Wrench,
  Stethoscope,
  Scissors,
  Coffee,
  Croissant,
  Languages,
  Check,
  ChevronRight,
  ShieldAlert,
  Sparkle
} from 'lucide-react';

interface TenantProps {
  name: string;
  category: string;
  city: string;
  canton: string;
  address: string;
  phone: string;
  email: string;
  rating: string;
  reviewCount: number;
}

export default function DynamicTenantView({
  name,
  category,
  city,
  canton,
  address,
  phone,
  email,
  rating,
  reviewCount
}: TenantProps) {
  const [lang, setLang] = useState<'de' | 'fr'>('de');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // 图像资源集
  const images = {
    bakery: {
      hero: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
      p1: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
      p2: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=600&q=80',
      p3: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    },
    hair_salon: {
      hero: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
      p1: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
      p2: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80',
      p3: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=600&q=80',
    },
    dentist: {
      hero: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
      p1: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80',
      p2: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=600&q=80',
      p3: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=600&q=80',
    },
    sanitaer: {
      hero: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1200&q=80',
      p1: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
      p2: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
      p3: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    },
    cafe: {
      hero: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
      p1: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
      p2: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
      p3: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80',
    }
  };

  const imgSet = images[category as keyof typeof images] || images.cafe;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  // ── 通用语言工具控制 ──────────────────────────────────────
  const renderLangBtn = () => (
    <div className="flex items-center gap-1.5 bg-stone-950 px-2.5 py-1 rounded-full border border-stone-800 shadow-inner">
      <Languages className="w-3.5 h-3.5 text-stone-400" />
      <button
        onClick={() => setLang('de')}
        className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
          lang === 'de' ? 'bg-amber-500 text-stone-950 shadow' : 'text-stone-400 hover:text-stone-200'
        }`}
      >
        DE
      </button>
      <span className="text-stone-700">|</span>
      <button
        onClick={() => setLang('fr')}
        className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
          lang === 'fr' ? 'bg-amber-500 text-stone-950 shadow' : 'text-stone-400 hover:text-stone-200'
        }`}
      >
        FR
      </button>
    </div>
  );

  // =========================================================================
  // 🥐 布局 1：BÄCKEREI (烘焙店) — 温馨暖麦手工拆分版式 (Warm Bakery Layout)
  // =========================================================================
  if (category === 'bakery') {
    return (
      <div className="min-h-screen bg-[#1c1815] text-[#f7f2ea] font-sans selection:bg-amber-500 selection:text-stone-950">
        {/* Top bar */}
        <div className="bg-[#2a241f] border-b border-amber-900/30 py-2 px-6 flex items-center justify-between text-xs text-amber-200/80">
          <div className="flex items-center gap-2">
            <Croissant className="w-4 h-4 text-amber-400" />
            <span>{lang === 'de' ? `Traditionelle Handwerksbäckerei in ${city} (Kanton ${canton})` : `Boulangerie artisanale traditionnelle à ${city}`}</span>
          </div>
          {renderLangBtn()}
        </div>

        {/* Header */}
        <header className="border-b border-amber-900/30 bg-[#1c1815]/90 backdrop-blur sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-stone-950 font-serif font-black text-xl flex items-center justify-center">
                {name.charAt(0)}
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-amber-100">{name}</span>
            </div>
            <a href={`tel:${phone}`} className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm rounded-full transition shadow-lg flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>{phone}</span>
            </a>
          </div>
        </header>

        {/* Hero: Split Counter & Warm Bakery Layout */}
        <section className="py-16 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-xs font-semibold">
              🌾 {lang === 'de' ? '100% Schweizer Mehl & Natursauerteig' : '100% Farine Suisse & Levain Naturel'}
            </div>
            <h1 className="text-4xl sm:text-6xl font-serif font-extrabold text-amber-50 leading-tight">
              {lang === 'de' ? 'Knuspriges Brot & Duftende Gipfeli' : 'Pain Croustillant & Croissants Parfumés'}
            </h1>
            <p className="text-lg text-amber-200/70 font-light leading-relaxed">
              {lang === 'de' ? `Seit Jahren Ihr vertrauter Bäcker in ${city}. Wir backen täglich ab 05:30 Uhr frisch für Ihren perfekten Start in den Tag.` : `Votre boulanger de confiance à ${city}. Cuisson quotidienne dès 05h30 pour un réveil gourmand.`}
            </p>
            <div className="p-4 bg-[#26201b] rounded-2xl border border-amber-900/40 flex items-center gap-4">
              <Star className="w-8 h-8 fill-amber-400 text-amber-400 shrink-0" />
              <div>
                <div className="font-bold text-amber-200 text-base">{rating} / 5.0 Google Bewertung ({reviewCount} Rezensionen)</div>
                <div className="text-xs text-amber-200/60">{lang === 'de' ? 'Von Kundinnen und Kunden in der Region ausgezeichnet' : 'Recommandé par nos clients régionaux'}</div>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden border-2 border-amber-900/40 shadow-2xl">
            <img src={imgSet.hero} alt="Bakery Hero" className="w-full h-[420px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1c1815] via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#1c1815]/90 rounded-2xl border border-amber-900/40">
              <p className="text-xs font-bold text-amber-400 uppercase tracking-widest">Frische Garantie</p>
              <p className="text-sm text-amber-100 font-serif mt-1">{lang === 'de' ? 'Täglich frisch aus dem Steinbackofen' : 'Frais du four chaque matin'}</p>
            </div>
          </div>
        </section>

        {/* Feature Bakery Cards Layout */}
        <section className="py-16 bg-[#241f1a] border-t border-amber-900/30">
          <div className="max-w-7xl mx-auto px-6 space-y-10">
            <h2 className="text-3xl font-serif font-bold text-amber-100 text-center">{lang === 'de' ? 'Unsere Spezialitäten' : 'Nos Spécialités'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[#1c1815] p-6 rounded-3xl border border-amber-900/30 space-y-4">
                <img src={imgSet.p1} className="w-full h-48 object-cover rounded-2xl" alt="Croissants" />
                <h3 className="text-xl font-serif font-bold text-amber-200">{lang === 'de' ? 'Schweizer Buttergipfeli' : 'Croissants au Beurre Suisse'}</h3>
                <p className="text-sm text-amber-200/60">{lang === 'de' ? 'Goldgelb gebacken mit echter Schweizer Butter.' : 'Dorés au four avec du beurre suisse pur.'}</p>
              </div>
              <div className="bg-[#1c1815] p-6 rounded-3xl border border-amber-900/30 space-y-4">
                <img src={imgSet.p2} className="w-full h-48 object-cover rounded-2xl" alt="Pâtisserie" />
                <h3 className="text-xl font-serif font-bold text-amber-200">{lang === 'de' ? 'Feine Pâtisserie' : 'Pâtisserie Fine'}</h3>
                <p className="text-sm text-amber-200/60">{lang === 'de' ? 'Fruchttörtchen und Tormes für besondere Anlässe.' : 'Tartelettes aux fruits et créations sur-mesure.'}</p>
              </div>
              <div className="bg-[#1c1815] p-6 rounded-3xl border border-amber-900/30 space-y-4">
                <img src={imgSet.p3} className="w-full h-48 object-cover rounded-2xl" alt="Brot" />
                <h3 className="text-xl font-serif font-bold text-amber-200">{lang === 'de' ? 'Urdinkel- & Sauerteigbrot' : 'Pain au Levain & Épeautre'}</h3>
                <p className="text-sm text-amber-200/60">{lang === 'de' ? 'Lange Teigruhe für bekömmlichen Genuss.' : 'Fermentation lente pour une digestion optimale.'}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16 max-w-5xl mx-auto px-6 space-y-8">
          <div className="bg-[#26201b] p-8 rounded-3xl border border-amber-900/40 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-serif font-bold text-amber-100">{lang === 'de' ? 'Standort & Kontakt' : 'Adresse & Contact'}</h3>
              <p className="text-sm text-amber-200/70">{address}</p>
              <p className="text-sm text-amber-200/70">Tel: {phone}</p>
              <p className="text-sm text-amber-200/70">E-Mail: {email}</p>
            </div>
            <div className="space-y-3 bg-[#1c1815] p-6 rounded-2xl border border-amber-900/30">
              <h4 className="font-bold text-amber-300 text-sm">{lang === 'de' ? 'Öffnungszeiten' : 'Heures d\'ouverture'}</h4>
              <div className="text-xs text-amber-200/70 space-y-1">
                <div>Mo - Fr: 05:30 - 18:30 Uhr</div>
                <div>Sa: 06:00 - 16:00 Uhr</div>
                <div>So: 07:00 - 13:00 Uhr</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // =========================================================================
  // ✂️ 布局 2：COIFFEUR / BEAUTY — 时尚奢华杂志感版式 (Editorial Magazine Layout)
  // =========================================================================
  if (category === 'hair_salon') {
    return (
      <div className="min-h-screen bg-[#0d0d0e] text-[#f4f4f6] font-sans selection:bg-rose-500 selection:text-zinc-950">
        {/* Top bar */}
        <div className="bg-[#171719] border-b border-rose-900/20 py-2 px-6 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <Scissors className="w-3.5 h-3.5 text-rose-400" />
            <span className="tracking-widest uppercase text-[11px]">{lang === 'de' ? `HAARSTYLING & BEAUTY SALON · ${city.toUpperCase()}` : `SALON DE COIFFURE HAUT DE GAMME · ${city.toUpperCase()}`}</span>
          </div>
          {renderLangBtn()}
        </div>

        {/* Header */}
        <header className="border-b border-rose-900/20 bg-[#0d0d0e]/90 backdrop-blur sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <h1 className="font-serif text-2xl tracking-widest uppercase font-light text-rose-100">{name}</h1>
            <a href={`tel:${phone}`} className="px-6 py-2.5 bg-rose-500 hover:bg-rose-400 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-full transition shadow-lg shadow-rose-500/20">
              {lang === 'de' ? 'Termin Vereinbaren' : 'Rendez-vous'}
            </a>
          </div>
        </header>

        {/* Hero: Editorial Centered Magazine Layout */}
        <section className="py-24 px-6 max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block px-4 py-1.5 rounded-full border border-rose-500/30 text-rose-300 text-xs tracking-widest uppercase">
            ✦ Haute Coiffure Switzerland ✦
          </div>
          <h2 className="text-5xl sm:text-7xl font-serif font-extralight text-zinc-100 tracking-tight leading-none">
            {lang === 'de' ? 'Eleganz & Typgerechtes Styling' : 'Élégance & Coiffure Sur-Mesure'}
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 font-light max-w-xl mx-auto leading-relaxed">
            {lang === 'de' ? `Willkommen bei ${name} in ${city}. Wir kreieren individuelle Looks, edle Balayage-Farbtöne und intensive Haartherapien.` : `Bienvenue chez ${name} à ${city}. Nous créons des looks uniques, des balayages raffinés et des soins d'exception.`}
          </p>
        </section>

        {/* Full-width High Fashion Image */}
        <div className="max-w-6xl mx-auto px-6 pb-16">
          <div className="relative rounded-3xl overflow-hidden border border-rose-900/30 shadow-2xl h-[480px]">
            <img src={imgSet.hero} alt="Salon" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0e] via-transparent to-transparent"></div>
            <div className="absolute bottom-8 left-8">
              <span className="text-xs uppercase tracking-widest text-rose-300">Google Rating</span>
              <p className="text-3xl font-serif font-bold text-white mt-1">{rating} ★ ({reviewCount} {lang === 'de' ? 'Bewertungen' : 'avis'})</p>
            </div>
          </div>
        </div>

        {/* Price list & Services Cards */}
        <section className="py-16 bg-[#131315] border-t border-b border-rose-900/20">
          <div className="max-w-6xl mx-auto px-6 space-y-12">
            <h3 className="text-3xl font-serif text-center font-light text-rose-100 tracking-wide uppercase">{lang === 'de' ? 'Unsere Services & Price List' : 'Nos Services & Tarifs'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 bg-[#18181b] rounded-3xl border border-rose-900/20 space-y-4">
                <h4 className="text-xl font-serif text-rose-200">{lang === 'de' ? 'Damen Cut & Style' : 'Coupe & Coiffage Femme'}</h4>
                <p className="text-xs text-zinc-400">{lang === 'de' ? 'Waschen, Verwöhn-Kopfmassage, Schnitt & Brushing.' : 'Shampooing, massage du cuir chevelu, coupe & brushing.'}</p>
                <div className="text-sm font-mono text-rose-300 font-bold">ab CHF 85.-</div>
              </div>
              <div className="p-8 bg-[#18181b] rounded-3xl border border-rose-900/20 space-y-4">
                <h4 className="text-xl font-serif text-rose-200">{lang === 'de' ? 'Balayage & Painting' : 'Balayage & Glossing'}</h4>
                <p className="text-xs text-zinc-400">{lang === 'de' ? 'Sanfte Farbverläufe mit Glanzversiegelung.' : 'Technique de coloration douce et brillance intense.'}</p>
                <div className="text-sm font-mono text-rose-300 font-bold">ab CHF 160.-</div>
              </div>
              <div className="p-8 bg-[#18181b] rounded-3xl border border-rose-900/20 space-y-4">
                <h4 className="text-xl font-serif text-rose-200">{lang === 'de' ? 'Herren Styling' : 'Coupe Homme Premium'}</h4>
                <p className="text-xs text-zinc-400">{lang === 'de' ? 'Präzisionshaarschnitt & Konturenpflege.' : 'Coupe de précision et soin des contours.'}</p>
                <div className="text-sm font-mono text-rose-300 font-bold">ab CHF 55.-</div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 text-center text-xs text-zinc-500 space-y-2">
          <p className="font-serif text-base text-rose-200">{name} · {address}</p>
          <p>Telefon: {phone}</p>
        </footer>
      </div>
    );
  }

  // =========================================================================
  // 🦷 布局 3：ZAHNARZT (牙科诊所) — 瑞士无瑕医疗极简版式 (Swiss Medical Precision Layout)
  // =========================================================================
  if (category === 'dentist') {
    return (
      <div className="min-h-screen bg-[#0b131e] text-[#e2e8f0] font-sans selection:bg-cyan-500 selection:text-slate-950">
        {/* Top bar */}
        <div className="bg-[#131f30] border-b border-cyan-900/40 py-2.5 px-6 flex items-center justify-between text-xs text-cyan-300">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold">{lang === 'de' ? `Zahnarztpraxis in ${city} · Swiss Quality Standard` : `Cabinet Dentaire à ${city} · Qualité Suisse`}</span>
          </div>
          {renderLangBtn()}
        </div>

        {/* Header */}
        <header className="border-b border-cyan-900/40 bg-[#0b131e]/90 backdrop-blur sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 font-bold text-2xl flex items-center justify-center">
                +
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{name}</h1>
                <p className="text-xs text-cyan-400">{lang === 'de' ? 'Schweizer Zahnmedizin' : 'Médecine Dentaire Suisse'}</p>
              </div>
            </div>
            <a href={`tel:${phone}`} className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-lg shadow-cyan-500/20">
              {lang === 'de' ? 'Notfall & Termin' : 'Urgence & Rendez-vous'}
            </a>
          </div>
        </header>

        {/* Hero: Clinical Precision & Emergency Callouts */}
        <section className="py-16 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-300 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'de' ? 'Schmerzfreie Behandlungen & Prophylaxe' : 'Soins Sans Douleur & Prophylaxie'}</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-extrabold text-white leading-tight">
              {lang === 'de' ? 'Ihr Vertrauensvolles Lächeln in ' : 'Votre Sourire Eclatant à '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-sky-400">{city}</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
              {lang === 'de' ? `Moderne Zahnheilkunde für die ganze Familie. Wir garantieren schonende Behandlungen mit neuester Schweizer Technologie.` : `Soins dentaires modernes pour toute la famille. Traitements doux avec les dernières technologies suisses.`}
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-[#111d2e] rounded-xl border border-cyan-900/40">
                <div className="text-2xl font-bold text-cyan-300">{rating} ★</div>
                <div className="text-xs text-slate-400 mt-1">{reviewCount} {lang === 'de' ? 'Patientenbewertungen' : 'avis patients'}</div>
              </div>
              <div className="p-4 bg-[#111d2e] rounded-xl border border-cyan-900/40">
                <div className="text-2xl font-bold text-cyan-300">100%</div>
                <div className="text-xs text-slate-400 mt-1">{lang === 'de' ? 'Sanfte Behandlung' : 'Soins Doux'}</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative rounded-3xl overflow-hidden border border-cyan-900/40 shadow-2xl">
            <img src={imgSet.hero} alt="Dentist Practice" className="w-full h-[400px] object-cover" />
          </div>
        </section>

        {/* 4 Specialties Cards */}
        <section className="py-16 bg-[#0e1826] border-t border-b border-cyan-900/30">
          <div className="max-w-7xl mx-auto px-6 space-y-10">
            <h3 className="text-2xl font-bold text-white text-center">{lang === 'de' ? 'Unsere Behandlungsbereiche' : 'Nos Domaines d\'Intervention'}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-[#132135] rounded-2xl border border-cyan-900/40 space-y-2">
                <h4 className="font-bold text-white text-lg">{lang === 'de' ? 'Zahnreinigung' : 'Nettoyage Dentaire'}</h4>
                <p className="text-xs text-slate-400">{lang === 'de' ? 'Professionelle Prophylaxe für gesunde Zähne.' : 'Prophylaxie professionnelle pour des dents saines.'}</p>
              </div>
              <div className="p-6 bg-[#132135] rounded-2xl border border-cyan-900/40 space-y-2">
                <h4 className="font-bold text-white text-lg">{lang === 'de' ? 'Ästhetik & Bleaching' : 'Blanchiment Dentaire'}</h4>
                <p className="text-xs text-slate-400">{lang === 'de' ? 'Strahlend weiße Zähne ohne Schmelzschaden.' : 'Dents blanches sans altérer l\'émail.'}</p>
              </div>
              <div className="p-6 bg-[#132135] rounded-2xl border border-cyan-900/40 space-y-2">
                <h4 className="font-bold text-white text-lg">{lang === 'de' ? 'Implantologie' : 'Implantologie'}</h4>
                <p className="text-xs text-slate-400">{lang === 'de' ? 'Langlebige Zahnimplantate bester Qualität.' : 'Implants dentaires durables de haute qualité.'}</p>
              </div>
              <div className="p-6 bg-[#132135] rounded-2xl border border-cyan-900/40 space-y-2">
                <h4 className="font-bold text-white text-lg">{lang === 'de' ? 'Notfall-Service' : 'Service d\'Urgence'}</h4>
                <p className="text-xs text-slate-400">{lang === 'de' ? 'Bei Zahnschmerzen sofortige Hilfe.' : 'Prise en charge rapide en cas de douleur.'}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 text-center text-xs text-slate-500">
          <p>{name} · {address} · Tel: {phone}</p>
        </footer>
      </div>
    );
  }

  // =========================================================================
  // 🛠️ 布局 4：SANITÄR / TRADE — 24/7 工业应急重载版式 (Industrial Heavy Action Layout)
  // =========================================================================
  if (category === 'sanitaer' || category === 'repair') {
    return (
      <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] font-sans selection:bg-orange-500 selection:text-slate-950">
        {/* Action 24/7 Bar */}
        <div className="bg-orange-600 text-slate-950 font-bold text-xs py-2 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 animate-bounce" />
            <span>{lang === 'de' ? `24/7 SANITÄR & HEIZUNG NOTFALLSERVICE IN ${city.toUpperCase()}` : `DÉPANNAGE SANITAIRE 24H/24 À ${city.toUpperCase()}`}</span>
          </div>
          {renderLangBtn()}
        </div>

        {/* Header */}
        <header className="border-b border-slate-800 bg-[#0f172a]/95 backdrop-blur sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-slate-950 font-bold text-xl flex items-center justify-center">
                <Wrench className="w-6 h-6" />
              </div>
              <span className="font-bold text-xl text-white">{name}</span>
            </div>
            <a href={`tel:${phone}`} className="px-6 py-3 bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-sm rounded-xl transition shadow-lg shadow-orange-500/20 flex items-center gap-2">
              <Phone className="w-4 h-4 fill-slate-950" />
              <span>{phone}</span>
            </a>
          </div>
        </header>

        {/* Hero: Action Emergency & Fast Dispatch */}
        <section className="py-16 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-block px-3 py-1 bg-orange-500/20 border border-orange-500/40 text-orange-400 font-bold text-xs rounded-lg uppercase">
              ⚡ {lang === 'de' ? 'Sofort-Anfahrt bei Wasserschaden & Heizungsausfall' : 'Intervention Immédiate en Cas de Fuite d\'Eau'}
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight">
              {lang === 'de' ? 'Schnell, Sauber & Fair Vor Ort in ' : 'Dépannage Rapide & Propre à '}
              <span className="text-orange-400">{city}</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
              {lang === 'de' ? `Ihr zertifizierter Meisterbetrieb für Sanitärinstallationen, Rohrsanierung und Heizungsservice. Transparentes Festpreis-Versprechen.` : `Votre artisan plombier certifié pour fuites d'eau, débouchage et chauffage.`}
            </p>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-white">{lang === 'de' ? 'Durchschnittliche Anfahrtszeit' : 'Temps d\'intervention moyen'}</div>
                <div className="text-xs text-slate-400">{lang === 'de' ? 'In der gesamten Region' : 'Dans toute la région'} {city}</div>
              </div>
              <div className="text-2xl font-black text-orange-400 font-mono">30 MIN</div>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl">
            <img src={imgSet.hero} alt="Sanitär Service" className="w-full h-[380px] object-cover" />
          </div>
        </section>

        {/* 3 Step Action Grid */}
        <section className="py-16 bg-slate-900 border-t border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-6 space-y-10">
            <h3 className="text-2xl font-bold text-center text-white">{lang === 'de' ? 'In 3 Schritten zu Ihrer Lösung' : 'Votre Problème Résolu en 3 Étapes'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <div className="w-8 h-8 rounded-full bg-orange-500 text-slate-950 font-bold flex items-center justify-center text-sm">1</div>
                <h4 className="font-bold text-white text-lg">{lang === 'de' ? 'Anrufen' : 'Appeler'}</h4>
                <p className="text-xs text-slate-400">{lang === 'de' ? 'Schildern Sie uns Ihr Problem am Telefon.' : 'Décrivez-nous votre problème par téléphone.'}</p>
              </div>
              <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <div className="w-8 h-8 rounded-full bg-orange-500 text-slate-950 font-bold flex items-center justify-center text-sm">2</div>
                <h4 className="font-bold text-white text-lg">{lang === 'de' ? 'Sofortige Anfahrt' : 'Déplacement Rapide'}</h4>
                <p className="text-xs text-slate-400">{lang === 'de' ? 'Unser Fachmann kommt direkt zu Ihnen.' : 'Notre technicien se rend sur place.'}</p>
              </div>
              <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <div className="w-8 h-8 rounded-full bg-orange-500 text-slate-950 font-bold flex items-center justify-center text-sm">3</div>
                <h4 className="font-bold text-white text-lg">{lang === 'de' ? 'Erfolgreiche Reparatur' : 'Réparation Réussie'}</h4>
                <p className="text-xs text-slate-400">{lang === 'de' ? 'Saubere Arbeit zum fairen Festpreis.' : 'Travail propre au tarif convenu.'}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 text-center text-xs text-slate-500">
          <p>{name} · {address} · Notfall-Tel: {phone}</p>
        </footer>
      </div>
    );
  }

  // =========================================================================
  // ☕️ 布局 5：CAFÉ / RESTAURANT — 意式暗调餐馆 Bistrot 版式 (Dark Bistrot Layout)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#14110f] text-[#f2ece4] font-sans selection:bg-amber-500 selection:text-stone-950">
      {/* Top bar */}
      <div className="bg-[#1e1916] border-b border-amber-900/30 py-2 px-6 flex items-center justify-between text-xs text-amber-200/70">
        <div className="flex items-center gap-2">
          <Coffee className="w-4 h-4 text-amber-400" />
          <span>{lang === 'de' ? `Café & Bistrot in ${city} (${canton})` : `Café & Bistrot à ${city}`}</span>
        </div>
        {renderLangBtn()}
      </div>

      {/* Header */}
      <header className="border-b border-amber-900/30 bg-[#14110f]/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <h1 className="font-serif text-2xl font-bold tracking-wider text-amber-100">{name}</h1>
          <a href={`tel:${phone}`} className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg">
            {lang === 'de' ? 'Tisch Reservieren' : 'Réserver'}
          </a>
        </div>
      </header>

      {/* Hero: Bistrot Menu & Centered Warm Atmosphere */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center space-y-8">
        <div className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          ☕️ Barista Specialty Coffee & Cuisine
        </div>
        <h2 className="text-4xl sm:text-6xl font-serif font-extrabold text-amber-50 leading-tight">
          {lang === 'de' ? 'Herzliche Schweizer Gastfreundschaft' : 'Hospitalité Chaleureuse & Conviviale'}
        </h2>
        <p className="text-base sm:text-lg text-amber-200/70 font-light max-w-xl mx-auto leading-relaxed">
          {lang === 'de' ? `Besuchen Sie uns im ${name} in ${city}. Wir servieren Ihnen köstliche Kaffeespezialitäten, frisch zubereitete Speisen und erlesene Weine.` : `Venez nous rendre visite au ${name} à ${city}. Nous vous proposons d'excellents cafés et une cuisine savoureuse.`}
        </p>
        <div className="pt-2 inline-flex items-center gap-2 bg-[#201b17] border border-amber-900/40 px-5 py-2.5 rounded-2xl">
          <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          <span className="font-bold text-amber-200">{rating} / 5.0</span>
          <span className="text-xs text-amber-200/60">({reviewCount} {lang === 'de' ? 'Rezensionen' : 'avis'})</span>
        </div>
      </section>

      {/* Featured Images Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-3xl overflow-hidden border border-amber-900/30 shadow-xl h-80">
            <img src={imgSet.p1} className="w-full h-full object-cover" alt="Coffee" />
          </div>
          <div className="rounded-3xl overflow-hidden border border-amber-900/30 shadow-xl h-80">
            <img src={imgSet.p2} className="w-full h-full object-cover" alt="Dishes" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#0c0a09] text-center text-xs text-amber-200/50 space-y-2">
        <p className="font-serif text-base text-amber-100">{name} · {address}</p>
        <p>Telefon: {phone}</p>
      </footer>
    </div>
  );
}
