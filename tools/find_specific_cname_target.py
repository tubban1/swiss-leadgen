"""
瑞士 LeadGen — 深度探索 Vercel API 以获取特化动态 CNAME Target (如 4486e1c3ac91a3bb.vercel-dns-017.com.)
"""
import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

TOKEN = os.getenv("VERCEL_TOKEN")
PROJECT_ID = os.getenv("VERCEL_PROJECT_ID", "multi_tenant_site")

headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

domain = "backerei-muller.tubban.com"

endpoints = [
    f"https://api.vercel.com/v9/projects/{PROJECT_ID}/domains/{domain}",
    f"https://api.vercel.com/v6/domains/{domain}/config",
    f"https://api.vercel.com/v5/domains/{domain}",
    f"https://api.vercel.com/v9/projects/{PROJECT_ID}/domains",
]

print(f"\n🔍 [Vercel 深度探索] 开始全量扫描 {domain} 在各 API 节点中的 CNAME 动态 Value...")

for url in endpoints:
    try:
        r = requests.get(url, headers=headers)
        print(f"\n📡 接口: {url} -> Status {r.status_code}")
        if r.status_code == 200:
            data = r.json()
            print(json.dumps(data, indent=2, ensure_ascii=False))
    except Exception as e:
        print(f"Error: {e}")
