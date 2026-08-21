"""
Swiss LeadGen — 商家 site_config 填充与全中间态联通脚本
遍历 Neon 数据库中全部 12 个 Lead，调用 SiteBuilderAgent 生成丰富无比的 Awwwards site_config，
并持久化更新到数据库中！
"""
import sys
import json
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from crm import init_db, get_all_leads, update_lead
from agents.site_builder_agent import SiteBuilderAgent

def run():
    init_db()
    site_builder = SiteBuilderAgent()
    leads = get_all_leads()

    print(f"\n🎨 [SiteBuilderAgent] 开始为 {len(leads)} 个商家动态生成与填充 Awwwards site_config...\n")

    updated_count = 0
    for lead in leads:
        lead_id = lead["id"]
        site_cfg = site_builder.build_site_config(lead)
        
        # 将 site_config 更新持久化存入 Neon 数据库
        update_lead(
            lead_id, 
            site_config=site_cfg,
            status="configured" if lead.get("status") == "discovered" else lead.get("status")
        )
        updated_count += 1
        print(f"   ✅ [DB Saved] 商家 [{lead['name']}] site_config 已生成并保存至 Neon PostgreSQL 数据库!")
        print(f"      ├─ 品牌主题: {site_cfg['theme']['theme']} | 评分: ★ {site_cfg['rating_summary']['score']}")
        print(f"      └─ 评价墙保存数量: {len(site_cfg['reviews'])} 条 Google 验证评论")

    print(f"\n🎉 成功为 {updated_count} / {len(leads)} 家商户在数据库中生成并存储了完整的 site_config 配置！\n")

if __name__ == "__main__":
    run()
