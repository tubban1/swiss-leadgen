"""
探索所有可能返回 4486e1c3ac91a3bb.vercel-dns-017.com. 的 Vercel 端点
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

more_urls = [
    f"https://api.vercel.com/v6/domains/{domain}",
    f"https://api.vercel.com/v5/domains/{domain}",
    f"https://api.vercel.com/v4/domains/{domain}",
    f"https://api.vercel.com/v1/domains/{domain}",
    f"https://api.vercel.com/v9/projects/{PROJECT_ID}/domains/{domain}?verify=true",
    f"https://api.vercel.com/v6/domains/{domain}/config?strict=true",
    f"https://api.vercel.com/v9/projects/{PROJECT_ID}/domains/{domain}/verify",
]

for url in more_urls:
    try:
        r = requests.get(url, headers=headers)
        if r.status_code == 200:
            text = r.text
            print(f"\n✅ 匹配成功: {url}")
            print(text[:500])
            if "vercel-dns-" in text or "4486e" in text:
                print(f"🎯 找到了特化动态 CNAME Target: {text}")
        else:
            print(f"❌ {url} -> {r.status_code}")
    except Exception as e:
        print(f"Err: {e}")
