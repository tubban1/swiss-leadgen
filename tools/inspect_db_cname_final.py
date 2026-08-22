"""
最终查询 Neon PostgreSQL 数据库 deployments 表中落存的真实 cname_target 结果
"""
import os
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
        SELECT l.name, d.subdomain, d.cname_target, d.dns_verification
        FROM deployments d
        JOIN leads l ON d.lead_id = l.id
        ORDER BY d.created_at DESC;
    """)
    rows = cur.fetchall()
    print("\n" + "="*90)
    print("🔑 [Neon PostgreSQL Database] 全量商户存入的真实 Vercel CNAME Target 清单")
    print("="*90)
    for r in rows:
        verification_sample = (r[3][:45] + "...") if r[3] else "None"
        print(f"商户: {r[0]:<32} | 真实 CNAME Target: {r[2]:<40} | TXT 凭证: {verification_sample}")
    print("="*90 + "\n")

    conn.close()

if __name__ == "__main__":
    check()
