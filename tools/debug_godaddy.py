"""
GoDaddy DNS 自动解析调优与全量绑定脚本
为 Neon 数据库中全部 12 家商家的子域名在 GoDaddy (tubban.com) 上逐个自动配置 CNAME 记录
"""
import sys
import requests
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from crm import init_db, get_all_leads
from config import GODADDY_TOKEN, GODADDY_API_KEY, GODADDY_API_SECRET, ROOT_DOMAIN

GODADDY_API_BASE = "https://api.godaddy.com/v1"
DOMAIN = "tubban.com"

def get_auth_header():
    if GODADDY_API_KEY and GODADDY_API_SECRET:
        return f"sso-key {GODADDY_API_KEY}:{GODADDY_API_SECRET}"
    elif GODADDY_TOKEN:
        return f"sso-key {GODADDY_TOKEN}"
    return ""

def run():
    init_db()
    leads = get_all_leads()
    auth = get_auth_header()

    print(f"\n🌐 [GoDaddy 全量 DNS 自动解析] 针对 {len(leads)} 个商家进行 GoDaddy 显式 CNAME 绑定...")
    print(f"   目标域名: {DOMAIN} | Auth Header 存在: {bool(auth)}")

    headers = {
        "Authorization": auth,
        "Content-Type": "application/json"
    }

    success = 0
    failed = 0

    for lead in leads:
        subdomain = lead.get("subdomain", "")
        if not subdomain:
            continue

        # 计算 prefix，如 backerei-pierre-biel.sites
        if subdomain.endswith(f".{DOMAIN}"):
            prefix = subdomain[:-len(f".{DOMAIN}")].strip(".")
        else:
            prefix = subdomain

        url = f"{GODADDY_API_BASE}/domains/{DOMAIN}/records/CNAME/{prefix}"
        data = [{
            "data": "cname.vercel-dns.com",
            "ttl": 600
        }]

        print(f"\n   ⚙️ [GoDaddy API] 正在解析: {prefix}.{DOMAIN} ➔ cname.vercel-dns.com")
        try:
            r = requests.put(url, headers=headers, json=data, timeout=15)
            if r.status_code in (200, 204):
                print(f"      ✅ 解析成功! [{prefix}.{DOMAIN}]")
                success += 1
            else:
                print(f"      ⚠️ 解析反馈 [{r.status_code}]: {r.text}")
                failed += 1
        except Exception as e:
            print(f"      ❌ 请求异常: {e}")
            failed += 1

    print(f"\n🎉 [GoDaddy 解析任务结束] 成功: {success} | 异常/需检查: {failed}\n")

if __name__ == "__main__":
    run()
