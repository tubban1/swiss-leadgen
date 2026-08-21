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

    // 校验身份
    const leads = await sql`
      SELECT l.id, l.admin_pass
      FROM leads l
      WHERE l.subdomain ILIKE ${'%' + cleanDomain + '%'}
         OR l.slug ILIKE ${'%' + cleanDomain + '%'}
      LIMIT 1;
    `;

    if (leads.length === 0 || leads[0].admin_pass !== pass.trim()) {
      return NextResponse.json({ error: 'Unauthorized: Invalid password' }, { status: 401 });
    }

    const leadId = leads[0].id;
    const siteConfigJson = JSON.stringify(siteConfig);

    // Upsert 最新配置到 site_configs 表
    await sql`
      INSERT INTO site_configs (lead_id, config_json, updated_at)
      VALUES (${leadId}, ${siteConfigJson}::jsonb, NOW())
      ON CONFLICT (lead_id)
      DO UPDATE SET config_json = ${siteConfigJson}::jsonb, updated_at = NOW();
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
