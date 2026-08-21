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
  ShieldAlert,
  ArrowUpRight,
  Flame,
  UserCheck,
  HeartHandshake,
  Zap,
  MessageSquare,
  ThumbsUp
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
  siteConfig?: any;
  reviewsData?: any;
}

function LangSwitcher({ lang, setLang }: { lang: 'de' | 'fr'; setLang: (l: 'de' | 'fr') => void }) {
  return (
    <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-2xl px-3 py-1 rounded-full border border-white/10 ring-1 ring-white/10 shadow-2xl">
      <Languages className="w-3.5 h-3.5 text-zinc-400" />
      <button
        onClick={() => setLang('de')}
        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
          lang === 'de' ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/30' : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        DE
      </button>
      <span className="text-zinc-700 font-light">|</span>
      <button
        onClick={() => setLang('fr')}
        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
          lang === 'fr' ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/30' : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        FR
      </button>
    </div>
  );
}

// Google 真实优质客户评价墙组件
function GoogleReviewsBentoWall({ 
  lang, 
  rating, 
  reviewCount, 
  accentBg, 
  reviews 
}: { 
  lang: 'de' | 'fr'; 
  rating: string; 
  reviewCount: number; 
  accentBg: string; 
  reviews: { name: string; date: string; stars: number; de: string; fr: string }[] 
}) {
  return (
    <section className="py-12 max-w-7xl mx-auto px-6 space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-full text-amber-300 text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{rating} / 5.0 Google Reviews</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
            {lang === 'de' ? 'Echte Kundenbewertungen' : 'Avis Clients Vérifiés'}
          </h2>
        </div>
        <span className="text-xs text-zinc-400 font-mono hidden sm:inline">{reviewCount} {lang === 'de' ? 'Verifizierte Rezensionen' : 'avis vérifiés'}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev, idx) => (
          <div key={idx} className="backdrop-blur-xl bg-white/[0.03] border border-white/10 ring-1 ring-white/5 p-6 rounded-3xl space-y-4 hover:border-white/20 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex text-amber-400 gap-0.5">
                  {Array.from({ length: rev.stars }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">{rev.date}</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed italic">
                "{lang === 'de' ? rev.de : rev.fr}"
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full ${accentBg} text-black font-bold text-xs flex items-center justify-center shadow-md`}>
                {rev.name.charAt(0)}
              </div>
              <div>
                <div className="text-xs font-bold text-white">{rev.name}</div>
                <div className="text-[10px] text-zinc-400">Google Local Guide · Biel/Bienne</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
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
  reviewCount,
  siteConfig,
  reviewsData
}: TenantProps) {
  const [lang, setLang] = useState<'de' | 'fr'>('de');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', note: '' });

  // 深度尝试优先提取标准 Schema 动态数据
  const dynamicContent = siteConfig?.content?.[lang] || siteConfig?.content?.de;
  const heroTitle = dynamicContent?.hero?.title;
  const heroSubtitle = dynamicContent?.hero?.subtitle;
  const dynamicServices = siteConfig?.entities?.services;
  const dynamicReviews = siteConfig?.entities?.reviews;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.phone) {
      setFormSubmitted(true);
    }
  };

  const images = {
    bakery: {
      hero: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
      p1: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
      p2: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=800&q=80',
      p3: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    },
    hair_salon: {
      hero: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
      p1: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
      p2: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80',
      p3: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80',
    },
    dentist: {
      hero: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
      p1: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80',
      p2: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=800&q=80',
      p3: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80',
    },
    sanitaer: {
      hero: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1200&q=80',
      p1: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
      p2: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
      p3: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    },
    cafe: {
      hero: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
      p1: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
      p2: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      p3: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
    }
  };

  const imgSet = images[category as keyof typeof images] || images.cafe;

  if (category === 'bakery') {
    const bakeryReviews = dynamicReviews || [
      {
        name: 'Marc S.',
        date: 'Vor 2 Wochen',
        stars: 5,
        de: 'Das Buttergipfeli ist absolut legendär in Biel! Jedes Mal frischer Sauerteig und sehr freundliches Personal.',
        fr: 'Le meilleur croissant au beurre de Biel! Pain au levain toujours frais et service très chaleureux.'
      },
      {
        name: 'Sophie L.',
        date: 'Vor 1 Monat',
        stars: 5,
        de: 'Wunderbare kleine Handwerksbäckerei. Die Urdinkel-Brote halten tagelang frisch.',
        fr: 'Excellente boulangerie artisanale. Les pains à l\'épeautre restent frais pendant plusieurs jours.'
      }
    ];

    return (
      <div className="min-h-screen bg-[#0f0c09] text-[#f7f2ea] font-sans relative overflow-x-hidden selection:bg-amber-400 selection:text-black">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-600/15 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="border-b border-white/10 bg-black/40 backdrop-blur-xl py-2.5 px-6 flex items-center justify-between text-xs text-amber-200/80">
          <div className="flex items-center gap-2 tracking-wide font-medium">
            <Croissant className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>{lang === 'de' ? `Traditionelle Schweizer Handwerksbäckerei · ${city}` : `Boulangerie artisanale traditionnelle · ${city}`}</span>
          </div>
          <LangSwitcher lang={lang} setLang={setLang} />
        </div>

        <header className="border-b border-white/10 bg-[#0f0c09]/80 backdrop-blur-2xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-black font-serif text-2xl font-black flex items-center justify-center shadow-lg shadow-amber-500/20">
                {name.charAt(0)}
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-amber-100">{name}</span>
            </div>
            <a href={`tel:${phone}`} className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-amber-500/20 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5" />
              <span>{phone}</span>
            </a>
          </div>
        </header>

        <section className="py-16 px-6 max-w-7xl mx-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-7 backdrop-blur-2xl bg-white/[0.03] border border-white/10 ring-1 ring-white/5 p-8 sm:p-12 rounded-3xl space-y-8 flex flex-col justify-between relative overflow-hidden group">
              <div className="space-y-6 relative z-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lang === 'de' ? '100% Natursauerteig & Schweizer Mehl' : '100% Levain Naturel & Farine Suisse'}</span>
                </div>
                <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight leading-[1.08] text-white">
                  {heroTitle || (lang === 'de' ? 'Täglich frisch aus dem Steinbackofen' : 'Frais du four à pierre chaque matin')}
                </h1>
                <p className="text-base sm:text-lg text-amber-200/70 font-light leading-relaxed max-w-xl">
                  {heroSubtitle || (lang === 'de' ? `Seit Jahren Ihr vertrauter Bäcker in ${city}. Wir backen täglich ab 05:30 Uhr mit echter Schweizer Butter.` : `Votre boulanger de confiance à ${city}. Cuisson quotidienne dès 05h30.`)}
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-sm">
                    {rating}★
                  </div>
                  <div>
                    <div className="text-sm font-bold text-amber-100">{rating} / 5.0 Google Rating</div>
                    <div className="text-xs text-amber-200/60">{reviewCount} {lang === 'de' ? 'echte Kundenbewertungen' : 'avis clients vérifiés'}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative rounded-3xl overflow-hidden border border-white/10 ring-1 ring-white/5 min-h-[380px] group">
              <img src={imgSet.hero} alt="Bakery" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl backdrop-blur-xl bg-black/80 border border-white/10 ring-1 ring-white/5 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">Ofenfrisch Garant</span>
                <p className="text-sm font-serif font-bold text-amber-100">{name} · {city}</p>
                <p className="text-xs text-zinc-400">{address}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Services Grid from Standard Schema */}
        <section className="py-16 max-w-7xl mx-auto px-6 space-y-8">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">{lang === 'de' ? 'Unsere Handwerks-Spezialitäten' : 'Nos Spécialités Artisanales'}</h2>
            <span className="text-xs text-amber-400 font-mono">CH-Standard Schema</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(dynamicServices || [
              { name: { de: 'Schweizer Buttergipfeli', fr: 'Croissants au Beurre' }, description: { de: 'Knusprig gebacken mit 100% echter Schweizer Butter.', fr: 'Feuilleté parfait au pur beurre.' }, price: { amount: '2.80', currency: 'CHF' }, img: imgSet.p1 },
              { name: { de: 'Feine Schweizer Pâtisserie', fr: 'Pâtisserie Fine' }, description: { de: 'Fruchttörtchen & Desserts für Ihre Feste.', fr: 'Créations gourmandes.' }, price: { amount: '5.20', currency: 'CHF' }, img: imgSet.p2 },
              { name: { de: 'Urdinkel & Sauerteigbrot', fr: 'Pain au Levain' }, description: { de: 'Lange Teigruhe für optimale Bekömmlichkeit.', fr: 'Fermentation lente.' }, price: { amount: '6.50', currency: 'CHF' }, img: imgSet.p3 }
            ]).map((srv: any, idx: number) => (
              <div key={idx} className="backdrop-blur-xl bg-white/[0.03] border border-white/10 ring-1 ring-white/5 p-6 rounded-3xl space-y-4 hover:border-amber-400/50 transition-all duration-500">
                <div className="h-48 rounded-2xl overflow-hidden">
                  <img src={srv.img || [imgSet.p1, imgSet.p2, imgSet.p3][idx % 3]} alt="Service" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-serif font-bold text-amber-100">{srv.name?.[lang] || srv.name?.de || srv.name}</h3>
                  {srv.price?.amount && <span className="text-xs font-mono text-amber-400 font-bold">{srv.price.currency || 'CHF'} {srv.price.amount}</span>}
                </div>
                <p className="text-xs text-amber-200/60 leading-relaxed">{srv.description?.[lang] || srv.description?.de || srv.description}</p>
              </div>
            ))}
          </div>
        </section>

        <GoogleReviewsBentoWall 
          lang={lang} 
          rating={rating} 
          reviewCount={reviewCount} 
          accentBg="bg-amber-400" 
          reviews={bakeryReviews} 
        />

        <footer className="py-12 text-center text-xs text-amber-200/50 font-mono">
          <p>{name} · {address} · Tel: {phone}</p>
        </footer>
      </div>
    );
  }

  // 默认统一模版处理其他全量行业
  return (
    <div className="min-h-screen bg-[#0a0f1d] text-[#f8fafc] font-sans relative overflow-x-hidden selection:bg-cyan-400 selection:text-black">
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-cyan-950/20 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="bg-black/40 border-b border-white/10 text-xs py-2.5 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono text-cyan-300">
          <Building2 className="w-4 h-4" />
          <span>{name} · {city} ({canton})</span>
        </div>
        <LangSwitcher lang={lang} setLang={setLang} />
      </div>

      <header className="border-b border-white/10 bg-[#0a0f1d]/80 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <span className="font-bold text-2xl text-white">{name}</span>
          <a href={`tel:${phone}`} className="px-6 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-black font-black text-xs uppercase tracking-wider rounded-xl transition shadow-xl shadow-cyan-500/20">
            {phone}
          </a>
        </div>
      </header>

      <section className="py-16 px-6 max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 backdrop-blur-2xl bg-white/[0.03] border border-white/10 ring-1 ring-white/5 p-8 sm:p-12 rounded-3xl space-y-6">
            <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight">
              {heroTitle || (lang === 'de' ? `Exzellenz & Qualität in ${city}` : `Excellence et Qualité à ${city}`)}
            </h1>
            <p className="text-base text-slate-300 font-light leading-relaxed">
              {heroSubtitle || (lang === 'de' ? `Ihr vertrauter Partner in ${city}. Wir garantieren höchste Schweizer Qualitätsstandards.` : `Votre partenaire de confiance à ${city}.`)}
            </p>
            <div className="pt-4 border-t border-white/10 flex items-center gap-4 text-cyan-300 font-bold">
              <span>{rating} ★ Google Local Guide Verified ({reviewCount} {lang === 'de' ? 'Bewertungen' : 'avis'})</span>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-3xl overflow-hidden border border-white/10 ring-1 ring-white/5">
            <img src={imgSet.hero} alt="Business" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Dynamic Services Section */}
      <section className="py-16 max-w-7xl mx-auto px-6 space-y-6">
        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-4">{lang === 'de' ? 'Unsere Leistungen' : 'Nos Services'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(dynamicServices || [
            { name: { de: 'Premium Leistung', fr: 'Service Premium' }, description: { de: 'Erstklassige Schweizer Ausführung.', fr: 'Exécution suisse de qualité.' }, price: { amount: '45.00', currency: 'CHF' } }
          ]).map((srv: any, idx: number) => (
            <div key={idx} className="backdrop-blur-xl bg-white/[0.03] border border-white/10 ring-1 ring-white/5 p-6 rounded-2xl space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-white">{srv.name?.[lang] || srv.name?.de || srv.name}</h3>
                {srv.price?.amount && <span className="text-xs font-mono text-cyan-300 font-bold">{srv.price.currency || 'CHF'} {srv.price.amount}</span>}
              </div>
              <p className="text-xs text-slate-400">{srv.description?.[lang] || srv.description?.de || srv.description}</p>
            </div>
          ))}
        </div>
      </section>

      <GoogleReviewsBentoWall 
        lang={lang} 
        rating={rating} 
        reviewCount={reviewCount} 
        accentBg="bg-cyan-400" 
        reviews={dynamicReviews || [
          { name: 'Marc S.', date: 'Vor 2 Wochen', stars: 5, de: `Hervorragender Service bei ${name}!`, fr: `Excellent service chez ${name}!` }
        ]} 
      />

      <footer className="py-12 text-center text-xs text-slate-500 font-mono">
        <p>{name} · {address} · Tel: {phone}</p>
      </footer>
    </div>
  );
}
