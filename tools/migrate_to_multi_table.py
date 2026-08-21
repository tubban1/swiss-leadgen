"""
Swiss LeadGen — 数据库解耦多表 Migration 迁移工具
创建 4 大标准解耦表 (leads, lead_enrichments, site_configs, deployments) 并初始化表数据
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from crm import init_db, get_all_leads

def run():
    print("🚀 开始执行多表解耦数据库 Migration 升级...")
    init_db()
    
    leads = get_all_leads()
    print(f"📊 已成功初始化 4 大领域解耦表与 v_leads_full 整合视图！共有 {len(leads)} 个商家联表数据保持平滑在线。")

if __name__ == "__main__":
    run()
