"""
检查新添加的 2 家商户在 Neon PostgreSQL 中的数据库字段
"""
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()
load_dotenv(Path(__file__).parent.parent / '.env')

import psycopg2

def check():
    db_url = os.getenv("DATABASE_URL")
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()

    cur.execute("""
        SELECT l.id, l.name, l.slug, l.subdomain, sc.admin_pass, sc.site_config
        FROM leads l
        LEFT JOIN site_configs sc ON l.id = sc.lead_id
        WHERE l.name ILIKE '%Metropol%' OR l.name ILIKE '%Optik%';
    """)
    rows = cur.fetchall()
    print("\n--- New Merchants DB Verification ---")
    for r in rows:
        print(f"ID: {r[0]}")
        print(f"Name: {r[1]}")
        print(f"Slug: {r[2]}")
        print(f"Subdomain: {r[3]}")
        print(f"Admin Pass: {r[4]}")
        print(f"Site Config Type: {type(r[5])}")
        print("-" * 50)

    conn.close()

if __name__ == "__main__":
    check()
