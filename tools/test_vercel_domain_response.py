"""
测试 Vercel API 响应并提取域名验证所需的 TXT/CNAME 真实 Value
"""
import sys
import requests
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from config import VERCEL_TOKEN, VERCEL_PROJECT_ID

VERCEL_API_BASE = "https://api.vercel.com"

def run():
    domain = "sanitaer-express-seeland.sites.tubban.com"
    project = VERCEL_PROJECT_ID or "multi_tenant_site"
    
    headers = {
        "Authorization": f"Bearer {VERCEL_TOKEN}",
        "Content-Type": "application/json"
    }
    
    # 获取特定域名的详细配置与验证信息
    url = f"{VERCEL_API_BASE}/v9/projects/{project}/domains/{domain}"
    print(f"🚀 请求 Vercel API 域名详情: {url}")
    
    r = requests.get(url, headers=headers)
    print(f"HTTP Status: {r.status_code}")
    print("Response JSON:")
    import json
    print(json.dumps(r.json(), indent=2))

if __name__ == "__main__":
    run()
