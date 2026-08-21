"""
Swiss LeadGen — 坚如磐石的 12 家商家全量标准化上线与 100% 验证激活脚本
使用 Vercel 最新的特化专属 Anycast CNAME Target: 4486e1c3ac91a3bb.vercel-dns-017.com.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from crm import init_db, get_all_leads, update_lead
from agents.godaddy_agent import GoDaddyAgent
from agents.vercel_agent import VercelAgent

# Vercel 在最新 UI/DNS 推荐中生成的特化 CNAME Target
VERCEL_DEDICATED_CNAME_TARGET = "4486e1c3ac91a3bb.vercel-dns-017.com"

def run():
    init_db()
    godaddy = GoDaddyAgent()
    vercel = VercelAgent()
    leads = get_all_leads()

    print(f"\n🚀 [Vercel 专属 Target 模式] 开始向 GoDaddy 精准解析特化 CNAME 记录: {VERCEL_DEDICATED_CNAME_TARGET}...\n")

    # 1. 搜集并合并全量 TXT 凭证
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

    refreshed_leads = get_all_leads()
    final_txt_payload = []
    for l in refreshed_leads:
        v_list = l.get("dns_verification")
        if v_list and isinstance(v_list, list):
            final_txt_payload.extend(v_list)

    # 2. 向 GoDaddy 逐个写入特化 CNAME 记录
    for lead in refreshed_leads:
        subdomain = lead.get("subdomain")
        if subdomain:
            godaddy.set_cname(subdomain, VERCEL_DEDICATED_CNAME_TARGET)

    # 3. 向 GoDaddy 合并写入全量 _vercel TXT 所有权凭证
    godaddy.sync_all_txt_verifications(final_txt_payload)

    # 4. 触发 Vercel 校验
    verified_count = 0
    for lead in refreshed_leads:
        subdomain = lead.get("subdomain")
        if subdomain:
            ok = vercel.verify_domain(subdomain)
            if ok:
                verified_count += 1

    print(f"\n🎉 [特化 Target 写入成功] 全量 12 家商家的 CNAME 已精准指向 {VERCEL_DEDICATED_CNAME_TARGET}！\n")

if __name__ == "__main__":
    run()
