import React from 'react';

// 根据 Domain 动态渲染商家的 Prompt-Driven 专属页面
export default async function TenantPage({ params }: { params: { domain: string } }) {
  const subdomain = params.domain;

  // 1. 实际项目中：从后端 API 或数据库拉取 site_config
  // const res = await fetch(`https://api.tubban.com/site-config?subdomain=${subdomain}`);
  // const data = await res.json();
  
  // 占位示范配置（在实际部署中直接由 Python 后端与数据库提供）
  const siteConfig = {
    business_name: subdomain.replace('-', ' ').toUpperCase(),
    theme: {
      primaryColor: '#8B4513',
      secondaryColor: '#D4A017',
      backgroundColor: '#FDF6EC',
      textColor: '#2D241E',
      headingFont: 'Playfair Display',
      bodyFont: 'Inter',
    },
    hero: {
      headline: `Willkommen bei ${subdomain}`,
      tagline: 'Qualität & Tradition in Ihrer Nähe',
      ctaText: 'Jetzt Anrufen',
    },
  };

  const theme = siteConfig.theme;

  return (
    <div
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        fontFamily: `${theme.bodyFont}, sans-serif`,
        minHeight: '100vh',
      }}
    >
      {/* 动态 Inject Google Fonts */}
      <link
        rel="stylesheet"
        href={`https://fonts.googleapis.com/css2?family=${theme.headingFont.replace(/ /g, '+')}&family=${theme.bodyFont.replace(/ /g, '+')}&display=swap`}
      />

      {/* Header */}
      <header className="p-6 flex justify-between items-center max-w-6xl mx-auto">
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: `${theme.headingFont}, serif`, color: theme.primaryColor }}
        >
          {siteConfig.business_name}
        </h1>
        <button
          className="px-5 py-2 rounded-full text-white font-medium shadow-md transition hover:opacity-90"
          style={{ backgroundColor: theme.primaryColor }}
        >
          {siteConfig.hero.ctaText}
        </button>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto text-center py-20 px-4">
        <h2
          className="text-5xl font-extrabold mb-6 leading-tight"
          style={{ fontFamily: `${theme.headingFont}, serif`, color: theme.primaryColor }}
        >
          {siteConfig.hero.headline}
        </h2>
        <p className="text-xl mb-8 opacity-80">{siteConfig.hero.tagline}</p>
      </main>
    </div>
  );
}
