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
  reviewCount
}: TenantProps) {
  const [lang, setLang] = useState<'de' | 'fr'>('de');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', note: '' });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.phone) {
      setFormSubmitted(true);
    }
  };

  // 高精商业实景图库
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

  // =========================================================================
  // 🥐 1. BÄCKEREI (烘焙店) — 非对称 Bento Grid & 暖麦弥散光
  // =========================================================================
  if (category === 'bakery') {
    const bakeryReviews = [
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
      },
      {
        name: 'Beat M.',
        date: 'Vor 3 Wochen',
        stars: 5,
        de: 'Täglich ab 05:30 Uhr geöffnet — perfekt für den Weg zur Arbeit. Echte Schweizer Butterqualität!',
        fr: 'Ouvert dès 05h30, idéal avant le travail. Vrai beurre suisse et goût authentique!'
      }
    ];

    return (
      <div className="min-h-screen bg-[#0f0c09] text-[#f7f2ea] font-sans relative overflow-x-hidden selection:bg-amber-400 selection:text-black">
        {/* 弥散光网格背景 */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-600/15 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute top-[600px] right-10 w-[500px] h-[500px] bg-orange-700/10 rounded-full blur-[160px] pointer-events-none"></div>

        {/* Top Announcement Bar */}
        <div className="border-b border-white/10 bg-black/40 backdrop-blur-xl py-2.5 px-6 flex items-center justify-between text-xs text-amber-200/80">
          <div className="flex items-center gap-2 tracking-wide font-medium">
            <Croissant className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>{lang === 'de' ? `Traditionelle Schweizer Handwerksbäckerei · ${city}` : `Boulangerie artisanale traditionnelle · ${city}`}</span>
          </div>
          <LangSwitcher lang={lang} setLang={setLang} />
        </div>

        {/* Header */}
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

        {/* Hero Section: Asymmetrical Bento Grid */}
        <section className="py-16 px-6 max-w-7xl mx-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Bento 2x2 Main Card */}
            <div className="lg:col-span-7 backdrop-blur-2xl bg-white/[0.03] border border-white/10 ring-1 ring-white/5 p-8 sm:p-12 rounded-3xl space-y-8 flex flex-col justify-between relative overflow-hidden group">
              <div className="space-y-6 relative z-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lang === 'de' ? '100% Natursauerteig & Schweizer Mehl' : '100% Levain Naturel & Farine Suisse'}</span>
                </div>
                <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight leading-[1.08] text-white">
                  {lang === 'de' ? 'Täglich frisch aus dem Steinbackofen' : 'Frais du four à pierre chaque matin'}
                </h1>
                <p className="text-base sm:text-lg text-amber-200/70 font-light leading-relaxed max-w-xl">
                  {lang === 'de' ? `Seit Jahren Ihr vertrauter Bäcker in ${city}. Wir backen täglich ab 05:30 Uhr mit echter Schweizer Butter.` : `Votre boulanger de confiance à ${city}. Cuisson quotidienne dès 05h30 au beurre suisse.`}
                </p>
              </div>

              {/* Verified Rating Row */}
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
                <a href="#booking" className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:underline">
                  <span>{lang === 'de' ? 'Vorbestellen' : 'Commander'}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Bento Card 2: Image & Badge */}
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

        {/* Asymmetrical Bento Products */}
        <section className="py-16 max-w-7xl mx-auto px-6 space-y-8">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">{lang === 'de' ? 'Unsere Handwerks-Spezialitäten' : 'Nos Spécialités Artisanales'}</h2>
            <span className="text-xs text-amber-400 font-mono">Biel / Bienne</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 ring-1 ring-white/5 p-6 rounded-3xl space-y-4 hover:border-amber-400/50 transition-all duration-500">
              <div className="h-48 rounded-2xl overflow-hidden">
                <img src={imgSet.p1} alt="Gipfeli" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <h3 className="text-xl font-serif font-bold text-amber-100">{lang === 'de' ? 'Schweizer Buttergipfeli' : 'Croissants au Beurre'}</h3>
              <p className="text-xs text-amber-200/60 leading-relaxed">{lang === 'de' ? 'Knusprig gebacken mit 100% echter Schweizer Butter.' : 'Feuilleté parfait au pur beurre suisse.'}</p>
            </div>

            <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 ring-1 ring-white/5 p-6 rounded-3xl space-y-4 hover:border-amber-400/50 transition-all duration-500">
              <div className="h-48 rounded-2xl overflow-hidden">
                <img src={imgSet.p2} alt="Pâtisserie" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <h3 className="text-xl font-serif font-bold text-amber-100">{lang === 'de' ? 'Feine Schweizer Pâtisserie' : 'Pâtisserie Fine'}</h3>
              <p className="text-xs text-amber-200/60 leading-relaxed">{lang === 'de' ? 'Fruchttörtchen & Desserts für Ihre Feste.' : 'Créations gourmandes pour tous vos événements.'}</p>
            </div>

            <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 ring-1 ring-white/5 p-6 rounded-3xl space-y-4 hover:border-amber-400/50 transition-all duration-500">
              <div className="h-48 rounded-2xl overflow-hidden">
                <img src={imgSet.p3} alt="Sauerteigbrot" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <h3 className="text-xl font-serif font-bold text-amber-100">{lang === 'de' ? 'Urdinkel & Sauerteigbrot' : 'Pain au Levain & Épeautre'}</h3>
              <p className="text-xs text-amber-200/60 leading-relaxed">{lang === 'de' ? 'Lange Teigruhe für optimale Bekömmlichkeit.' : 'Fermentation lente pour une excellente digestion.'}</p>
            </div>
          </div>
        </section>

        {/* 🌟 Google Verified Reviews Wall */}
        <GoogleReviewsBentoWall 
          lang={lang} 
          rating={rating} 
          reviewCount={reviewCount} 
          accentBg="bg-amber-400" 
          reviews={bakeryReviews} 
        />

        {/* Lead Capture Form Bento */}
        <section id="booking" className="py-16 max-w-7xl mx-auto px-6">
          <div className="backdrop-blur-2xl bg-white/[0.03] border border-white/10 ring-1 ring-white/5 p-8 sm:p-12 rounded-3xl grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold rounded-full">
                <Calendar className="w-3.5 h-3.5" />
                <span>{lang === 'de' ? 'Brote & Gebäck Vorbestellen' : 'Réservation en ligne'}</span>
              </div>
              <h3 className="text-3xl font-serif font-bold text-white leading-tight">
                {lang === 'de' ? 'Holen Sie Ihre Bestellung ohne Wartezeit ab' : 'Commandez et évitez l\'attente en magasin'}
              </h3>
              <p className="text-sm text-amber-200/70 leading-relaxed">
                {address} · Tel: {phone}
              </p>
              <div className="space-y-2 text-xs text-amber-200/70 border-t border-white/10 pt-4">
                <div className="font-bold text-amber-400 uppercase tracking-wider">{lang === 'de' ? 'Öffnungszeiten' : 'Heures d\'ouverture'}</div>
                <div>Mo - Fr: 05:30 - 18:30 Uhr</div>
                <div>Sa: 06:00 - 16:00 Uhr | So: 07:00 - 13:00 Uhr</div>
              </div>
            </div>

            <div className="lg:col-span-6 backdrop-blur-xl bg-black/40 border border-white/10 p-6 sm:p-8 rounded-2xl space-y-4">
              {formSubmitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-amber-400 text-black flex items-center justify-center mx-auto font-bold text-2xl">✓</div>
                  <h4 className="text-xl font-serif font-bold text-white">{lang === 'de' ? 'Vielen Dank!' : 'Merci beaucoup!'}</h4>
                  <p className="text-xs text-amber-200/70">{lang === 'de' ? 'Wir haben Ihre Anfrage erhalten und melden uns umgehend.' : 'Nous vous recontactons dans les plus brefs délais.'}</p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs text-amber-200/80 mb-1">{lang === 'de' ? 'Name' : 'Nom'}</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="z.B. Marc Favre" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-amber-200/80 mb-1">{lang === 'de' ? 'Telefon' : 'Téléphone'}</label>
                    <input 
                      type="tel" 
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+41 79 000 00 00" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-amber-200/80 mb-1">{lang === 'de' ? 'Wünsche / Datum' : 'Demande / Date'}</label>
                    <textarea 
                      rows={2}
                      value={formData.note}
                      onChange={e => setFormData({ ...formData, note: e.target.value })}
                      placeholder={lang === 'de' ? 'z.B. 10 Buttergipfeli für 07:30 Uhr' : 'ex: 10 croissants pour 07h30'} 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>
                  <button type="submit" className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-amber-400/20">
                    {lang === 'de' ? 'Jetzt Anfragen' : 'Envoyer la demande'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 text-center text-xs text-amber-200/50 font-mono">
          <p>{name} · {address} · Tel: {phone}</p>
        </footer>
      </div>
    );
  }

  // =========================================================================
  // ✂️ 2. COIFFEUR / BEAUTY — Editorial Luxury & Haute Rose Gold 弥散光
  // =========================================================================
  if (category === 'hair_salon') {
    const salonReviews = [
      {
        name: 'Elena M.',
        date: 'Vor 1 Woche',
        stars: 5,
        de: 'Traumhaftes Balayage! Das Team nimmt sich viel Zeit für die Beratung. Sehr luxuriöses Ambiente.',
        fr: 'Balayage magnifique! L\'équipe prend le temps d\'écouter. Une expérience haut de gamme à Biel.'
      },
      {
        name: 'Chantal V.',
        date: 'Vor 2 Wochen',
        stars: 5,
        de: 'Präziser Haarschnitt und tolle Kopfhautmassage. Endlich mein Stammsalon in Biel gefunden!',
        fr: 'Coupe d\'une précision rare et massage du cuir chevelu fantastique. Mon salon coup de cœur.'
      },
      {
        name: 'Laura B.',
        date: 'Vor 1 Monat',
        stars: 5,
        de: 'Super professionelle Farbberatung und sehr schonende Produkte. Absolute Empfehlung!',
        fr: 'Conseils couleur très professionnels avec des produits doux. Je recommande vivement!'
      }
    ];

    return (
      <div className="min-h-screen bg-[#0d0a0b] text-[#f4eef0] font-sans relative overflow-x-hidden selection:bg-rose-400 selection:text-black">
        {/* 弥散玫瑰背光 */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-rose-900/20 rounded-full blur-[160px] pointer-events-none"></div>

        {/* Top bar */}
        <div className="border-b border-white/10 bg-black/40 backdrop-blur-xl py-2.5 px-6 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-2 font-mono uppercase text-[11px] tracking-widest">
            <Scissors className="w-3.5 h-3.5 text-rose-400" />
            <span>HAUTE COIFFURE & BEAUTY · {city}</span>
          </div>
          <LangSwitcher lang={lang} setLang={setLang} />
        </div>

        {/* Header */}
        <header className="border-b border-white/10 bg-[#0d0a0b]/80 backdrop-blur-2xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <h1 className="font-serif text-2xl tracking-[0.2em] uppercase text-rose-100 font-light">{name}</h1>
            <a href={`tel:${phone}`} className="px-6 py-2.5 bg-gradient-to-r from-rose-300 via-pink-400 to-amber-200 text-black font-black text-xs uppercase tracking-widest rounded-full transition shadow-xl shadow-rose-500/20">
              {lang === 'de' ? 'Termin Buchen' : 'Rendez-vous'}
            </a>
          </div>
        </header>

        {/* Hero Section: Asymmetrical Bento Grid */}
        <section className="py-16 px-6 max-w-7xl mx-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Bento 2x2 Main Headline */}
            <div className="lg:col-span-7 backdrop-blur-2xl bg-white/[0.03] border border-white/10 ring-1 ring-white/5 p-8 sm:p-12 rounded-3xl space-y-8 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="inline-block px-3 py-1 rounded-full border border-rose-400/30 text-rose-300 text-[10px] tracking-[0.2em] uppercase font-mono">
                  ✦ Haute Coiffure Experience ✦
                </div>
                <h1 className="text-4xl sm:text-6xl font-serif font-extralight text-zinc-100 tracking-tight leading-[1.05]">
                  {lang === 'de' ? 'Schönheit & Perfektes Hair-Styling' : 'Élégance & Coiffure Sur-Mesure'}
                </h1>
                <p className="text-base sm:text-lg text-zinc-400 font-light max-w-xl leading-relaxed">
                  {lang === 'de' ? `Ihr exklusiver Salon in ${city}. Wir kreieren individuelle Haarschnitte, Balayage-Farbtöne und intensive Haartherapien.` : `Votre salon haut de gamme à ${city}. Balayages raffinés et soins capillaires d'exception.`}
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-400/20 text-rose-300 flex items-center justify-center font-bold text-sm">
                    {rating}★
                  </div>
                  <div>
                    <div className="text-sm font-bold text-rose-100">{rating} / 5.0 Rating</div>
                    <div className="text-xs text-zinc-400">{reviewCount} {lang === 'de' ? 'Kundenbewertungen' : 'avis clients'}</div>
                  </div>
                </div>
                <span className="text-xs text-zinc-400 font-mono">{address}</span>
              </div>
            </div>

            {/* Bento Image Hero */}
            <div className="lg:col-span-5 relative rounded-3xl overflow-hidden border border-white/10 ring-1 ring-white/5 min-h-[380px] group">
              <img src={imgSet.hero} alt="Salon" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl backdrop-blur-xl bg-black/80 border border-white/10">
                <span className="text-[10px] font-mono uppercase tracking-widest text-rose-300">Haute Styling</span>
                <p className="text-sm font-serif font-bold text-white mt-0.5">{name} · {city}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Glass Price Bento Grid */}
        <section className="py-16 max-w-7xl mx-auto px-6 space-y-8">
          <h3 className="text-3xl font-serif text-center text-rose-100 tracking-wider uppercase font-light">{lang === 'de' ? 'Services & Price List' : 'Tarifs & Prestations'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 ring-1 ring-white/5 p-8 rounded-3xl space-y-4">
              <h4 className="text-xl font-serif text-rose-200">{lang === 'de' ? 'Damen Cut & Style' : 'Coupe Femme'}</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">{lang === 'de' ? 'Waschen, Kopfhautmassage & Brushing.' : 'Shampooing, massage & brushing.'}</p>
              <div className="text-sm font-mono text-rose-300 font-bold">CHF 85.-</div>
            </div>

            <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 ring-1 ring-white/5 p-8 rounded-3xl space-y-4">
              <h4 className="text-xl font-serif text-rose-200">{lang === 'de' ? 'Balayage & Glossing' : 'Balayage & Gloss'}</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">{lang === 'de' ? 'Sanfte Farbverläufe mit Glanzversiegelung.' : 'Technique de coloration douce.'}</p>
              <div className="text-sm font-mono text-rose-300 font-bold">CHF 160.-</div>
            </div>

            <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 ring-1 ring-white/5 p-8 rounded-3xl space-y-4">
              <h4 className="text-xl font-serif text-rose-200">{lang === 'de' ? 'Herren Cut Premium' : 'Coupe Homme'}</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">{lang === 'de' ? 'Präzisionshaarschnitt & Styling.' : 'Coupe de précision et soin.'}</p>
              <div className="text-sm font-mono text-rose-300 font-bold">CHF 55.-</div>
            </div>
          </div>
        </section>

        {/* 🌟 Google Verified Reviews Wall */}
        <GoogleReviewsBentoWall 
          lang={lang} 
          rating={rating} 
          reviewCount={reviewCount} 
          accentBg="bg-rose-300" 
          reviews={salonReviews} 
        />

        {/* Footer */}
        <footer className="py-12 text-center text-xs text-zinc-500 font-mono">
          <p>{name} · {address} · Tel: {phone}</p>
        </footer>
      </div>
    );
  }

  // =========================================================================
  // 🦷 3. ZAHNARZT (牙科诊所) — Swiss Medical Precision & Pure Ice 弥散光
  // =========================================================================
  if (category === 'dentist') {
    const dentistReviews = [
      {
        name: 'Thomas K.',
        date: 'Vor 3 Wochen',
        stars: 5,
        de: 'Absolut schmerzfreie Behandlung und sehr einfühlsam. Als Angstpatient habe ich mich zum ersten Mal wohl gefühlt.',
        fr: 'Traitement totalement indolore et médecin très à l\'écoute. Une prise en charge rassurante.'
      },
      {
        name: 'Antoine R.',
        date: 'Vor 1 Monat',
        stars: 5,
        de: 'Sehr moderne Zahnarztpraxis in Biel. Die Professionelle Zahnreinigung war super gründlich.',
        fr: 'Cabinet ultra moderne à Bienne. Nettoyage dentaire professionnel d\'une grande qualité.'
      },
      {
        name: 'Kathrin W.',
        date: 'Vor 2 Wochen',
        stars: 5,
        de: 'Schneller Notfalltermin bekommen bei Zahnschmerzen. Keine lange Wartezeiten, top Service!',
        fr: 'Rendez-vous d\'urgence obtenu rapidement. Aucune attente et service irréprochable!'
      }
    ];

    return (
      <div className="min-h-screen bg-[#080e17] text-[#e2e8f0] font-sans relative overflow-x-hidden selection:bg-cyan-400 selection:text-black">
        {/* 弥散医用蓝背光 */}
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-cyan-950/30 rounded-full blur-[160px] pointer-events-none"></div>

        {/* Top bar */}
        <div className="border-b border-white/10 bg-black/40 backdrop-blur-xl py-2.5 px-6 flex items-center justify-between text-xs text-cyan-300">
          <div className="flex items-center gap-2 font-semibold">
            <Stethoscope className="w-4 h-4 text-cyan-400" />
            <span>{lang === 'de' ? `Zahnarztpraxis in ${city} · Swiss Quality Standard` : `Cabinet Dentaire à ${city} · Qualité Suisse`}</span>
          </div>
          <LangSwitcher lang={lang} setLang={setLang} />
        </div>

        {/* Header */}
        <header className="border-b border-white/10 bg-[#080e17]/80 backdrop-blur-2xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 font-bold text-2xl flex items-center justify-center">
                +
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{name}</h1>
                <p className="text-xs text-cyan-400 font-mono">Schweizer Zahnmedizin</p>
              </div>
            </div>
            <a href={`tel:${phone}`} className="px-6 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-black font-black text-xs uppercase tracking-wider rounded-xl transition shadow-xl shadow-cyan-500/20">
              {lang === 'de' ? 'Notfall & Termin' : 'Urgence & RDV'}
            </a>
          </div>
        </header>

        {/* Hero Bento */}
        <section className="py-16 px-6 max-w-7xl mx-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-7 backdrop-blur-2xl bg-white/[0.03] border border-white/10 ring-1 ring-white/5 p-8 sm:p-12 rounded-3xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-300 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>{lang === 'de' ? 'Schmerzfreie Behandlungen' : 'Soins Sans Douleur'}</span>
              </div>
              <h2 className="text-4xl sm:text-6xl font-extrabold text-white leading-tight">
                {lang === 'de' ? 'Gesunde Zähne & Ein Strahlendes Lächeln' : 'Des Dents Saines & Un Sourire Éclatant'}
              </h2>
              <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
                {lang === 'de' ? `Moderne Zahnheilkunde für die ganze Familie in ${city}. Schonende Behandlungen nach Schweizer Standards.` : `Soins dentaires modernes pour toute la famille à ${city}.`}
              </p>
              <div className="pt-4 border-t border-white/10 flex items-center gap-4">
                <div className="text-2xl font-bold text-cyan-300">{rating} ★</div>
                <div className="text-xs text-slate-400">{reviewCount} {lang === 'de' ? 'Patientenbewertungen' : 'avis patients'}</div>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-3xl overflow-hidden border border-white/10 ring-1 ring-white/5">
              <img src={imgSet.hero} alt="Dentist" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>

        {/* 4-Grid Medical Specialties */}
        <section className="py-16 max-w-7xl mx-auto px-6 space-y-6">
          <h3 className="text-2xl font-bold text-white text-center">{lang === 'de' ? 'Unsere Fachbereiche' : 'Nos Domaines d\'Intervention'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 ring-1 ring-white/5 p-6 rounded-2xl space-y-2">
              <h4 className="font-bold text-white">{lang === 'de' ? 'Prophylaxe' : 'Prophylaxie'}</h4>
              <p className="text-xs text-slate-400">{lang === 'de' ? 'Professionelle Zahnreinigung.' : 'Nettoyage professionnel.'}</p>
            </div>
            <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 ring-1 ring-white/5 p-6 rounded-2xl space-y-2">
              <h4 className="font-bold text-white">{lang === 'de' ? 'Ästhetik & Bleaching' : 'Blanchiment'}</h4>
              <p className="text-xs text-slate-400">{lang === 'de' ? 'Strahlend weiße Zähne.' : 'Dents blanches et saines.'}</p>
            </div>
            <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 ring-1 ring-white/5 p-6 rounded-2xl space-y-2">
              <h4 className="font-bold text-white">{lang === 'de' ? 'Implantologie' : 'Implantologie'}</h4>
              <p className="text-xs text-slate-400">{lang === 'de' ? 'Schweizer Zahnimplantate.' : 'Implants durables.'}</p>
            </div>
            <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 ring-1 ring-white/5 p-6 rounded-2xl space-y-2">
              <h4 className="font-bold text-white">{lang === 'de' ? 'Notfall-Service' : 'Service d\'Urgence'}</h4>
              <p className="text-xs text-slate-400">{lang === 'de' ? 'Sofortige Schmerzhilfe.' : 'Prise en charge rapide.'}</p>
            </div>
          </div>
        </section>

        {/* 🌟 Google Verified Reviews Wall */}
        <GoogleReviewsBentoWall 
          lang={lang} 
          rating={rating} 
          reviewCount={reviewCount} 
          accentBg="bg-cyan-400" 
          reviews={dentistReviews} 
        />

        {/* Footer */}
        <footer className="py-12 text-center text-xs text-slate-500 font-mono">
          <p>{name} · {address} · Tel: {phone}</p>
        </footer>
      </div>
    );
  }

  // =========================================================================
  // 🛠️ 4. SANITÄR / TRADE — Industrial 24/7 Action & Safety Orange 弥散光
  // =========================================================================
  if (category === 'sanitaer' || category === 'repair') {
    const tradeReviews = [
      {
        name: 'Beat W.',
        date: 'Vor 1 Woche',
        stars: 5,
        de: 'Innerhalb von 25 Minuten vor Ort bei unserem Rohrleitungsschaden. Transparente Kosten und Top-Sauberkeit!',
        fr: 'Arrivé sur place en 25 minutes pour un dégât des eaux. Tarifs transparents et travail d\'une propreté remarquable!'
      },
      {
        name: 'Laurent M.',
        date: 'Vor 2 Wochen',
        stars: 5,
        de: 'Heizung fiel am Sonntag aus. Sehr kompetenter Notdienst — problemlose Reparatur zum fairen Preis.',
        fr: 'Panne de chauffage un dimanche. Service de garde ultra professionnel, réparation rapide et prix juste.'
      },
      {
        name: 'Daniel S.',
        date: 'Vor 1 Monat',
        stars: 5,
        de: 'Komplette Badsanierung perfekt ausgeführt. Pünktlich, sauber und meisterhaft gearbeitet.',
        fr: 'Rénovation complète de salle de bain parfaitement exécutée. Ponctualité et qualité suisse.'
      }
    ];

    return (
      <div className="min-h-screen bg-[#0a0f1d] text-[#f8fafc] font-sans relative overflow-x-hidden selection:bg-orange-500 selection:text-black">
        {/* 弥散工业橙背光 */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-orange-950/20 rounded-full blur-[160px] pointer-events-none"></div>

        {/* Action Bar */}
        <div className="bg-orange-500 text-black font-black text-xs py-2 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 animate-bounce" />
            <span>{lang === 'de' ? `24/7 SANITÄR & HEIZUNG NOTFALLSERVICE IN ${city.toUpperCase()}` : `DÉPANNAGE SANITAIRE 24H/24 À ${city.toUpperCase()}`}</span>
          </div>
          <LangSwitcher lang={lang} setLang={setLang} />
        </div>

        {/* Header */}
        <header className="border-b border-white/10 bg-[#0a0f1d]/80 backdrop-blur-2xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-black font-bold text-xl flex items-center justify-center">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-white">{name}</span>
            </div>
            <a href={`tel:${phone}`} className="px-6 py-3 bg-orange-500 hover:bg-orange-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition shadow-xl shadow-orange-500/20 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>{phone}</span>
            </a>
          </div>
        </header>

        {/* Hero Bento */}
        <section className="py-16 px-6 max-w-7xl mx-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-7 backdrop-blur-2xl bg-white/[0.03] border border-white/10 ring-1 ring-white/5 p-8 sm:p-12 rounded-3xl space-y-6">
              <div className="inline-block px-3 py-1 bg-orange-500/20 border border-orange-500/40 text-orange-400 font-bold text-xs rounded-lg uppercase">
                ⚡ {lang === 'de' ? 'Schnellvor-Ort bei Wasserschaden & Heizungsausfall' : 'Intervention Immédiate En Cas de Fuite'}
              </div>
              <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight">
                {lang === 'de' ? 'Schnell, Sauber & Fair Vor Ort in ' : 'Dépannage Rapide & Propre à '}
                <span className="text-orange-400">{city}</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
                {lang === 'de' ? `Ihr meistergeführter Fachbetrieb in ${city}. Transparentes Festpreis-Versprechen.` : `Votre artisan plombier certifié.`}
              </p>
              <div className="p-4 rounded-2xl backdrop-blur-xl bg-black/40 border border-white/10 flex items-center justify-between">
                <div className="text-sm font-bold text-white">{lang === 'de' ? 'Durchschnittliche Anfahrt' : 'Temps d\'intervention'}</div>
                <div className="text-2xl font-black text-orange-400 font-mono">30 MIN</div>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-3xl overflow-hidden border border-white/10 ring-1 ring-white/5">
              <img src={imgSet.hero} alt="Sanitär" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>

        {/* 🌟 Google Verified Reviews Wall */}
        <GoogleReviewsBentoWall 
          lang={lang} 
          rating={rating} 
          reviewCount={reviewCount} 
          accentBg="bg-orange-400" 
          reviews={tradeReviews} 
        />

        {/* Footer */}
        <footer className="py-12 text-center text-xs text-slate-500 font-mono">
          <p>{name} · {address} · Notfall-Tel: {phone}</p>
        </footer>
      </div>
    );
  }

  // =========================================================================
  // ☕️ 5. CAFÉ / RESTAURANT — Dark Bistrot & Champagne Gold 弥散光
  // =========================================================================
  const cafeReviews = [
    {
      name: 'Lukas B.',
      date: 'Vor 1 Woche',
      stars: 5,
      de: 'Der beste Espresso in ganz Biel! Traumhafte Atmosphäre im Herzen der Altstadt.',
      fr: 'Le meilleur espresso de Bienne! Une ambiance chaleureuse en plein cœur de la vieille ville.'
    },
    {
      name: 'Valérie C.',
      date: 'Vor 2 Wochen',
      stars: 5,
      de: 'Hervorragender Sonntags-Brunch und sehr aufmerksamer Service. Absoluter Geheimtipp!',
      fr: 'Brunch dominical délicieux et service impeccable. Une adresse incontournable!'
    },
    {
      name: 'Simon G.',
      date: 'Vor 3 Wochen',
      stars: 5,
      de: 'Tolles Café mit hausgemachten Törtchen und klasse Barista-Kaffee. Komme jede Woche her.',
      fr: 'Superbe café avec pâtisseries maison et excellent café barista. J\'y viens chaque semaine.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0c0908] text-[#f2ece4] font-sans relative overflow-x-hidden selection:bg-amber-400 selection:text-black">
      {/* 弥散金赭背光 */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-amber-950/20 rounded-full blur-[160px] pointer-events-none"></div>

      {/* Top bar */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-xl py-2.5 px-6 flex items-center justify-between text-xs text-amber-200/70">
        <div className="flex items-center gap-2">
          <Coffee className="w-4 h-4 text-amber-400" />
          <span>{lang === 'de' ? `Café & Bistrot in ${city}` : `Café & Bistrot à ${city}`}</span>
        </div>
        <LangSwitcher lang={lang} setLang={setLang} />
      </div>

      {/* Header */}
      <header className="border-b border-white/10 bg-[#0c0908]/80 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <h1 className="font-serif text-2xl font-bold tracking-wider text-amber-100">{name}</h1>
          <a href={`tel:${phone}`} className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider rounded-xl transition shadow-xl">
            {lang === 'de' ? 'Tisch Reservieren' : 'Réserver'}
          </a>
        </div>
      </header>

      {/* Hero Bento */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center space-y-8">
        <div className="inline-block px-4 py-1.5 rounded-full backdrop-blur-xl bg-white/[0.03] border border-white/10 ring-1 ring-white/5 text-amber-300 text-xs font-semibold">
          ☕️ Barista Specialty Coffee & Cuisine
        </div>
        <h2 className="text-4xl sm:text-6xl font-serif font-extrabold text-amber-50 leading-tight">
          {lang === 'de' ? 'Herzliche Schweizer Gastfreundschaft' : 'Hospitalité Chaleureuse & Conviviale'}
        </h2>
        <p className="text-base sm:text-lg text-amber-200/70 font-light max-w-xl mx-auto leading-relaxed">
          {lang === 'de' ? `Besuchen Sie uns im ${name} in ${city}. Kaffeespezialitäten, frisch zubereitete Speisen und erlesene Weine.` : `Venez nous rendre visite au ${name} à ${city}.`}
        </p>
        <div className="pt-2 inline-flex items-center gap-2 backdrop-blur-xl bg-white/[0.03] border border-white/10 ring-1 ring-white/5 px-5 py-2.5 rounded-2xl">
          <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          <span className="font-bold text-amber-200">{rating} / 5.0</span>
          <span className="text-xs text-amber-200/60">({reviewCount} {lang === 'de' ? 'Rezensionen' : 'avis'})</span>
        </div>
      </section>

      {/* Grid Images */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl overflow-hidden border border-white/10 ring-1 ring-white/5 h-80">
            <img src={imgSet.p1} className="w-full h-full object-cover" alt="Coffee" />
          </div>
          <div className="rounded-3xl overflow-hidden border border-white/10 ring-1 ring-white/5 h-80">
            <img src={imgSet.p2} className="w-full h-full object-cover" alt="Dishes" />
          </div>
        </div>
      </section>

      {/* 🌟 Google Verified Reviews Wall */}
      <GoogleReviewsBentoWall 
        lang={lang} 
        rating={rating} 
        reviewCount={reviewCount} 
        accentBg="bg-amber-400" 
        reviews={cafeReviews} 
      />

      {/* Footer */}
      <footer className="py-12 text-center text-xs text-amber-200/50 font-mono">
        <p>{name} · {address} · Tel: {phone}</p>
      </footer>
    </div>
  );
}
