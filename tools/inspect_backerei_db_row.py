"""
查询 Neon 数据库中 Bäckerei Müller 记录的真实 subdomain, slug, admin_pass 以及 site_configs 表里的记录
"""
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()
load_dotenv(Path(__file__).parent.parent / '.env')

import psycopg2

def inspect():
    db_url = os.getenv("DATABASE_URL")
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()

    cur.execute("""
        SELECT l.id, l.name, l.slug, l.subdomain, l.admin_pass, sc.admin_pass as sc_admin_pass, sc.subdomain as sc_subdomain
        FROM leads l
        LEFT JOIN site_configs sc ON l.id = sc.lead_id
        WHERE l.name ILIKE '%Müller%' OR l.subdomain ILIKE '%backerei%' OR l.slug ILIKE '%backerei%';
    """)
    rows = cur.fetchall()
    print("\n--- Rows found for Bäckerei ---")
    for r in rows:
        print(f"ID: {r[0]}")
        print(f"Name: {r[1]}")
        print(f"Slug: {r[2]}")
        print(f"Subdomain: {r[3]}")
        print(f"Leads Admin Pass: '{r[4]}'")
        print(f"SiteConfigs Admin Pass: '{r[5]}'")
        print(f"SiteConfigs Subdomain: '{r[6]}'")
        print("-" * 50)

    conn.close()

if __name__ == "__main__":
    inspect()
