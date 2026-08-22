"""
从 Vercel Config API 提取全量商户的真实特化 CNAME Target (如 4486e1c3ac91a3bb.vercel-dns-017.com)
并精准更新持久化落盘至 Neon PostgreSQL 数据库 [deployments.cname_target]
"""
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

sys.path.insert(0, str(Path(__file__).parent.parent))

load_dotenv()
load_dotenv(Path(__file__).parent.parent / '.env')

from crm import init_db, get_all_leads, update_lead
from agents.vercel_agent import VercelAgent

def sync_real_cnames():
    init_db()
    vercel = VercelAgent()
    leads = get_all_leads()

    print("\n" + "="*80)
    print("🚀 [Vercel API 真实 Target 提取] 正在从 Vercel /v6/domains/config API 提取全量真实的 CNAME Value...")
    print("="*80 + "\n")

    synced_list = []

    for l in leads:
        name = l["name"]
        lead_id = l["id"]
        subdomain = l.get("subdomain")
        if not subdomain:
            continue

        # 调 Vercel Config API 实时拿真实的 CNAME Value
        cfg = vercel.get_domain_config(subdomain)
        real_cname = cfg.get("cname_target")

        # 落盘数据库
        update_lead(lead_id, cname_target=real_cname)
        synced_list.append((name, subdomain, real_cname))
        print(f"✅ 商户: {name:<32} | 域名: {subdomain:<40} ➔ 真实 CNAME Target: {real_cname}")

    print("\n" + "="*80)
    print("🔑 全量商户真实的 Vercel CNAME Target 成功更新并同步入库：")
    print("="*80)
    for name, sub, cname in synced_list:
        print(f"• {name:<32} ({sub}) ➔ {cname}")
    print("\n")

if __name__ == "__main__":
    sync_real_cnames()
