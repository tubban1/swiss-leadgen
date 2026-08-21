import React from 'react';
import { neon } from '@neondatabase/serverless';
import DynamicTenantView from './TenantClientView';

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
  const leadData = await getLeadBySlug(rawDomain);

  const rawSlug = rawDomain.replace('.sites.tubban.com', '').replace('.tubban.com', '');
  const name = leadData?.name || rawSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const category = leadData?.category || 'bakery';
  const city = leadData?.city || 'Biel/Bienne';
  const canton = leadData?.canton || 'BE';
  const address = leadData?.address || `${city}, Schweiz`;
  const phone = leadData?.phone || '+41 32 320 00 00';
  const email = leadData?.email || `kontakt@${rawSlug}.ch`;
  const rating = leadData?.rating ? Number(leadData.rating).toFixed(1) : '4.8';
  const reviewCount = leadData?.review_count || 68;

  return (
    <DynamicTenantView
      name={name}
      category={category}
      city={city}
      canton={canton}
      address={address}
      phone={phone}
      email={email}
      rating={rating}
      reviewCount={reviewCount}
    />
  );
}
