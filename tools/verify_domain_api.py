import os
import time
import requests
from dotenv import load_dotenv

load_dotenv()

token = os.getenv("VERCEL_TOKEN")
headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

project_id = "prj_QWd5Dgvqrs4A8ogrUBPlf67L717t"
domain = "*.sites.tubban.com"

print("🔍 正在通过 Vercel API 尝试验证域名 *.sites.tubban.com ...")

for i in range(1, 10):
    # 尝试触发 verify 接口
    r = requests.post(
        f"https://api.vercel.com/v9/projects/{project_id}/domains/{domain}/verify",
        headers=headers
    )
    res = r.json()
    verified = res.get("verified", False)
    
    if verified:
        print("\n🎉🎉🎉 [Vercel API] 通配符域名 *.sites.tubban.com 成功通过验证！(Verified: True)")
        break
    else:
        print(f"   [{i}/10] 验证未通过，当前状态: pending ... 等待 5 秒重试")
        time.sleep(5)
