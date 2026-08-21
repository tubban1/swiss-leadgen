"""
Vercel Agent — 域名自动化管理与所有权校验模块
使用 Vercel REST API 自动向 Vercel 多租户项目添加域名，提取验证所需的 TXT/CNAME 动态 Value，并触发自动校验
"""
import requests
import os
from config import VERCEL_TOKEN, VERCEL_TEAM_ID, VERCEL_PROJECT_ID

VERCEL_API_BASE = "https://api.vercel.com"


class VercelAgent:
    def __init__(self, project_id: str = None):
        self.project_id = project_id or VERCEL_PROJECT_ID or "multi_tenant_site"
        self.token = VERCEL_TOKEN
        self.team_id = VERCEL_TEAM_ID

        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json",
        }

    def add_or_get_domain(self, domain_name: str) -> dict:
        """
        向 Vercel 项目添加域名，并提取 Vercel 返回的独有所有权验证凭证 (TXT Value)
        返回包含 verified 状态与 verification 信息的字典
        """
        if not self.token:
            print(f"   ℹ️ [Vercel API] 未配置 VERCEL_TOKEN，返回模拟数据")
            return {"verified": True, "verification": []}

        url = f"{VERCEL_API_BASE}/v9/projects/{self.project_id}/domains"
        if self.team_id:
            url += f"?teamId={self.team_id}"

        payload = {"name": domain_name}
        print(f"   🚀 [Vercel API] 挂载 / 查询自定义域名 ➔ {domain_name} (Project: {self.project_id})")

        try:
            r = requests.post(url, headers=self.headers, json=payload, timeout=15)
            data = r.json()

            # 如果已经存在 (409 Conflict)，再次 GET 获取域名详情
            if r.status_code == 409 or "error" in data:
                get_url = f"{VERCEL_API_BASE}/v9/projects/{self.project_id}/domains/{domain_name}"
                if self.team_id:
                    get_url += f"?teamId={self.team_id}"
                r_get = requests.get(get_url, headers=self.headers, timeout=15)
                data = r_get.json()

            verified = data.get("verified", False)
            verification = data.get("verification", [])

            print(f"   📊 [Vercel API] 域名状态: verified={verified}")
            if verification:
                for item in verification:
                    print(f"      📌 提取验证凭证 -> Type: {item.get('type')}, Target: {item.get('domain')}, Value: {item.get('value')}")

            return {
                "name": domain_name,
                "verified": verified,
                "verification": verification,
                "raw": data
            }
        except Exception as e:
            print(f"   ❌ [Vercel API] 请求异常: {e}")
            return {"verified": False, "verification": []}

    def verify_domain(self, domain_name: str) -> bool:
        """
        DNS 在 GoDaddy 写入后，触发 Vercel 域名所有权校验
        """
        if not self.token:
            return True

        url = f"{VERCEL_API_BASE}/v9/projects/{self.project_id}/domains/{domain_name}/verify"
        if self.team_id:
            url += f"?teamId={self.team_id}"

        print(f"   🔄 [Vercel API] 触发所有权自动校验 ➔ {domain_name}")
        try:
            r = requests.post(url, headers=self.headers, timeout=15)
            res = r.json()
            verified = res.get("verified", False)
            if verified:
                print(f"   🎉 [Vercel API] 域名成功通过校验并激活上线: {domain_name}")
                return True
            else:
                print(f"   ℹ️ [Vercel API] 域名校验准备中 (等待 DNS 传播生效)...")
                return False
        except Exception as e:
            print(f"   ❌ [Vercel API] 校验请求异常: {e}")
            return False
