"""
Swiss LeadGen — 批量将 Neon 数据库中 12 家商家的 site_config 升级为标准 Site Config Schema
"""
import sys
import json
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from crm import init_db, get_all_leads, update_lead
from agents.website_builder import WebsiteBuilder

def run():
    init_db()
    builder = WebsiteBuilder()
    leads = get_all_leads()

    print(f"\n🚀 开始全量升级 12 家商家的 site_config 数据至【标准 Site Config Schema】...\n")

    for lead in leads:
        subdomain = lead.get("subdomain")
        slug = lead.get("slug") or (subdomain.split(".")[0] if subdomain else "merchant")
        
        # 重新生成符合标准 Schema 的完整 Site Config
        std_config = builder.build_standard_site_config(lead, subdomain)
        
        # 更新至 Neon PostgreSQL site_configs 表
        update_lead(lead["id"], site_config=std_config)
        print(f"   ✅ [DB 升级成功] {lead['name']} ({subdomain}) ➔ 标准 Site Config 已写入 site_configs 表！")

    print(f"\n🎉 12 家商家的 site_config 已全部无缝升级至最新标准 JSON Schema！\n")

if __name__ == "__main__":
    run()
