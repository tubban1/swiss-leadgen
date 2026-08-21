import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return NextResponse.json({ error: 'DATABASE_URL is not set' }, { status: 500 });
  }

  try {
    const sql = neon(databaseUrl);
    
    // 获取所有 leads
    const leads = await sql`
      SELECT l.*, 
             e.subject as email_subject, 
             e.body_html as email_body,
             e.type as email_type
      FROM leads l
      LEFT JOIN email_log e ON l.id = e.lead_id
      ORDER BY l.created_at DESC;
    `;

    return NextResponse.json({ success: true, leads });
  } catch (error: any) {
    console.error('Fetch leads error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
