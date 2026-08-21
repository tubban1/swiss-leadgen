"""
检查 Neon PostgreSQL 数据库中 site_configs 表的真实列名
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
    print(f"Connecting to DB...")
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()

    cur.execute("""
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'site_configs';
    """)
    cols = cur.fetchall()
    print("\nColumns in `site_configs` table:")
    for c in cols:
        print(f" - {c[0]}: {c[1]}")

    cur.execute("""
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'leads';
    """)
    cols_leads = cur.fetchall()
    print("\nColumns in `leads` table:")
    for c in cols_leads:
        print(f" - {c[0]}: {c[1]}")

    conn.close()

if __name__ == "__main__":
    check()
