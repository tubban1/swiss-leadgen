"""
GoDaddy Agent — DNS 记录管理
负责自动添加与移除 CNAME 记录，实现子域名 (xxx.tubban.com) 自动绑定与下线
支持 GODADDY_TOKEN (Personal Access Token) 或 GODADDY_API_KEY/SECRET 验证
"""
import requests
from config import GODADDY_TOKEN, GODADDY_API_KEY, GODADDY_API_SECRET, ROOT_DOMAIN

GODADDY_API_BASE = "https://api.godaddy.com/v1"


class GoDaddyAgent:
    def __init__(self, domain: str = ROOT_DOMAIN):
        self.domain = domain
        
        # 优先使用 GODADDY_TOKEN
        if GODADDY_TOKEN:
            auth_val = f"sso-key {GODADDY_TOKEN}"
        elif GODADDY_API_KEY and GODADDY_API_SECRET:
            auth_val = f"sso-key {GODADDY_API_KEY}:{GODADDY_API_SECRET}"
        else:
            auth_val = ""

        self.headers = {
            "Authorization": auth_val,
            "Content-Type": "application/json",
        }

    def set_cname(self, record_name: str, target: str) -> bool:
        """
        添加/更新一条 CNAME 记录
        例如: set_cname("backerei-muller", "cname.vercel-dns.com")
        """
        url = f"{GODADDY_API_BASE}/domains/{self.domain}/records/CNAME/{record_name}"
        data = [{
            "data": target,
            "ttl": 600,
        }]
        print(f"   🌐 [GoDaddy API] 配置 CNAME 记录: {record_name}.{self.domain} ➔ {target}")
        
        if not self.headers.get("Authorization"):
            print("   ℹ️ 未完整配置 GODADDY_TOKEN，跳过真实 GoDaddy DNS 修改")
            return True

        r = requests.put(url, headers=self.headers, json=data, timeout=15)
        if r.status_code in (200, 204):
            print(f"   ✅ CNAME 记录创建成功: {record_name}.{self.domain}")
            return True
        else:
            print(f"   ❌ GoDaddy API 错误 [{r.status_code}]: {r.text}")
            r.raise_for_status()

    def delete_cname(self, record_name: str) -> bool:
        """
        到期下线：移除特定 CNAME 记录
        """
        url = f"{GODADDY_API_BASE}/domains/{self.domain}/records/CNAME/{record_name}"
        print(f"   🌐 [GoDaddy API] 删除 CNAME 记录: {record_name}.{self.domain}")

        if not self.headers.get("Authorization"):
            print("   ℹ️ 未完整配置 GODADDY_TOKEN，跳过真实 DNS 删除")
            return True

        r = requests.delete(url, headers=self.headers, timeout=15)
        if r.status_code in (200, 204):
            print(f"   ✅ CNAME 记录已删除: {record_name}.{self.domain}")
            return True
        else:
            print(f"   ⚠️ GoDaddy 删除提示 [{r.status_code}]: {r.text}")
            return False
