"""
Swiss LeadGen — 全闭环 4 步网络挂载与 DNS 凭证数据流转测试脚本
从 Vercel 获取真实 TXT 验证 Value -> 存 Neon DB -> 提取存入数据写入 GoDaddy -> 触发 Vercel 二次校验
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from crm import init_db, get_all_leads
from agents.deploy_agent import DeployAgent

def run():
    init_db()
    deploy_agent = DeployAgent()
    
    leads = get_all_leads()
    print(f"\n⚡ [全闭环测试] 针对 Neon 数据库中的 {len(leads)} 个商家执行 4 步凭证提取、存库、GoDaddy 写入与 Vercel 校验...")
    
    count = 0
    for lead in leads:
        try:
            res = deploy_agent.run(lead)
            count += 1
        except Exception as e:
            print(f"❌ 处理商家 {lead.get('name')} 时出现异常: {e}")

    print(f"\n🎉 全闭环数据流转流水线运行完成！已成功处理并关联 {count} / {len(leads)} 家商家站点！")

if __name__ == "__main__":
    run()
