"""
Vercel Agent — 域名自动化管理模块
使用 Vercel REST API 自动向 Vercel 多租户项目添加与移除域名 (Custom Domains)
"""
import requests
import os
from config import VERCEL_TOKEN, VERCEL_TEAM_ID

VERCEL_API_BASE = "https://api.vercel.com"
VERCEL_PROJECT = os.getenv("VERCEL_PROJECT_ID", "tubban-multi-tenant-site")


class VercelAgent:
    def __init__(self, project_id: str = VERCEL_PROJECT):
        self.project_id = project_id
        self.token = VERCEL_TOKEN
        self.team_id = VERCEL_TEAM_ID

        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json",
        }

    def add_domain(self, domain_name: str) -> bool:
        """
        向 Vercel 项目中自动添加并绑定一个自定义/子域名
        例如: add_domain("backerei-pierre-biel.sites.tubban.com")
        """
        if not self.token:
            print(f"   ℹ️ [Vercel API] 未配置 VERCEL_TOKEN，已记录模拟挂载域名: {domain_name}")
            return True

        url = f"{VERCEL_API_BASE}/v9/projects/{self.project_id}/domains"
        if self.team_id:
            url += f"?teamId={self.team_id}"

        payload = {"name": domain_name}
        print(f"   🚀 [Vercel API] 挂载自定义域名 ➔ {domain_name} (Project: {self.project_id})")

        try:
            r = requests.post(url, headers=self.headers, json=payload, timeout=15)
            if r.status_code in (200, 201):
                print(f"   ✅ [Vercel API] 域名绑定成功: {domain_name}")
                return True
            elif r.status_code == 409:
                print(f"   ℹ️ [Vercel API] 域名已存在并绑定: {domain_name}")
                return True
            else:
                print(f"   ⚠️ [Vercel API] 域名挂载响应 [{r.status_code}]: {r.text}")
                return False
        except Exception as e:
            print(f"   ❌ [Vercel API] 请求异常: {e}")
            return False

    def remove_domain(self, domain_name: str) -> bool:
        """
        从 Vercel 项目中移除自定义域名 (到期下线)
        """
        if not self.token:
            print(f"   ℹ️ [Vercel API] 未配置 VERCEL_TOKEN，跳过真实域名移除: {domain_name}")
            return True

        url = f"{VERCEL_API_BASE}/v9/projects/{self.project_id}/domains/{domain_name}"
        if self.team_id:
            url += f"?teamId={self.team_id}"

        print(f"   🔌 [Vercel API] 移除自定义域名 ➔ {domain_name}")
        try:
            r = requests.delete(url, headers=self.headers, timeout=15)
            if r.status_code in (200, 204):
                print(f"   ✅ [Vercel API] 域名成功解绑: {domain_name}")
                return True
            else:
                print(f"   ⚠️ [Vercel API] 域名解绑响应 [{r.status_code}]: {r.text}")
                return False
        except Exception as e:
            print(f"   ❌ [Vercel API] 删除请求异常: {e}")
            return False
