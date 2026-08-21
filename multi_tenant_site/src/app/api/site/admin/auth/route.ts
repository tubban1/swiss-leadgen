import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return NextResponse.json({ error: 'DATABASE_URL is missing' }, { status: 500 });
  }

  try {
    const { domain, pass } = await request.json();
    if (!domain || !pass) {
      return NextResponse.json({ error: 'Domain and password required' }, { status: 400 });
    }

    const sql = neon(databaseUrl);
    const cleanDomain = domain
      .replace('.sites.tubban.com', '')
      .replace('.tubban.com', '');

    // 查询该子域名的真实 lead 记录
    const leads = await sql`
      SELECT l.id, l.name, l.subdomain, l.admin_pass, sc.config_json as site_config
      FROM leads l
      LEFT JOIN site_configs sc ON l.id = sc.lead_id
      WHERE l.subdomain ILIKE ${'%' + cleanDomain + '%'}
         OR l.slug ILIKE ${'%' + cleanDomain + '%'}
      LIMIT 1;
    `;

    if (leads.length === 0) {
      return NextResponse.json({ error: 'Tenant website not found' }, { status: 404 });
    }

    const lead = leads[0];
    
    // 比对随机密码
    if (lead.admin_pass !== pass.trim()) {
      return NextResponse.json({ error: 'Ungültiges Passwort (Invalid password)' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      name: lead.name,
      subdomain: lead.subdomain,
      siteConfig: lead.site_config
    });
  } catch (error: any) {
    console.error('Admin Auth Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
