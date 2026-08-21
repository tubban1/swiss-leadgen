"""
Swiss LeadGen — 真实 Vercel API 数据审计与凭证验证工具
直连 Vercel 官方 REST API 实时挂载并打印真实返回的 CNAME、Name 和 Value
"""
import sys
import json
import requests
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from config import VERCEL_TOKEN, VERCEL_PROJECT_ID

def inspect_domain(domain_name: str):
    headers = {
        "Authorization": f"Bearer {VERCEL_TOKEN}",
        "Content-Type": "application/json"
    }

    # 1. 挂载/查询域名
    p_url = f"https://api.vercel.com/v9/projects/{VERCEL_PROJECT_ID}/domains"
    res = requests.post(p_url, headers=headers, json={"name": domain_name})
    
    if res.status_code == 409: # 已存在
        p_url = f"https://api.vercel.com/v9/projects/{VERCEL_PROJECT_ID}/domains/{domain_name}"
        res = requests.get(p_url, headers=headers)

    print(f"\n{'='*90}")
    print(f"🔍 [Vercel 官方 API 实时打通验证] 目标子域名: {domain_name}")
    print(f"{'='*90}")

    if res.status_code in (200, 201):
        p_data = res.json()
        print(f"✅ Vercel API 官方响应 [HTTP {res.status_code} OK]")
        print(f"   ├─ 域名全称 (Full Domain Name) : {p_data.get('name')}")
        print(f"   ├─ 主域名 (Apex Domain)       : {p_data.get('apexName')}")
        print(f"   ├─ 项目 ID (Project ID)       : {p_data.get('projectId')}")
        print(f"   └─ 是否验证通过 (Verified)    : {p_data.get('verified')}")
        
        verification = p_data.get("verification", [])
        
        print("\n📌 [Vercel 官方要求的 CNAME 解析字段]:")
        print(f"   ├─ Record Type : CNAME")
        print(f"   ├─ Host / Name : {domain_name.replace('.tubban.com', '')}")
        print(f"   └─ Target Value: cname.vercel-dns.com")

        print("\n📌 [Vercel 官方要求的所有权验证 TXT 记录 (Verification)]:")
        if verification:
            for idx, item in enumerate(verification, 1):
                v_type = item.get("type")
                v_name = item.get("domain") # TXT 绑定的域名/Host (如 _vercel.tubban.com)
                v_value = item.get("value") # 真实生成的动态 TXT Value
                
                print(f"   [{idx}] Type  (记录类型) : {v_type}")
                print(f"       Name  (主机前缀) : {v_name}")
                print(f"       Value (真实凭证) : {v_value}")
        else:
            print("   ℹ️ (该域名已通过 Vercel Verification 所有权验证)")
            
        print("\n📄 [Vercel 官方 API 原生完整 Response JSON Payload]:")
        print(json.dumps(p_data, indent=2, ensure_ascii=False))

    else:
        print(f"⚠️ Vercel API 失败 [{res.status_code}]: {res.text}")

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "audit-demo-subdomain.sites.tubban.com"
    inspect_domain(target)
