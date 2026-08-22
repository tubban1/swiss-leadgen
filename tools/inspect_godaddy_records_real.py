"""
直接使用系统定义的 GoDaddyAgent 查询 GoDaddy 上 tubban.com 的全量已设置 DNS 记录
"""
import os
import sys
import json
import requests
from pathlib import Path
from dotenv import load_dotenv

sys.path.insert(0, str(Path(__file__).parent.parent))

load_dotenv()
load_dotenv(Path(__file__).parent.parent / '.env')

from agents.godaddy_agent import GoDaddyAgent
from config import DOMAIN_ZONE

def check():
    agent = GoDaddyAgent()
    domain = DOMAIN_ZONE or "tubban.com"
    
    headers_list = agent._get_auth_headers_list()
    base_urls = agent.base_urls

    for base_url in base_urls:
        for headers in headers_list:
            url = f"{base_url}/v1/domains/{domain}/records"
            try:
                res = requests.get(url, headers=headers)
                if res.status_code == 200:
                    records = res.json()
                    print("\n" + "="*85)
                    print(f"📡 [GoDaddy Live API 成功获得实时响应] Endpoint: {url}")
                    print(f"🌐 域名 [{domain}] 在 GoDaddy 上的全量 DNS 记录 ({len(records)} 条):")
                    print("="*85)

                    cnames = [r for r in records if r.get("type") == "CNAME"]
                    txts = [r for r in records if r.get("type") == "TXT"]
                    others = [r for r in records if r.get("type") not in ("CNAME", "TXT")]

                    print(f"\n📌 --- GoDaddy 上的 CNAME 解析记录 ({len(cnames)} 条) ---")
                    for r in cnames:
                        print(f"  • Host (Subdomain): {r.get('name'):<40} ➔ Target: {r.get('data')}")

                    print(f"\n📌 --- GoDaddy 上的 TXT 凭证记录 ({len(txts)} 条) ---")
                    for r in txts:
                        print(f"  • Host (Subdomain): {r.get('name'):<40} ➔ Value: {r.get('data')}")

                    print("\n" + "="*85 + "\n")
                    return
            except Exception as e:
                pass

    print("⚠️ 无法调用 GoDaddy API，请检查 Key 或网络环境")

if __name__ == "__main__":
    check()
