"""
深度测试 Vercel 域名 Config / DNS 校验 API，提取真实的 CNAME Value (如 4486e1c3ac91a3bb.vercel-dns-017.com 或 cname.vercel-dns.com)
"""
import os
import json
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()
load_dotenv(Path(__file__).parent.parent / '.env')

VERCEL_TOKEN = os.getenv("VERCEL_TOKEN", "")
VERCEL_PROJECT_ID = os.getenv("VERCEL_PROJECT_ID", "multi_tenant_site")
headers = {
    "Authorization": f"Bearer {VERCEL_TOKEN}",
    "Content-Type": "application/json"
}

def inspect_all_endpoints(domain_name="backerei-muller.tubban.com"):
    endpoints = [
        f"https://api.vercel.com/v6/domains/{domain_name}/config",
        f"https://api.vercel.com/v9/projects/{VERCEL_PROJECT_ID}/domains/{domain_name}",
        f"https://api.vercel.com/v6/domains/{domain_name}",
    ]
    
    for url in endpoints:
        print(f"\n==================================================")
        print(f"🔍 [GET Payload] Endpoint: {url}")
        res = requests.get(url, headers=headers)
        print(f"Status: {res.status_code}")
        if res.status_code == 200:
            print(json.dumps(res.json(), indent=2, ensure_ascii=False))
        else:
            print("Response:", res.text)

if __name__ == "__main__":
    inspect_all_endpoints()
