"""
全量同步 Neon PostgreSQL 数据库中 leads 表与 site_configs 表的 admin_pass 强一致性
"""
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()
load_dotenv(Path(__file__).parent.parent / '.env')

import psycopg2

def sync():
    db_url = os.getenv("DATABASE_URL")
    print("Connecting to DB to synchronize admin passwords...")
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()

    # 1. 优先以 site_configs 表的 admin_pass 更新 leads 表
    cur.execute("""
        UPDATE leads l
        SET admin_pass = sc.admin_pass
        FROM site_configs sc
        WHERE l.id = sc.lead_id AND sc.admin_pass IS NOT NULL AND sc.admin_pass != '';
    """)

    # 2. 对于 site_configs 中没有 admin_pass 的，用 leads 表补全
    cur.execute("""
        UPDATE site_configs sc
        SET admin_pass = l.admin_pass
        FROM leads l
        WHERE sc.lead_id = l.id AND (sc.admin_pass IS NULL OR sc.admin_pass = '') AND l.admin_pass IS NOT NULL;
    """)

    conn.commit()
    print("✅ Successfully synchronized admin_pass across leads and site_configs tables!")

    # 打印当前 Bäckerei Müller 的最新密码
    cur.execute("""
        SELECT l.name, l.subdomain, l.admin_pass, sc.admin_pass 
        FROM leads l 
        LEFT JOIN site_configs sc ON l.id = sc.lead_id
        WHERE l.name ILIKE '%Müller%';
    """)
    res = cur.fetchall()
    print("\n--- Synchronized Result for Bäckerei Müller ---")
    for r in res:
        print(f"Name: {r[0]}")
        print(f"Subdomain: {r[1]}")
        print(f"Leads admin_pass: {r[2]}")
        print(f"SiteConfigs admin_pass: {r[3]}")

    conn.close()

if __name__ == "__main__":
    sync()
