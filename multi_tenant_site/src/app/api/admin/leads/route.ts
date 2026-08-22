import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return NextResponse.json({ error: 'DATABASE_URL is not set' }, { status: 500 });
  }

  try {
    const sql = neon(databaseUrl);
    
    // 从 4 表视图 v_leads_full 安全获取全量商户信息 (含唯一的 site_configs.admin_pass)
    const leads = await sql`
      SELECT v.id, v.name, v.category, v.address, v.city, v.canton, v.language,
             v.email, v.phone, v.rating, v.review_count, v.subdomain, v.admin_pass,
             v.status, v.is_published, v.created_at,
             (SELECT subject FROM email_log WHERE lead_id = v.id ORDER BY sent_at DESC LIMIT 1) as email_subject,
             (SELECT body_html FROM email_log WHERE lead_id = v.id ORDER BY sent_at DESC LIMIT 1) as email_body,
             (SELECT type FROM email_log WHERE lead_id = v.id ORDER BY sent_at DESC LIMIT 1) as email_type
      FROM v_leads_full v
      ORDER BY v.created_at DESC;
    `;

    // 确保格式化为纯 JavaScript 简单类型
    const cleanLeads = JSON.parse(JSON.stringify(leads));

    return NextResponse.json({ success: true, leads: cleanLeads });
  } catch (error: any) {
    console.error('Fetch leads error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
