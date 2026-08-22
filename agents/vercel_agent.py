"""
Vercel Agent — 自动化管理域名挂载、动态凭证提取 (TXT Value) 与所有权验证
"""
import requests
from config import VERCEL_TOKEN, VERCEL_PROJECT_ID


class VercelAgent:
    def __init__(self):
        self.token = VERCEL_TOKEN
        self.project_id = VERCEL_PROJECT_ID
        self.base_url = "https://api.vercel.com"
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }

    def add_or_get_domain(self, domain_name: str) -> dict:
        """
        在 Vercel 指定 Project 下挂载或获取域名，并提取精准 Verification 凭证 (TXT Value)
        """
        url = f"{self.base_url}/v9/projects/{self.project_id}/domains"
        payload = {"name": domain_name}

        # 尝试新增挂载
        res = requests.post(url, headers=self.headers, json=payload)
        
        if res.status_code == 200:
            data = res.json()
            print(f"   🚀 [Vercel API] 成功挂载自定义域名 ➔ {domain_name}")
            return self._parse_domain_response(data)
        
        elif res.status_code == 409: # 域名已存在，查询已存在的域名状态与验证凭证
            get_url = f"{self.base_url}/v9/projects/{self.project_id}/domains/{domain_name}"
            get_res = requests.get(get_url, headers=self.headers)
            if get_res.status_code == 200:
                data = get_res.json()
                print(f"   ℹ️ [Vercel API] 域名已存在，获取现有配置 ➔ {domain_name}")
                return self._parse_domain_response(data)
            else:
                print(f"   ⚠️ [Vercel API] 查询域名失败 [{get_res.status_code}]: {get_res.text}")
                return {"domain": domain_name, "verified": False, "verification": []}
        else:
            print(f"   ⚠️ [Vercel API] 挂载域名失败 [{res.status_code}]: {res.text}")
            return {"domain": domain_name, "verified": False, "verification": []}

    def verify_domain(self, domain_name: str) -> bool:
        """
        触发 Vercel 对指定域名的所有权与 DNS 规则验证
        """
        url = f"{self.base_url}/v9/projects/{self.project_id}/domains/{domain_name}/verify"
        res = requests.post(url, headers=self.headers)
        
        if res.status_code == 200:
            data = res.json()
            is_verified = data.get("verified", False)
            if is_verified:
                print(f"   🎉 [Vercel API] 域名所有权与 DNS 校验成功！➔ {domain_name}")
            else:
                print(f"   ℹ️ [Vercel API] 域名校验准备中 (等待 DNS 传播生效)...")
            return is_verified
        else:
            print(f"   ⚠️ [Vercel API] 校验请求触发完毕 [{res.status_code}]")
            return False

    def remove_domain(self, domain_name: str) -> bool:
        """
        从 Vercel 项目中解绑删除域名
        """
        url = f"{self.base_url}/v9/projects/{self.project_id}/domains/{domain_name}"
        res = requests.delete(url, headers=self.headers)
        if res.status_code in (200, 204):
            print(f"   🗑️ [Vercel API] 已成功卸载/解绑域名 ➔ {domain_name}")
            return True
        else:
            print(f"   ⚠️ [Vercel API] 解绑域名失败 [{res.status_code}]: {res.text}")
            return False

    def get_domain_config(self, domain_name: str) -> dict:
        """
        调用 Vercel /v6/domains/{domain}/config API 提取真实特化的 CNAME Target 凭证
        """
        url = f"{self.base_url}/v6/domains/{domain_name}/config"
        res = requests.get(url, headers=self.headers)
        if res.status_code == 200:
            data = res.json()
            cnames = data.get("cnames", [])
            real_cname = cnames[0].rstrip(".") if cnames else "cname.vercel-dns.com"
            return {
                "cname_target": real_cname,
                "cnames_raw": cnames,
                "misconfigured": data.get("misconfigured", False),
                "raw": data
            }
        return {"cname_target": "cname.vercel-dns.com", "cnames_raw": [], "misconfigured": True}

    def _parse_domain_response(self, data: dict) -> dict:
        """
        提取 Vercel 响应数据中的验证凭证 (TXT Value) 及其真实的 CNAME Target
        """
        domain = data.get("name", "")
        verified = data.get("verified", False)
        verification = data.get("verification", [])
        
        # 实时查询 Vercel Config API 提取真实 CNAME 目标
        config_res = self.get_domain_config(domain)
        real_cname_target = config_res.get("cname_target", "cname.vercel-dns.com")

        # 打印提取到的关键凭证
        print(f"      📌 提取真实 CNAME Target ➔ {real_cname_target}")
        if verification:
            for item in verification:
                print(f"      📌 提取验证凭证 -> Type: {item.get('type')}, Target: {item.get('domain')}, Value: {item.get('value')}")
        
        return {
            "domain": domain,
            "verified": verified,
            "verification": verification,
            "cname_target": real_cname_target,
            "raw": data
        }

