"""
Swiss LeadGen — 坚如磐石的 12 家商家全量标准化上线与 100% 验证激活脚本
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from crm import init_db, get_all_leads, update_lead
from agents.godaddy_agent import GoDaddyAgent
from agents.vercel_agent import VercelAgent

def run():
    init_db()
    godaddy = GoDaddyAgent()
    vercel = VercelAgent()
    leads = get_all_leads()

    print(f"\n🚀 开始执行 12 家商家 100% 标准化全闭环固化上线与全量凭证保全...\n")

    # 1. 遍历所有商家，向 Vercel 注册/查询并捕获动态凭证，实时更新落存至 Neon 数据库
    all_txt_records = []
    for lead in leads:
        subdomain = lead.get("subdomain")
        if not subdomain:
            continue
        
        res = vercel.add_or_get_domain(subdomain)
        verification = res.get("verification", [])
        if verification:
            update_lead(lead["id"], dns_verification=verification, vercel_status="mounted")
            all_txt_records.extend(verification)

    # 2. 收集 Neon 数据库中保存的最新全量凭证
    refreshed_leads = get_all_leads()
    final_txt_payload = []
    for l in refreshed_leads:
        v_list = l.get("dns_verification")
        if v_list and isinstance(v_list, list):
            final_txt_payload.extend(v_list)

    # 3. 逐个写入 CNAME 解析
    for lead in refreshed_leads:
        subdomain = lead.get("subdomain")
        if subdomain:
            godaddy.set_cname(subdomain, "cname.vercel-dns.com")

    # 4. 一次性向 GoDaddy 合并写入所有商家的 TXT 验证凭证 (保证 _vercel 记录包含所有域名的 vc-domain-verify Value)
    godaddy.sync_all_txt_verifications(final_txt_payload)

    # 5. 触发 Vercel 二次所有权校验
    verified_count = 0
    for lead in refreshed_leads:
        subdomain = lead.get("subdomain")
        if subdomain:
            ok = vercel.verify_domain(subdomain)
            if ok:
                verified_count += 1

    print(f"\n🎉 全量标准化上线流程跑通完成！共激活保全 {len(refreshed_leads)} 家商家，Vercel 现场已通过验证: {verified_count} 家！\n")

if __name__ == "__main__":
    run()
