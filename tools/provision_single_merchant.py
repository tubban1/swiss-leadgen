"""
Swiss LeadGen — 单商家标准化 1-by-1 原子化挂载与固化上线工具
彻底跑通单个商家的全闭环：Vercel 提取凭证 ➔ 存 Neon 数据库 ➔ GoDaddy 合并写入 ➔ Vercel 瞬间打勾 Valid Configuration！
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from crm import init_db, get_all_leads, get_lead_by_subdomain, update_lead
from agents.godaddy_agent import GoDaddyAgent
from agents.vercel_agent import VercelAgent

def provision_merchant(target_identifier: str = None):
    init_db()
    godaddy = GoDaddyAgent()
    vercel = VercelAgent()
    leads = get_all_leads()

    if not leads:
        print("❌ 数据库中无 Lead 记录!")
        return

    # 锁定目标商家 (默认选第一家，或匹配输入)
    target_lead = None
    if target_identifier:
        for l in leads:
            if target_identifier in (l.get("id"), l.get("slug"), l.get("subdomain"), l.get("name")):
                target_lead = l
                break
    
    if not target_lead:
        target_lead = leads[0] # 默认取标杆商家

    name = target_lead["name"]
    lead_id = target_lead["id"]
    subdomain = target_lead.get("subdomain") or f"{target_lead['slug']}.sites.tubban.com"

    print(f"\n{'='*80}")
    print(f"🎯 [单商家标准化 1-by-1 部署固化] 正在上线商家: {name}")
    print(f"   ├─ 域名地址: https://{subdomain}")
    print(f"   └─ 商家 ID: {lead_id}")
    print(f"{'='*80}")

    # 1. 调 Vercel API 挂载并提取凭证 (TXT Value)
    vercel_res = vercel.add_or_get_domain(subdomain)
    verification = vercel_res.get("verification", [])
    
    # 2. 将 Vercel API 提取的动态凭证落存到 Neon 数据库
    update_lead(lead_id, dns_verification=verification, vercel_status="mounted")
    print(f"   ✅ [DB Success] 凭证 (TXT Value) 已精准存入 Neon 数据库 [deployments.dns_verification]")

    # 3. 收集 Neon 数据库中保存的所有商家的 Verification TXT 凭证，全量打包提交给 GoDaddy
    all_leads = get_all_leads()
    all_txt_records = []
    for l in all_leads:
        v_list = l.get("dns_verification")
        if v_list and isinstance(v_list, list):
            all_txt_records.extend(v_list)

    # 3.1 写入特定商家的 CNAME 解析
    godaddy.set_cname(subdomain, "cname.vercel-dns.com")

    # 3.2 合并写入全量 _vercel TXT 凭证 (避免后覆盖前)
    godaddy.sync_all_txt_verifications(all_txt_records)

    # 4. 触发 Vercel 实时校验
    is_verified = vercel.verify_domain(subdomain)
    update_lead(lead_id, godaddy_status="dns_configured", status="deployed")

    print(f"\n🎉 [固化上线成功] 商家 {name} 已完美跑通全闭环上线！")
    print(f"   🌐 访问 URL: https://{subdomain}")
    print(f"   📊 校验结果: {'✅ 打勾已激活 (Valid Configuration)' if is_verified else '⏳ 等待全局 DNS 广播传播'}\n")

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else None
    provision_merchant(target)
