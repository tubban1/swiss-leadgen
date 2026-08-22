"""
验证 cname_target 字段在 deployments 表与 v_leads_full 视图中的呈现
"""
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()
load_dotenv(Path(__file__).parent.parent / '.env')

import psycopg2

def verify():
    db_url = os.getenv("DATABASE_URL")
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()

    cur.execute("""
        SELECT name, subdomain, cname_target, vercel_status, godaddy_status
        FROM v_leads_full
        LIMIT 5;
    """)
    rows = cur.fetchall()
    print("\n✅ [v_leads_full 视图验证] 成功查询到 cname_target 字段：\n")
    for r in rows:
        print(f"Merchant: {r[0]:<32} | Subdomain: {r[1]:<40} | CNAME Target: {r[2]:<25} | Status: {r[3]}/{r[4]}")
    
    conn.close()

if __name__ == "__main__":
    verify()
