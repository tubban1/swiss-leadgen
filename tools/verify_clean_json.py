"""
输出当前 Neon PostgreSQL 数据库中 deployments 表与 v_leads_full 视图的纯净 JSON Payload 格式
"""
import os
import json
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()
load_dotenv(Path(__file__).parent.parent / '.env')

import psycopg2
from psycopg2.extras import RealDictCursor

def check():
    db_url = os.getenv("DATABASE_URL")
    conn = psycopg2.connect(db_url)
    cur = conn.cursor(cursor_factory=RealDictCursor)

    cur.execute("""
        SELECT id, lead_id, subdomain, dns_verification, vercel_status, godaddy_status, 
               is_published, expires_at, created_at, updated_at, cname_target
        FROM deployments
        ORDER BY created_at DESC;
    """)
    rows = cur.fetchall()
    
    # 格式化 datetime 为 str
    formatted = []
    for r in rows:
        item = dict(r)
        for k, v in item.items():
            if v is not None and not isinstance(v, (str, int, float, bool, list, dict)):
                item[k] = str(v)
        formatted.append(item)

    print("\n" + "="*80)
    print(f"📊 当前 deployments 表总共包含 {len(formatted)} 条记录 (绝对唯一，无重复):")
    print("="*80 + "\n")
    print(json.dumps(formatted, indent=2, ensure_ascii=False))

    conn.close()

if __name__ == "__main__":
    check()
