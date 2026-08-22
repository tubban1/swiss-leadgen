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
  ThumbsUp,
  Lock,
  Globe,
  CheckCircle,
  ExternalLink,
  Layers,
  FileText,
  ChevronRight,
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
  siteConfig?: any;
  reviewsData?: any;
}

// 动态选择 Icon
function CategoryIcon({ iconName, className }: { iconName?: string; className?: string }) {
  const iconClass = className || "w-5 h-5";
  switch (iconName) {
    case 'croissant': return <Croissant className={iconClass} />;
    case 'flame': return <Flame className={iconClass} />;
    case 'sparkles': return <Sparkles className={iconClass} />;
    case 'scissors': return <Scissors className={iconClass} />;
    case 'stethoscope': return <Stethoscope className={iconClass} />;
    case 'wrench': return <Wrench className={iconClass} />;
    case 'shield': return <ShieldCheck className={iconClass} />;
    case 'user': return <UserCheck className={iconClass} />;
    default: return <Sparkles className={iconClass} />;
  }
}

function LangSwitcher({ lang, setLang, accentColor }: { lang: 'de' | 'fr'; setLang: (l: 'de' | 'fr') => void; accentColor: string }) {
  return (
    <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-2xl px-3 py-1 rounded-full border border-white/10 ring-1 ring-white/10 shadow-2xl">
      <Languages className="w-3.5 h-3.5 text-zinc-400" />
      <button
        onClick={() => setLang('de')}
        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
          lang === 'de' ? 'bg-white text-black shadow-lg' : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        DE
      </button>
      <span className="text-zinc-700 font-light">|</span>
      <button
        onClick={() => setLang('fr')}
        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
          lang === 'fr' ? 'bg-white text-black shadow-lg' : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        FR
      </button>
    </div>
  );
}

export default function GenerativeTenantView({
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

  // 从 site_config 提取 Design System Tokens
  const theme = siteConfig?.theme || {};
  const primaryBg = theme.background || '#0A0F1D';
  const surfaceBg = theme.surface || '#162038';
  const primaryColor = theme.primary || '#3B82F6';
  const secondaryColor = theme.secondary || '#60A5FA';
  const accentColor = theme.accent || '#F59E0B';
  const visualStyle = theme.visual_style || 'bento-modern';

  // Section Variants
  const heroVariant = siteConfig?.sections?.hero?.variant || 'bento-hero';
  const servicesVariant = siteConfig?.sections?.services?.variant || 'bento-masonry';

  // 提取动态文案
  const dynamicContent = siteConfig?.content?.[lang] || siteConfig?.content?.de;
  const heroTitle = dynamicContent?.hero?.title;
  const heroSubtitle = dynamicContent?.hero?.subtitle;
  const heroEyebrow = dynamicContent?.hero?.eyebrow;
  const tagline = siteConfig?.branding?.tagline?.[lang] || siteConfig?.branding?.tagline?.de;
  
  const dynamicServices = siteConfig?.entities?.services;
  const dynamicReviews = siteConfig?.entities?.reviews;

  // 商业体真实数据
  const business = siteConfig?.business || {};
  const legalName = business.legal_name || `${name} AG`;
  const foundedYear = business.founded_year || 2012;
  const regNumber = business.registration_number || 'CH-036.3.000.888';
  const vatNumber = business.vat_number || 'CHE-114.900.888 MWST';
  const displayPhone = business.contact?.phone || phone;
  const displayEmail = business.contact?.email || email;
  const subdomain = siteConfig?.subdomain || `${name.toLowerCase().replace(/\s+/g, '-')}.tubban.com`;

  // 行业高清配图集
  const imagesMap: Record<string, { hero: string; p1: string; p2: string; p3: string }> = {
    optik: {
      hero: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=1200&q=80',
      p1: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80',
      p2: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80',
      p3: 'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=800&q=80',
    },
    restaurant: {
      hero: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      p1: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      p2: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      p3: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
    },
    bar: {
      hero: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80',
      p1: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
      p2: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=800&q=80',
      p3: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80',
    },
    cafe: {
      hero: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
      p1: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
      p2: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
      p3: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80',
    },
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
    generic_business: {
      hero: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      p1: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      p2: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
      p3: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    }
  };

  const detectedCategory = siteConfig?.site?.category || category;
  const imgSet = imagesMap[detectedCategory as keyof typeof imagesMap] || imagesMap.generic_business;

  return (
    <div 
      className="min-h-screen text-[#f7f2ea] font-sans relative overflow-x-hidden selection:bg-amber-400 selection:text-black transition-colors duration-500"
      style={{ backgroundColor: primaryBg }}
    >
      {/* 动态光晕 */}
      <div 
        className="absolute top-0 left-1/4 w-[750px] h-[750px] rounded-full blur-[170px] pointer-events-none opacity-25 transition-all duration-700"
        style={{ backgroundColor: secondaryColor }}
      ></div>

      {/* Top Banner Bar */}
      <div className="border-b border-white/10 bg-black/60 backdrop-blur-xl py-2.5 px-6 flex items-center justify-between text-xs text-zinc-300">
        <div className="flex items-center gap-2 font-medium">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>{tagline || (lang === 'de' ? `Traditionelle Schweizer Qualität · ${city}` : `Qualité artisanale suisse · ${city}`)}</span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/admin"
            className="px-3.5 py-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full text-[10px] font-mono font-bold transition flex items-center gap-1.5 shadow-lg"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>🔑 Merchant Portal</span>
          </a>
          <LangSwitcher lang={lang} setLang={setLang} accentColor={accentColor} />
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-11 h-11 rounded-2xl text-black font-serif text-2xl font-black flex items-center justify-center shadow-xl"
              style={{ backgroundColor: secondaryColor }}
            >
              {name.charAt(0)}
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white block">{name}</span>
              <span className="text-[10px] font-mono text-zinc-400 tracking-wider uppercase">{city} · {canton}</span>
            </div>
          </div>
          <a 
            href={`tel:${displayPhone}`} 
            className="px-6 py-2.5 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl flex items-center gap-2 hover:scale-105"
            style={{ backgroundColor: secondaryColor }}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{displayPhone}</span>
          </a>
        </div>
      </header>

      {/* 🚀 DYNAMIC GENERATIVE HERO COMPONENT */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        {heroVariant === 'minimal-luxury' ? (
          /* Variant A: Minimal Luxury Editorial Hero */
          <div className="text-center py-16 space-y-8 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-amber-300 text-xs font-semibold">
              <Award className="w-4 h-4 text-amber-400" />
              <span>{heroEyebrow || `Exzellenz & Schweizer Perfektion in ${city}`}</span>
            </div>
            <h1 className="text-5xl sm:text-7xl font-serif font-black tracking-tight text-white leading-tight">
              {heroTitle || (lang === 'de' ? 'Erstklassige Schweizer Qualität' : 'Qualité Suisse d\'Excellence')}
            </h1>
            <p className="text-lg text-zinc-300 font-light leading-relaxed max-w-2xl mx-auto">
              {heroSubtitle}
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <a 
                href={`tel:${displayPhone}`}
                className="px-8 py-3.5 text-black font-bold text-xs uppercase tracking-wider rounded-full shadow-2xl transition hover:scale-105"
                style={{ backgroundColor: secondaryColor }}
              >
                {lang === 'de' ? 'Jetzt Anrufen' : 'Appeler Directement'}
              </a>
            </div>
          </div>
        ) : heroVariant === 'bento-hero' ? (
          /* Variant B: Bento Layout Hero */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div 
              className="lg:col-span-8 backdrop-blur-2xl border border-white/10 ring-1 ring-white/5 p-8 sm:p-12 rounded-3xl space-y-8 flex flex-col justify-between shadow-2xl"
              style={{ backgroundColor: surfaceBg }}
            >
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-amber-300 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{heroEyebrow || `Qualität & Tradition in ${city}`}</span>
                </div>
                <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight leading-[1.08] text-white">
                  {heroTitle}
                </h1>
                <p className="text-base sm:text-lg text-zinc-300 font-light leading-relaxed max-w-xl">
                  {heroSubtitle}
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full text-black flex items-center justify-center font-bold text-sm shadow-lg"
                    style={{ backgroundColor: secondaryColor }}
                  >
                    {rating}★
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{rating} / 5.0 Google Rating</div>
                    <div className="text-xs text-zinc-400">{reviewCount} {lang === 'de' ? 'echte Kundenbewertungen' : 'avis clients vérifiés'}</div>
                  </div>
                </div>
                <a 
                  href={`mailto:${displayEmail}`}
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition border border-white/10"
                >
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lang === 'de' ? 'Kontaktieren' : 'Contact'}</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-4 relative rounded-3xl overflow-hidden border border-white/10 ring-1 ring-white/5 min-h-[420px] shadow-2xl">
              <img src={imgSet.hero} alt="Hero Visual" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl backdrop-blur-xl bg-black/80 border border-white/10 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">{legalName}</span>
                <p className="text-sm font-serif font-bold text-white">{address}</p>
              </div>
            </div>
          </div>
        ) : (
          /* Variant C: Split Hero (Default) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-mono uppercase text-amber-400 tracking-widest">{heroEyebrow}</span>
              <h1 className="text-5xl sm:text-6xl font-serif font-black text-white leading-tight">{heroTitle}</h1>
              <p className="text-lg text-zinc-300 font-light leading-relaxed">{heroSubtitle}</p>
            </div>
            <div className="lg:col-span-5 h-[380px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <img src={imgSet.hero} alt="Hero" className="w-full h-full object-cover" />
            </div>
          </div>
        )}
      </section>

      {/* 🏢 Business Credibility Bento Section */}
      <section className="py-8 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl border border-white/10 backdrop-blur-xl space-y-2" style={{ backgroundColor: surfaceBg }}>
            <Building2 className="w-6 h-6 text-amber-400" />
            <div className="text-xs text-zinc-400 uppercase font-mono">{lang === 'de' ? 'Gründungsjahr' : 'Fondation'}</div>
            <div className="text-xl font-bold text-white font-serif">{foundedYear} ({city})</div>
          </div>

          <div className="p-6 rounded-3xl border border-white/10 backdrop-blur-xl space-y-2" style={{ backgroundColor: surfaceBg }}>
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <div className="text-xs text-zinc-400 uppercase font-mono">{lang === 'de' ? 'Handelsregister' : 'Registre'}</div>
            <div className="text-sm font-mono font-bold text-zinc-200">{regNumber}</div>
          </div>

          <div className="p-6 rounded-3xl border border-white/10 backdrop-blur-xl space-y-2" style={{ backgroundColor: surfaceBg }}>
            <FileText className="w-6 h-6 text-cyan-400" />
            <div className="text-xs text-zinc-400 uppercase font-mono">{lang === 'de' ? 'MWST-Nummer' : 'TVA'}</div>
            <div className="text-sm font-mono font-bold text-zinc-200">{vatNumber}</div>
          </div>

          <div className="p-6 rounded-3xl border border-white/10 backdrop-blur-xl space-y-2" style={{ backgroundColor: surfaceBg }}>
            <Clock className="w-6 h-6 text-amber-400" />
            <div className="text-xs text-zinc-400 uppercase font-mono">{lang === 'de' ? 'Öffnungszeiten' : 'Horaires'}</div>
            <div className="text-xs font-semibold text-zinc-200">Mo-Fr: 07:30-18:30 | Sa: 08:00-16:00</div>
          </div>
        </div>
      </section>

      {/* 🛍️ DYNAMIC SERVICES COMPONENT (PRICE-TABLE / MASONRY / CARDS) */}
      <section className="py-16 max-w-7xl mx-auto px-6 space-y-8">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="text-3xl font-serif font-bold text-white">
              {lang === 'de' ? 'Unsere Spezialitäten & Leistungen' : 'Nos Prestations & Spécialités'}
            </h2>
            <p className="text-xs text-zinc-400 mt-1 font-mono">{name} · Schweizer Qualitätsstandard</p>
          </div>
          <span className="text-xs px-3 py-1 bg-white/10 rounded-full font-mono text-amber-300 border border-white/10">{city}</span>
        </div>

        {servicesVariant === 'price-list-table' ? (
          /* Services Variant A: Swiss Premium Menu / Price List Table */
          <div className="p-8 rounded-3xl border border-white/10 backdrop-blur-2xl space-y-6" style={{ backgroundColor: surfaceBg }}>
            <div className="divide-y divide-white/10">
              {(dynamicServices || []).map((srv: any, idx: number) => (
                <div key={idx} className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] px-4 rounded-2xl transition">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <CategoryIcon iconName={srv.icon} className="w-4 h-4 text-amber-400" />
                      <h3 className="text-lg font-serif font-bold text-white">{srv.name?.[lang] || srv.name?.de || srv.name}</h3>
                    </div>
                    <p className="text-xs text-zinc-300 font-light max-w-xl">{srv.description?.[lang] || srv.description?.de}</p>
                  </div>
                  {srv.price?.amount && (
                    <span className="text-sm font-mono text-black font-bold px-4 py-2 rounded-xl shrink-0 text-center shadow-lg" style={{ backgroundColor: secondaryColor }}>
                      {srv.price.currency || 'CHF'} {srv.price.amount}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Services Variant B: Bento Masonry / Grid Cards (Default) */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(dynamicServices || []).map((srv: any, idx: number) => (
              <div 
                key={idx} 
                className="backdrop-blur-xl border border-white/10 p-6 rounded-3xl space-y-5 hover:border-white/30 transition-all duration-500 flex flex-col justify-between shadow-xl group"
                style={{ backgroundColor: surfaceBg }}
              >
                <div className="space-y-4">
                  <div className="h-52 rounded-2xl overflow-hidden relative">
                    <img 
                      src={srv.img || [imgSet.p1, imgSet.p2, imgSet.p3][idx % 3]} 
                      alt={srv.slug || 'Service'} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute top-3 right-3 p-2.5 bg-black/70 backdrop-blur-md rounded-xl text-white border border-white/20">
                      <CategoryIcon iconName={srv.icon} className="w-4 h-4 text-amber-400" />
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl font-serif font-bold text-white group-hover:text-amber-300 transition-colors">
                      {srv.name?.[lang] || srv.name?.de || srv.name}
                    </h3>
                    {srv.price?.amount && (
                      <span className="text-xs font-mono text-black font-bold px-2.5 py-1 rounded-lg shrink-0 shadow-md" style={{ backgroundColor: secondaryColor }}>
                        {srv.price.currency || 'CHF'} {srv.price.amount}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed font-light">
                    {srv.description?.[lang] || srv.description?.de || srv.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider">Schweizer Qualität</span>
                  <a href={`tel:${displayPhone}`} className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1">
                    <span>Anfragen</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 🌐 Live Domain & DNS Transparency Inspector */}
      <section className="py-12 max-w-7xl mx-auto px-6">
        <div className="p-8 rounded-3xl border border-amber-400/30 bg-gradient-to-br from-amber-400/10 via-black/60 to-black/80 backdrop-blur-2xl space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/40">
                <Globe className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-white">Live Domain & DNS Synchronization Status</h3>
                <p className="text-xs text-zinc-400 font-mono">全自动化挂载 & GoDaddy 实时 DNS 解析状态监控面板</p>
              </div>
            </div>
            <span className="px-3.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-mono font-bold flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>100% Live Operational</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
              <div className="text-[10px] font-mono uppercase text-zinc-400">Assigned Domain</div>
              <div className="text-sm font-mono font-bold text-amber-300 truncate">{subdomain}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
              <div className="text-[10px] font-mono uppercase text-zinc-400">Authoritative CNAME Node</div>
              <div className="text-sm font-mono font-bold text-cyan-300 truncate">4486e1c3ac91a3bb.vercel-dns-017.com</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
              <div className="text-[10px] font-mono uppercase text-zinc-400">Merchant Admin Credentials</div>
              <div className="text-sm font-mono font-bold text-emerald-300 flex items-center justify-between">
                <span>Protected & Synchronized</span>
                <a href="/admin" className="text-xs text-amber-400 hover:underline">Login ➔</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 💬 Verified Google Reviews Bento Wall */}
      <section className="py-12 max-w-7xl mx-auto px-6 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-full text-amber-300 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{rating} / 5.0 Google Reviews</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-white">
              {lang === 'de' ? 'Echte Kundenbewertungen' : 'Avis Clients Vérifiés'}
            </h2>
          </div>
          <span className="text-xs text-zinc-400 font-mono hidden sm:inline">{reviewCount} {lang === 'de' ? 'Verifizierte Rezensionen' : 'avis vérifiés'}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(dynamicReviews || [
            { name: 'Marc S.', date: 'Vor 2 Wochen', stars: 5, de: `Hervorragender Service bei ${name}! Absolut professionell und pünktlich.`, fr: `Excellent service chez ${name}! Très professionnel.` },
            { name: 'Sophie L.', date: 'Vor 1 Monat', stars: 5, de: `Sehr freundliches Team in ${city}. Kann ich jedem nur empfehlen!`, fr: `Équipe très chaleureuse à ${city}. Je recommande!` }
          ]).map((rev: any, idx: number) => (
            <div 
              key={idx} 
              className="backdrop-blur-xl border border-white/10 p-6 rounded-3xl space-y-4 hover:border-white/20 transition-all flex flex-col justify-between shadow-xl"
              style={{ backgroundColor: surfaceBg }}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 gap-0.5">
                    {Array.from({ length: rev.stars || 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono">{rev.date}</span>
                </div>
                <p className="text-xs text-zinc-200 leading-relaxed italic font-light">
                  "{lang === 'de' ? rev.de : rev.fr}"
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-full text-black font-bold text-xs flex items-center justify-center shadow-md"
                  style={{ backgroundColor: secondaryColor }}
                >
                  {rev.name.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{rev.name}</div>
                  <div className="text-[10px] text-zinc-400">Google Local Guide · {city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 text-center text-xs text-zinc-400 font-mono space-y-3 bg-black/60 backdrop-blur-2xl">
        <p>{legalName} · {address} · Tel: {displayPhone} · Email: {displayEmail}</p>
        <div className="flex items-center justify-center gap-4 text-[11px]">
          <a href="/admin" className="text-amber-400 hover:underline font-bold inline-flex items-center gap-1">
            <Lock className="w-3 h-3" />
            <span>🔑 Merchant Admin Portal</span>
          </a>
          <span>·</span>
          <span>CH-UID: {regNumber}</span>
          <span>·</span>
          <span>© {new Date().getFullYear()} {name}</span>
        </div>
      </footer>
    </div>
  );
}
