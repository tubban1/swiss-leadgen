"""
彻底移除重复的密码列，保留 site_configs 表中的 admin_pass 作为唯一 Single Source of Truth
"""
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()
load_dotenv(Path(__file__).parent.parent / '.env')

import psycopg2

def run():
    db_url = os.getenv("DATABASE_URL")
    print("Connecting to Neon PostgreSQL...")
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()

    # 1. 先确保 site_configs 中的 admin_pass 完备
    cur.execute("""
        UPDATE site_configs sc
        SET admin_pass = l.admin_pass
        FROM leads l
        WHERE sc.lead_id = l.id AND (sc.admin_pass IS NULL OR sc.admin_pass = '') AND l.admin_pass IS NOT NULL;
    """)

    # 2. DROP 掉 leads 表中的 admin_pass 冗余列
    cur.execute("ALTER TABLE leads DROP COLUMN IF EXISTS admin_pass CASCADE;")
    print("✅ Successfully dropped redundant `admin_pass` column from `leads` table!")

    # 3. 重新创建 v_leads_full 视图，明确 admin_pass 仅来自 site_configs 表
    cur.execute("DROP VIEW IF EXISTS v_leads_full CASCADE;")
    cur.execute("""
        CREATE VIEW v_leads_full AS
        SELECT 
            l.id, l.place_id, l.name, l.category, l.address, l.city, l.canton, l.language,
            l.email, l.phone, l.website_hint, l.rating, l.review_count, l.google_maps_url,
            l.slug, l.subdomain, l.status, l.is_published, l.created_at, l.updated_at,
            l.opening_hours, l.reviews_data, l.services_data, l.dns_verification, l.vercel_status, l.godaddy_status,
            sc.admin_pass as admin_pass,
            sc.site_config as site_config
        FROM leads l
        LEFT JOIN site_configs sc ON l.id = sc.lead_id;
    """)
    print("✅ Recreated `v_leads_full` view using single `sc.admin_pass`!")

    conn.commit()

    # 4. 打印全量商户唯一的 admin_pass 清单
    cur.execute("""
        SELECT l.name, l.subdomain, sc.admin_pass
        FROM leads l
        LEFT JOIN site_configs sc ON l.id = sc.lead_id;
    """)
    rows = cur.fetchall()
    print("\n==========================================================================")
    print("🔑 全量商户 Single Source of Truth (唯一的 admin_pass)")
    print("==========================================================================")
    for r in rows:
        print(f"Business: {r[0]:<35} | Subdomain: {r[1]:<35} | Pass: {r[2]}")
    print("==========================================================================")

    conn.close()

if __name__ == "__main__":
    run()
