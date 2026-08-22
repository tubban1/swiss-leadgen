import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return NextResponse.json({ error: 'DATABASE_URL is missing' }, { status: 500 });
  }

  try {
    const { domain, pass, siteConfig } = await request.json();
    if (!domain || !pass || !siteConfig) {
      return NextResponse.json({ error: 'Domain, password, and siteConfig are required' }, { status: 400 });
    }

    const sql = neon(databaseUrl);
    const cleanDomain = domain
      .replace('.sites.tubban.com', '')
      .replace('.tubban.com', '');

    // 唯一密码比对 (site_configs.admin_pass)
    const leads = await sql`
      SELECT l.id, sc.admin_pass
      FROM leads l
      LEFT JOIN site_configs sc ON l.id = sc.lead_id
      WHERE l.subdomain ILIKE ${'%' + cleanDomain + '%'}
         OR l.slug ILIKE ${'%' + cleanDomain + '%'}
      LIMIT 1;
    `;

    const inputPass = pass.trim();
    if (leads.length === 0) {
      return NextResponse.json({ error: 'Unauthorized: Tenant not found' }, { status: 401 });
    }

    const lead = leads[0];
    if (!lead.admin_pass || lead.admin_pass !== inputPass) {
      return NextResponse.json({ error: 'Unauthorized: Invalid password' }, { status: 401 });
    }

    const leadId = lead.id;
    const siteConfigStr = typeof siteConfig === 'string' ? siteConfig : JSON.stringify(siteConfig);

    // 唯一在 site_configs 表中落盘更新 site_config 和 admin_pass
    await sql`
      INSERT INTO site_configs (lead_id, site_config, admin_pass, updated_at)
      VALUES (${leadId}, ${siteConfigStr}, ${inputPass}, NOW())
      ON CONFLICT (lead_id)
      DO UPDATE SET site_config = ${siteConfigStr}, admin_pass = ${inputPass}, updated_at = NOW();
    `;

    return NextResponse.json({
      success: true,
      message: 'Website configuration updated successfully in Neon PostgreSQL database!'
    });
  } catch (error: any) {
    console.error('Admin Update Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
