"""
Swiss LeadGen — 自动化将 Neon PostgreSQL 数据库中所有 12 家商家的 CNAME 与 TXT 验证凭证提交给 GoDaddy API 保存
"""
import sys
import json
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from crm import init_db, get_all_leads
from agents.godaddy_agent import GoDaddyAgent
from agents.vercel_agent import VercelAgent

def run():
    init_db()
    godaddy = GoDaddyAgent()
    vercel = VercelAgent()
    leads = get_all_leads()

    print(f"\n⚡ 开始自动向 GoDaddy API 提交 12 个商家全量 DNS 凭证保存与上线...\n")

    cname_success = 0
    txt_success = 0

    for lead in leads:
        name = lead.get("name")
        subdomain = lead.get("subdomain")
        dns_v = lead.get("dns_verification")

        if not subdomain:
            continue

        print(f"🏢 处理商家: {name} ({subdomain})")
        
        # 1. 自动调用 GoDaddy 写入 CNAME 记录
        ok_cname = godaddy.set_cname(subdomain, "cname.vercel-dns.com")
        if ok_cname:
            cname_success += 1

        # 2. 自动调用 GoDaddy 写入 TXT 验证记录
        if dns_v and isinstance(dns_v, list):
            for v_item in dns_v:
                v_type = v_item.get("type", "TXT").upper()
                v_domain = v_item.get("domain", "_vercel.tubban.com")
                v_val = v_item.get("value", "")

                if v_type == "TXT" and v_val:
                    ok_txt = godaddy.set_txt(v_domain, v_val)
                    if ok_txt:
                        txt_success += 1

        # 3. 自动向 Vercel 触发二次校验请求
        vercel.verify_domain(subdomain)
        print("-" * 75)

    print(f"\n🎉 自动同步完成！成功向 GoDaddy 写入 CNAME: {cname_success} 条, TXT 凭证: {txt_success} 条！")

if __name__ == "__main__":
    run()
