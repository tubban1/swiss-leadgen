"""
数据库 Migration 脚本：为 deployments 表补充 cname_target 字段，并同步重建 v_leads_full 视图
"""
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()
load_dotenv(Path(__file__).parent.parent / '.env')

import psycopg2

def migrate():
    db_url = os.getenv("DATABASE_URL")
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()

    print("🚀 正在为 Neon PostgreSQL 数据库 deployments 表补充 cname_target 字段...")

    # 1. 为 deployments 表添加 cname_target 列
    cur.execute("""
        ALTER TABLE deployments 
        ADD COLUMN IF NOT EXISTS cname_target VARCHAR(255) DEFAULT 'cname.vercel-dns.com';
    """)
    print("✅ [Migration] 成功添加 deployments.cname_target 字段")

    # 2. 将默认的 'cname.vercel-dns.com' 填充至空字段
    cur.execute("""
        UPDATE deployments
        SET cname_target = 'cname.vercel-dns.com'
        WHERE cname_target IS NULL OR cname_target = '';
    """)
    print("✅ [Migration] 成功填充现有部署记录的 CNAME 解析目标")

    # 3. 重新创建 v_leads_full 视图，显式导出 cname_target 字段
    cur.execute("DROP VIEW IF EXISTS v_leads_full CASCADE;")
    cur.execute("""
        CREATE VIEW v_leads_full AS
        SELECT 
            l.id,
            l.place_id,
            l.name,
            l.category,
            l.address,
            l.city,
            l.canton,
            l.language,
            l.status,
            l.slug,
            l.subdomain,
            le.email,
            le.phone,
            le.website_hint,
            le.rating,
            le.review_count,
            le.google_maps_url,
            le.reviews_data,
            le.opening_hours,
            le.services_data,
            sc.admin_pass as admin_pass,
            sc.site_config,
            d.dns_verification,
            d.cname_target,
            d.vercel_status,
            d.godaddy_status,
            d.is_published,
            d.expires_at,
            l.created_at,
            l.updated_at
        FROM leads l
        LEFT JOIN lead_enrichments le ON l.id = le.lead_id
        LEFT JOIN site_configs sc ON l.id = sc.lead_id
        LEFT JOIN deployments d ON l.id = d.lead_id;
    """)
    print("✅ [Migration] 重新构建 `v_leads_full` 视图，成功显式导出 `cname_target`！")

    conn.commit()
    conn.close()

if __name__ == "__main__":
    migrate()
