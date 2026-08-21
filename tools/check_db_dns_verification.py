"""
查验 Neon PostgreSQL 数据库中 leads 表 dns_verification 独立列保存的内容
"""
import sys
import json
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from crm import init_db, get_all_leads

def run():
    init_db()
    leads = get_all_leads()
    print(f"\n📊 检查 Neon 数据库 leads 表 [dns_verification] 独立列的存储情况:\n")

    for lead in leads:
        dns_v = lead.get("dns_verification")
        print(f"🏢 商家: {lead.get('name')} ({lead.get('subdomain')})")
        print(f"   └─ dns_verification 列保存内容: {json.dumps(dns_v, ensure_ascii=False)}")

if __name__ == "__main__":
    run()
