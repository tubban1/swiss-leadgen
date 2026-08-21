"""
查验解耦多表 (leads, lead_enrichments, site_configs, deployments) 数据拆分保存情况
"""
import sys
import json
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from crm import db

def run():
    conn = db.get_connection()
    with conn.cursor() as cur:
        cur.execute("SELECT COUNT(*) FROM leads;")
        count_leads = cur.fetchone()[0]

        cur.execute("SELECT COUNT(*) FROM lead_enrichments;")
        count_enrich = cur.fetchone()[0]

        cur.execute("SELECT COUNT(*) FROM site_configs WHERE site_config IS NOT NULL;")
        count_sites = cur.fetchone()[0]

        cur.execute("SELECT COUNT(*) FROM deployments WHERE dns_verification IS NOT NULL;")
        count_deploy = cur.fetchone()[0]

        print("\n📊 Neon PostgreSQL 解耦多表存储统计结果:")
        print(f"   ├─ 1. [leads 主表] 记录总数: {count_leads} 条")
        print(f"   ├─ 2. [lead_enrichments 富化表] 记录总数: {count_enrich} 条")
        print(f"   ├─ 3. [site_configs 站点建站表] 完整保存 site_config 的记录数: {count_sites} 条")
        print(f"   └─ 4. [deployments 网络部署凭证表] 完整保存 dns_verification (TXT Value) 的记录数: {count_deploy} 条\n")

    conn.close()

if __name__ == "__main__":
    run()
