"""
一键修复 2 个新 Biel 商家在 leads 表中的 slug 与 subdomain 字段
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
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()

    cur.execute("""
        UPDATE leads
        SET slug = 'metropol-biel', subdomain = 'metropol-biel.sites.tubban.com'
        WHERE id = 'e6ee3518-672e-40e7-9bce-e1c796d12e3b';

        UPDATE leads
        SET slug = 'optik-biel', subdomain = 'optik-biel.sites.tubban.com'
        WHERE id = '09388e73-a239-4715-ad3d-f55cc129c44e';
    """)
    conn.commit()
    print("✅ 成功修复 metropol-biel 与 optik-biel 的 slug 及 subdomain 记录！")

    conn.close()

if __name__ == "__main__":
    fix()
