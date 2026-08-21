import React from 'react';

export default function RootPage() {
  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex items-center justify-center font-sans">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold font-serif">Swiss LeadGen Multi-Tenant Platform</h1>
        <p className="text-stone-400">Wilkommen auf der Multi-Tenant LeadGen Plattform.</p>
        <a href="/admin/dashboard" className="inline-block px-6 py-3 bg-amber-500 text-stone-950 font-bold rounded-xl hover:bg-amber-400 transition-colors">
          Zum Admin Dashboard
        </a>
      </div>
    </div>
  );
}
