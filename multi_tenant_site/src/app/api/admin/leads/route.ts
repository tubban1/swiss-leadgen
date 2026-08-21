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
    
    // 安全获取所有 unique leads
    const leads = await sql`
      SELECT l.id, l.name, l.category, l.address, l.city, l.canton, l.language,
             l.email, l.phone, l.rating, l.review_count, l.subdomain, l.admin_pass,
             l.status, l.is_published, l.created_at,
             (SELECT subject FROM email_log WHERE lead_id = l.id ORDER BY sent_at DESC LIMIT 1) as email_subject,
             (SELECT body_html FROM email_log WHERE lead_id = l.id ORDER BY sent_at DESC LIMIT 1) as email_body,
             (SELECT type FROM email_log WHERE lead_id = l.id ORDER BY sent_at DESC LIMIT 1) as email_type
      FROM leads l
      ORDER BY l.created_at DESC;
    `;

    // 确保格式化为纯 JavaScript 简单类型
    const cleanLeads = JSON.parse(JSON.stringify(leads));

    return NextResponse.json({ success: true, leads: cleanLeads });
  } catch (error: any) {
    console.error('Fetch leads error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
