"""
更新 Neon PostgreSQL 中的 v_leads_full 视图，修正引用 site_config 列名，消除 500 报错
"""
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()
load_dotenv(Path(__file__).parent.parent / '.env')

import psycopg2

def fix():
    db_url = os.getenv("DATABASE_URL")
    print(f"Connecting to DB to fix v_leads_full view...")
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()

    cur.execute("DROP VIEW IF EXISTS v_leads_full CASCADE;")
    cur.execute("""
        CREATE VIEW v_leads_full AS
        SELECT 
            l.id, l.place_id, l.name, l.category, l.address, l.city, l.canton, l.language,
            l.email, l.phone, l.website_hint, l.rating, l.review_count, l.google_maps_url,
            l.slug, l.subdomain, l.admin_pass, l.status, l.is_published, l.created_at, l.updated_at,
            l.opening_hours, l.reviews_data, l.services_data, l.dns_verification, l.vercel_status, l.godaddy_status,
            COALESCE(sc.site_config, l.site_config) as site_config
        FROM leads l
        LEFT JOIN site_configs sc ON l.id = sc.lead_id;
    """)

    conn.commit()
    print("✅ Successfully recreated `v_leads_full` view in Neon PostgreSQL!")
    conn.close()

if __name__ == "__main__":
    fix()
