"""
Swiss LeadGen — GoDaddy 全量 DNS 记录解析对照与一键配置工具
从 Neon PostgreSQL 数据库联表 (v_leads_full) 导出 12 家商户全量上线所需的 CNAME 与 TXT 解析配置表
"""
import sys
import json
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from crm import init_db, get_all_leads

def run():
    init_db()
    leads = get_all_leads()

    print(f"\n{'='*100}")
    print(f"🌐 🇨🇭 Swiss LeadGen — 12 家商家全量 GoDaddy DNS 部署解析记录全景对照表")
    print(f"{'='*100}\n")

    print(f"{'序号':<4} | {'商家名称':<30} | {'解析类型':<6} | {'Host (主机名)':<45} | {'Value (记录解析值)'}")
    print("-" * 130)

    dns_rows = []
    idx = 1
    for lead in leads:
        name = lead.get("name", "Unknown")
        subdomain = lead.get("subdomain")
        dns_v = lead.get("dns_verification")

        if not subdomain:
            continue

        # 1. CNAME 记录
        # 如果域名是 sanitaer-express-seeland.sites.tubban.com ➔ Host 前缀为 sanitaer-express-seeland.sites
        cname_host = subdomain.replace(".tubban.com", "")
        cname_val = "cname.vercel-dns.com"
        
        print(f"{idx:<4} | {name[:28]:<30} | {'CNAME':<6} | {cname_host:<45} | {cname_val}")
        dns_rows.append({"type": "CNAME", "name": cname_host, "value": cname_val, "merchant": name})
        idx += 1

        # 2. TXT 验证记录 (从数据库 deployments / dns_verification 列提取)
        if dns_v and isinstance(dns_v, list):
            for v_item in dns_v:
                v_type = v_item.get("type", "TXT").upper()
                v_domain = v_item.get("domain", "_vercel.tubban.com")
                v_val = v_item.get("value", "")

                txt_host = v_domain.replace(".tubban.com", "")
                if txt_host.endswith("."):
                    txt_host = txt_host[:-1]

                print(f"{idx:<4} | {name[:28]:<30} | {v_type:<6} | {txt_host:<45} | {v_val}")
                dns_rows.append({"type": v_type, "name": txt_host, "value": v_val, "merchant": name})
                idx += 1

    print("-" * 130)
    print(f"🎉 导出完成！共生成 {len(dns_rows)} 条 GoDaddy 精准解析规则。")

if __name__ == "__main__":
    run()
