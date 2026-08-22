"""
深入探测 optik-biel.sites.tubban.com 与 metropol-biel.sites.tubban.com 在 Vercel API 返回的各种节点下的真实 Payload
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

def inspect(domain_name):
    print(f"\n" + "="*80)
    print(f"🔍 探测域名: {domain_name}")
    print("="*80)
    
    # 1. /v9/projects/{projectId}/domains/{domain}
    url1 = f"https://api.vercel.com/v9/projects/{VERCEL_PROJECT_ID}/domains/{domain_name}"
    res1 = requests.get(url1, headers=headers)
    print(f"\n1. GET /v9/projects/.../domains/{domain_name} [{res1.status_code}]")
    if res1.status_code == 200:
        print(json.dumps(res1.json(), indent=2, ensure_ascii=False))
        
    # 2. /v6/domains/{domain}/config
    url2 = f"https://api.vercel.com/v6/domains/{domain_name}/config"
    res2 = requests.get(url2, headers=headers)
    print(f"\n2. GET /v6/domains/{domain_name}/config [{res2.status_code}]")
    if res2.status_code == 200:
        print(json.dumps(res2.json(), indent=2, ensure_ascii=False))

    # 3. /v9/projects/{projectId}/domains
    url3 = f"https://api.vercel.com/v9/projects/{VERCEL_PROJECT_ID}/domains"
    res3 = requests.get(url3, headers=headers)
    if res3.status_code == 200:
        domains_list = res3.json().get("domains", [])
        for d in domains_list:
            if d.get("name") == domain_name:
                print(f"\n3. 在项目全量域名列表中查找到 {domain_name}:")
                print(json.dumps(d, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    inspect("optik-biel.sites.tubban.com")
    inspect("metropol-biel.sites.tubban.com")
