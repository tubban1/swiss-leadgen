"""
查询数据库中全量 Biel 商家及其建站状态
"""
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()
load_dotenv(Path(__file__).parent.parent / '.env')

import psycopg2

def list_merchants():
    db_url = os.getenv("DATABASE_URL")
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()

    cur.execute("""
        SELECT l.id, l.name, l.category, l.city, l.subdomain, l.status, sc.admin_pass, d.is_published
        FROM leads l
        LEFT JOIN site_configs sc ON l.id = sc.lead_id
        LEFT JOIN deployments d ON l.id = d.lead_id
        ORDER BY l.created_at DESC;
    """)
    rows = cur.fetchall()
    print(f"\n数据库中当前共有 {len(rows)} 家商户：\n")
    for r in rows:
        print(f"ID: {r[0]} | Name: {r[1]:<32} | Category: {r[2]:<12} | Subdomain: {r[4]:<40} | Pass: {r[6]} | Status: {r[5]}")
    
    conn.close()

if __name__ == "__main__":
    list_merchants()
