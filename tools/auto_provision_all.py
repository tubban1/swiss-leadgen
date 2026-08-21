"""
Swiss LeadGen — 批量商家域名全自动化挂载与 DNS CNAME 绑定入口
遍历 Neon PostgreSQL 中存储的所有商家 Lead，
自动触发 Vercel REST API + GoDaddy DNS API 固化挂载流程。
"""
import sys
from pathlib import Path

# 添加项目根目录到 Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

from crm import init_db, get_all_leads
from agents.deploy_agent import DeployAgent

def run():
    init_db()
    deploy_agent = DeployAgent()
    
    leads = get_all_leads()
    print(f"\n🚀 开始对 Neon 数据库中的 {len(leads)} 个本地商家执行全自动化 Vercel & GoDaddy 域名挂载...")
    
    success_count = 0
    for lead in leads:
        try:
            res = deploy_agent.run(lead)
            if res.get("status") == "deployed":
                success_count += 1
        except Exception as e:
            print(f"❌ 挂载商家 {lead.get('name')} 时出现异常: {e}")

    print(f"\n🎉 全自动化挂载任务完成！成功处理并联通 {success_count} / {len(leads)} 家本地商业网站！")

if __name__ == "__main__":
    run()
