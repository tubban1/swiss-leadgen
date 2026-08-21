import os
import time
import requests
from dotenv import load_dotenv

load_dotenv()

godaddy_token = os.getenv("GODADDY_TOKEN")
vercel_token = os.getenv("VERCEL_TOKEN")
project_id = "prj_QWd5Dgvqrs4A8ogrUBPlf67L717t"

godaddy_headers = {
    "Authorization": f"Bearer {godaddy_token}",
    "Content-Type": "application/json"
}

vercel_headers = {
    "Authorization": f"Bearer {vercel_token}",
    "Content-Type": "application/json"
}

print("🚀 [全自动接管模式] 正在用 GoDaddy API 校验并修正全网 DNS 记录...")

# 1. 设置 *.sites CNAME 指向 4486e1c3ac91a3bb.vercel-dns-017.com
cname_payload = [
    {
        "data": "4486e1c3ac91a3bb.vercel-dns-017.com",
        "ttl": 600
    }
]

r_gd = requests.put(
    "https://api.godaddy.com/v1/domains/tubban.com/records/CNAME/*.sites",
    headers=godaddy_headers,
    json=cname_payload
)
print(f"  └─ GoDaddy CNAME (*.sites) 更新状态: {r_gd.status_code}")

# 2. 检查 Vercel 要求的最新 TXT 验证码
r_v = requests.get(f"https://api.vercel.com/v9/projects/{project_id}/domains/*.sites.tubban.com", headers=vercel_headers)
v_data = r_v.json()
verification = v_data.get("verification", [])
txt_value = None
if verification:
    txt_value = verification[0].get("value")

if txt_value:
    print(f"  └─ 发现最新 Vercel TXT 校验码: {txt_value}")
    txt_payload = [
        {
            "data": txt_value,
            "ttl": 600
        }
    ]
    r_txt = requests.put(
        "https://api.godaddy.com/v1/domains/tubban.com/records/TXT/_vercel",
        headers=godaddy_headers,
        json=txt_payload
    )
    print(f"  └─ GoDaddy TXT (_vercel) 自动写入状态: {r_txt.status_code}")

print("\n⏳ 正在自动向 Vercel 提交 API 校验激活请求...")

for i in range(1, 15):
    # 触发 Vercel 域名 verify 接口
    requests.post(
        f"https://api.vercel.com/v9/projects/{project_id}/domains/*.sites.tubban.com/verify",
        headers=vercel_headers
    )
    
    # 获取 config 状态
    r_cfg = requests.get(
        f"https://api.vercel.com/v6/domains/*.sites.tubban.com/config",
        headers=vercel_headers
    )
    cfg = r_cfg.json()
    misconfigured = cfg.get("misconfigured", True)
    
    # 获取 domain verified 状态
    r_dom = requests.get(
        f"https://api.vercel.com/v9/projects/{project_id}/domains/*.sites.tubban.com",
        headers=vercel_headers
    )
    dom = r_dom.json()
    verified = dom.get("verified", False)
    
    print(f"  [{i}/15] 验证状态: Verified={verified}, Misconfigured={misconfigured}")
    
    if verified and not misconfigured:
        print("\n🎉🎉🎉 [全自动激活成功] *.sites.tubban.com 在 Vercel 100% 验证成功并打上绿色打钩！")
        break
    time.sleep(4)
