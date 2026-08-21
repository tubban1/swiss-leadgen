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
  Heart,
  ChevronRight,
  Sliders,
  Image as ImageIcon
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
  // 实时双语状态：de (德语) 或 fr (法语)
  const [lang, setLang] = useState<'de' | 'fr'>('de');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const t = {
    de: {
      topBanner: `Traditionelle Schweizer Qualität & Exzellenz in ${city} (${canton})`,
      aboutUs: 'Über Uns',
      services: 'Leistungen & Angebot',
      gallery: 'Impressionen',
      contact: 'Kontakt & Anfahrt',
      callNow: 'Jetzt Anrufen',
      bookTermin: 'Termin vereinbaren',
      certified: `Zertifizierter Fachbetrieb · ${city}`,
      verifiedReviews: 'verifizierte Bewertungen',
      ratingText: 'Google Bewertung',
      quickInquiry: 'Unverbindliche Anfrage',
      yourName: 'Ihr Name',
      phoneEmail: 'Telefon / E-Mail',
      message: 'Ihre Nachricht',
      sendBtn: 'Anfrage Absenden',
      submittedMsg: 'Vielen Dank! Ihre Anfrage wurde erfolgreich übermittelt.',
      hoursTitle: 'Öffnungszeiten',
      weekdays: 'Montag - Freitag',
      saturday: 'Samstag',
      sunday: 'Sonntag',
      closed: 'Geschlossen',
      allRights: 'Alle Rechte vorbehalten. Impressum & Datenschutz',
      // Bakery
      bakerySub: 'Handgemachte Schweizer Bäckerei & Konditorei',
      bakeryHeroHeadline: 'Täglich frisch gebrüht & aus dem Ofen',
      bakeryHeroDesc: `Erleben Sie knusprige Gipfeli, traditionellen Sauerteig und feine Pâtisserie. Täglich frisch zubereitet mit besten Zutaten aus der Region ${city}.`,
      // Coiffeur
      beautySub: 'Premium Hair Styling & Beauty Salon',
      beautyHeroHeadline: 'Schönheit, Elegance & Perfektes Styling',
      beautyHeroDesc: `Ihr exklusiver Salon für individuelle Haarschnitte, Balayage, Styling und intensive Pflege in entspannter Atmosphäre in ${city}.`,
      // Dentist
      dentistSub: 'Schweizer Zahnmedizin & Schonende Behandlungen',
      dentistHeroHeadline: 'Gesunde Zähne & Ein Strahlendes Lächeln',
      dentistHeroDesc: `Moderne Zahnheilkunde, Prophylaxe, Zahnreinigung und Ästhetik. Wir garantieren schmerzfreie Behandlungen nach höchsten Schweizer Qualitätsstandards.`,
      // Sanitär
      tradeSub: '24/7 Sanitär, Heizung & Reparaturservice',
      tradeHeroHeadline: 'Meisterhafte Qualität & Schnelle Notfallhilfe',
      tradeHeroDesc: `Ihr zuverlässiger Fachbetrieb in ${city}. Von der Badsanierung bis zum Rohrbruch – wir sind rund um die Uhr schnell vor Ort.`,
      // Café
      cafeSub: 'Barista Kaffee & Kulinarischer Genuss',
      cafeHeroHeadline: 'Herzliche Gastfreundschaft & Feine Speisen',
      cafeHeroDesc: `Genießen Sie erstklassigen Kaffee, hausgemachte Speisen und angenehme Stunden in gemütlichem Ambiente mitten in ${city}.`,
    },
    fr: {
      topBanner: `Qualité suisse traditionnelle & Excellence à ${city} (${canton})`,
      aboutUs: 'À Propos',
      services: 'Services & Prestations',
      gallery: 'Galerie Photos',
      contact: 'Contact & Accès',
      callNow: 'Appeler Maintenant',
      bookTermin: 'Prendre Rendez-vous',
      certified: `Entreprise Certifiée · ${city}`,
      verifiedReviews: 'avis clients vérifiés',
      ratingText: 'Note Google',
      quickInquiry: 'Demande Sans Engagement',
      yourName: 'Votre Nom',
      phoneEmail: 'Téléphone / E-mail',
      message: 'Votre Message',
      sendBtn: 'Envoyer la Demande',
      submittedMsg: 'Merci beaucoup! Votre message a été transmis avec succès.',
      hoursTitle: 'Heures d\'Ouverture',
      weekdays: 'Lundi - Vendredi',
      saturday: 'Samedi',
      sunday: 'Dimanche',
      closed: 'Fermé',
      allRights: 'Tous droits réservés. Mentions légales & Confidentialité',
      // Bakery
      bakerySub: 'Boulangerie & Pâtisserie Artisanale Suisse',
      bakeryHeroHeadline: 'Frais chaque jour, directement du four',
      bakeryHeroDesc: `Découvrez nos croissants croustillants, pains au levain traditionnels et délicieuses pâtisseries préparées à ${city}.`,
      // Coiffeur
      beautySub: 'Salon de Coiffure & Beauté Haut de Gamme',
      beautyHeroHeadline: 'Beauté, Élégance & Coiffure Sur-Mesure',
      beautyHeroDesc: `Votre salon exclusif pour coupes personnalisées, balayages et soins capillaires intenses à ${city}.`,
      // Dentist
      dentistSub: 'Médecine Dentaire Suisse & Soins Doux',
      dentistHeroHeadline: 'Des Dents Saines & Un Sourire Éclatant',
      dentistHeroDesc: `Soins dentaires modernes, hygiène et esthétique. Nous garantissons des traitements sans douleur selon les normes suisses.`,
      // Sanitär
      tradeSub: 'Dépannage Sanitaire & Chauffage 24/7',
      tradeHeroHeadline: 'Qualité Artisanale & Intervention Rapide',
      tradeHeroDesc: `Votre partenaire fiable à ${city}. Rénovation de salle de bain ou urgence fuite d'eau – nous intervenons 24/7.`,
      // Café
      cafeSub: 'Café Barista & Plaisirs Gastronomiques',
      cafeHeroHeadline: 'Hospitalité Chaleureuse & Cuisine Savoureuse',
      cafeHeroDesc: `Dégustez un café d'exception, des mets faits maison et passez un moment agréable au cœur de ${city}.`,
    }
  };

  const curr = t[lang];

  // 图像库
  const images = {
    bakery: {
      hero: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
      g1: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
      g2: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=600&q=80',
    },
    hair_salon: {
      hero: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
      g1: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
      g2: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80',
    },
    dentist: {
      hero: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
      g1: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80',
      g2: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=600&q=80',
    },
    sanitaer: {
      hero: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1200&q=80',
      g1: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
      g2: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
    },
    cafe: {
      hero: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
      g1: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
      g2: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    }
  };

  const imgSet = images[category as keyof typeof images] || images.cafe;

  // 主题 UI 配色控制系统
  const themeClasses = {
    bakery: {
      bg: 'bg-stone-950 text-amber-50',
      headerBorder: 'border-amber-900/40',
      accentBg: 'bg-amber-500 hover:bg-amber-400 text-stone-950',
      gradientText: 'from-amber-200 via-amber-400 to-yellow-500',
      cardBg: 'bg-stone-900/80 border-amber-900/40',
      subText: 'text-amber-400',
      icon: <Croissant className="w-5 h-5 text-amber-400" />
    },
    hair_salon: {
      bg: 'bg-zinc-950 text-zinc-100',
      headerBorder: 'border-rose-900/30',
      accentBg: 'bg-rose-500 hover:bg-rose-400 text-zinc-950',
      gradientText: 'from-rose-200 via-pink-300 to-amber-200',
      cardBg: 'bg-zinc-900/90 border-rose-900/30',
      subText: 'text-rose-400',
      icon: <Scissors className="w-5 h-5 text-rose-400" />
    },
    dentist: {
      bg: 'bg-slate-950 text-slate-100',
      headerBorder: 'border-cyan-900/40',
      accentBg: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950',
      gradientText: 'from-cyan-300 via-teal-300 to-sky-400',
      cardBg: 'bg-slate-900/90 border-cyan-900/40',
      subText: 'text-cyan-400',
      icon: <Stethoscope className="w-5 h-5 text-cyan-400" />
    },
    sanitaer: {
      bg: 'bg-slate-950 text-slate-100',
      headerBorder: 'border-slate-800',
      accentBg: 'bg-orange-500 hover:bg-orange-400 text-slate-950',
      gradientText: 'from-orange-400 via-amber-400 to-yellow-400',
      cardBg: 'bg-slate-900 border-slate-800',
      subText: 'text-orange-400',
      icon: <Wrench className="w-5 h-5 text-orange-400" />
    },
    cafe: {
      bg: 'bg-stone-950 text-stone-100',
      headerBorder: 'border-stone-800',
      accentBg: 'bg-amber-500 hover:bg-amber-400 text-stone-950',
      gradientText: 'from-amber-200 via-amber-400 to-amber-500',
      cardBg: 'bg-stone-900/90 border-stone-800',
      subText: 'text-amber-400',
      icon: <Coffee className="w-5 h-5 text-amber-400" />
    }
  };

  const style = themeClasses[category as keyof typeof themeClasses] || themeClasses.cafe;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className={`min-h-screen ${style.bg} font-sans selection:bg-amber-500 selection:text-stone-950`}>
      {/* ── Top Bar with Language Switcher ─────────────────────── */}
      <div className="bg-stone-900 border-b border-stone-800 text-xs py-2 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-stone-300 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{curr.topBanner}</span>
        </div>

        {/* 双语切换核心逻辑 DE / FR */}
        <div className="flex items-center gap-1.5 bg-stone-950 px-2.5 py-1 rounded-full border border-stone-800">
          <Languages className="w-3.5 h-3.5 text-stone-400" />
          <button
            onClick={() => setLang('de')}
            className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
              lang === 'de' ? 'bg-amber-500 text-stone-950 shadow-sm' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            DE (Deutsch)
          </button>
          <span className="text-stone-700">|</span>
          <button
            onClick={() => setLang('fr')}
            className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
              lang === 'fr' ? 'bg-amber-500 text-stone-950 shadow-sm' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            FR (Français)
          </button>
        </div>
      </div>

      {/* ── Sticky Header ──────────────────────────────────────── */}
      <header className={`border-b ${style.headerBorder} bg-stone-950/90 backdrop-blur-md sticky top-0 z-40`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 font-serif text-2xl font-black flex items-center justify-center shadow-lg shadow-amber-500/20">
              {name.charAt(0)}
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold tracking-tight text-white">{name}</h1>
              <div className="flex items-center gap-2 text-xs font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span className={style.subText}>{curr.certified}</span>
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-300">
            <a href="#about" className="hover:text-amber-400 transition-colors">{curr.aboutUs}</a>
            <a href="#services" className="hover:text-amber-400 transition-colors">{curr.services}</a>
            <a href="#gallery" className="hover:text-amber-400 transition-colors">{curr.gallery}</a>
            <a href="#contact" className="hover:text-amber-400 transition-colors">{curr.contact}</a>
          </nav>

          <a
            href={`tel:${phone}`}
            className={`px-5 py-2.5 ${style.accentBg} font-bold text-sm rounded-xl transition-all shadow-lg flex items-center gap-2`}
          >
            <Phone className="w-4 h-4" />
            <span>{curr.callNow}</span>
          </a>
        </div>
      </header>

      {/* ── Hero Section with High-Res Image ───────────────────── */}
      <section className="relative py-20 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-8 text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900 border border-stone-800 text-amber-400 text-xs font-semibold">
            {style.icon}
            <span>{category === 'bakery' ? curr.bakerySub : category === 'hair_salon' ? curr.beautySub : category === 'dentist' ? curr.dentistSub : category === 'sanitaer' ? curr.tradeSub : curr.cafeSub}</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-serif font-black tracking-tight leading-tight text-white">
            {category === 'bakery' ? curr.bakeryHeroHeadline : category === 'hair_salon' ? curr.beautyHeroHeadline : category === 'dentist' ? curr.dentistHeroHeadline : category === 'sanitaer' ? curr.tradeHeroHeadline : curr.cafeHeroHeadline} <br />
            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${style.gradientText}`}>
              {name}
            </span>
          </h2>

          <p className="text-lg text-stone-300 font-light leading-relaxed max-w-2xl">
            {category === 'bakery' ? curr.bakeryHeroDesc : category === 'hair_salon' ? curr.beautyHeroDesc : category === 'dentist' ? curr.dentistHeroDesc : category === 'sanitaer' ? curr.tradeHeroDesc : curr.cafeHeroDesc}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center gap-1.5 bg-stone-900 border border-stone-800 px-4 py-2.5 rounded-2xl">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span className="text-lg font-bold text-amber-300">{rating}</span>
              <span className="text-xs text-stone-400">/ 5.0 ({reviewCount} {curr.verifiedReviews})</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <a
              href="#contact"
              className={`w-full sm:w-auto px-8 py-4 ${style.accentBg} font-bold text-base rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2`}
            >
              <Calendar className="w-5 h-5" />
              <span>{curr.bookTermin}</span>
            </a>
            <a
              href={`tel:${phone}`}
              className="w-full sm:w-auto px-8 py-4 bg-stone-900 hover:bg-stone-800 text-stone-200 font-semibold text-base rounded-2xl transition-colors border border-stone-800 flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>{phone}</span>
            </a>
          </div>
        </div>

        {/* Hero Image Card */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-stone-800 group">
            <img
              src={imgSet.hero}
              alt={name}
              className="w-full h-[450px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-80"></div>
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-stone-950/80 backdrop-blur-md border border-stone-800">
              <p className="text-xs font-semibold uppercase text-amber-400">{city} · Switzerland</p>
              <p className="text-sm font-serif font-bold text-white mt-1">{name}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Rich Features Grid ─────────────────────────────────── */}
      <section id="services" className="py-20 bg-stone-900/50 border-t border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h3 className="text-3xl font-serif font-bold text-white">{curr.services}</h3>
            <p className="text-sm text-stone-400">Erfahren Sie mehr über unsere Qualitätsstandards und Dienstleistungen in {city}.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`p-8 rounded-3xl ${style.cardBg} space-y-4 shadow-lg hover:border-amber-500/40 transition-all group`}>
              <div className="w-12 h-12 bg-stone-800 rounded-2xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-amber-400" />
              </div>
              <h4 className="text-xl font-bold font-serif text-white">Schweizer Qualität</h4>
              <p className="text-sm text-stone-400 leading-relaxed">
                Höchste Präzision, Zuverlässigkeit und erstklassige Ausführung nach strengen Standards.
              </p>
            </div>

            <div className={`p-8 rounded-3xl ${style.cardBg} space-y-4 shadow-lg hover:border-amber-500/40 transition-all group`}>
              <div className="w-12 h-12 bg-stone-800 rounded-2xl flex items-center justify-center">
                <Award className="w-6 h-6 text-amber-400" />
              </div>
              <h4 className="text-xl font-bold font-serif text-white">{rating} ★ Kundenzufriedenheit</h4>
              <p className="text-sm text-stone-400 leading-relaxed">
                Über {reviewCount} echte Google-Bewertungen bestätigen unseren persönlichen Service.
              </p>
            </div>

            <div className={`p-8 rounded-3xl ${style.cardBg} space-y-4 shadow-lg hover:border-amber-500/40 transition-all group`}>
              <div className="w-12 h-12 bg-stone-800 rounded-2xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-400" />
              </div>
              <h4 className="text-xl font-bold font-serif text-white">Schnelle Erreichbarkeit</h4>
              <p className="text-sm text-stone-400 leading-relaxed">
                Zentral gelegen in {address}. Wir stehen Ihnen schnell und unkompliziert zur Seite.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Photo Gallery Section ──────────────────────────────── */}
      <section id="gallery" className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900 border border-stone-800 text-stone-300 text-xs">
            <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
            <span>{curr.gallery}</span>
          </div>
          <h3 className="text-3xl font-serif font-bold text-white">Einblick in unseren Betrieb</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative rounded-3xl overflow-hidden border border-stone-800 group h-80">
            <img
              src={imgSet.g1}
              alt="Gallery 1"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-stone-950/30 group-hover:bg-transparent transition-colors"></div>
          </div>
          <div className="relative rounded-3xl overflow-hidden border border-stone-800 group h-80">
            <img
              src={imgSet.g2}
              alt="Gallery 2"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-stone-950/30 group-hover:bg-transparent transition-colors"></div>
          </div>
        </div>
      </section>

      {/* ── Contact & Reservation Form Section ──────────────────── */}
      <section id="contact" className="py-20 bg-stone-900/30 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Info Card */}
          <div className="lg:col-span-6 space-y-8 bg-stone-900/90 p-8 sm:p-10 rounded-3xl border border-stone-800 shadow-xl">
            <h3 className="text-2xl font-serif font-bold text-white">{curr.contact}</h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-stone-800 text-amber-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-stone-400 uppercase">Adresse</h4>
                  <p className="text-base font-medium text-white mt-0.5">{address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-stone-800 text-amber-400 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-stone-400 uppercase">Telefon</h4>
                  <a href={`tel:${phone}`} className="text-base font-medium text-amber-400 hover:underline mt-0.5 block">{phone}</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-stone-800 text-amber-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-stone-400 uppercase">E-Mail</h4>
                  <p className="text-base font-medium text-stone-300 mt-0.5">{email}</p>
                </div>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="pt-6 border-t border-stone-800 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{curr.hoursTitle}</span>
              </h4>
              <div className="grid grid-cols-2 text-xs text-stone-400 gap-2">
                <div>{curr.weekdays}:</div>
                <div className="text-white font-mono">08:00 - 18:30</div>
                <div>{curr.saturday}:</div>
                <div className="text-white font-mono">08:00 - 16:00</div>
                <div>{curr.sunday}:</div>
                <div className="text-stone-500 font-mono">{curr.closed}</div>
              </div>
            </div>
          </div>

          {/* Interactive Form */}
          <div className="lg:col-span-6 bg-stone-900/90 p-8 sm:p-10 rounded-3xl border border-stone-800 shadow-xl">
            <h3 className="text-2xl font-serif font-bold text-white mb-6">{curr.quickInquiry}</h3>

            {formSubmitted ? (
              <div className="p-8 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-3">
                <Check className="w-12 h-12 text-emerald-400 mx-auto" />
                <p className="text-emerald-300 font-medium text-sm">{curr.submittedMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1">{curr.yourName}</label>
                  <input
                    type="text"
                    required
                    placeholder="z.B. Hans Muster"
                    className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1">{curr.phoneEmail}</label>
                  <input
                    type="text"
                    required
                    placeholder="079 123 45 67 / ihram@beispiel.ch"
                    className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1">{curr.message}</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Wie können wir Ihnen helfen?"
                    className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 text-sm resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className={`w-full py-4 ${style.accentBg} font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-sm`}
                >
                  <Send className="w-4 h-4" />
                  <span>{curr.sendBtn}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="py-12 bg-stone-950 border-t border-stone-800 text-stone-400 text-sm text-center">
        <div className="max-w-6xl mx-auto px-6 space-y-3">
          <p className="font-serif text-xl font-bold text-white">{name}</p>
          <p className="text-xs text-stone-500">{address} · Telefon: {phone}</p>
          <p className="text-xs text-stone-600 pt-2">© {new Date().getFullYear()} {name} · {curr.allRights}</p>
        </div>
      </footer>
    </div>
  );
}
