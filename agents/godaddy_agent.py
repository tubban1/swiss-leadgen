"""
GoDaddy Agent — 自动化向 GoDaddy DNS Zone 添加 CNAME 与 TXT 域名验证记录
支持 API Key/Secret 与 PAT Token (gd_pat_...) 两种鉴权模式
"""
import os
import requests
from config import GODADDY_API_KEY, GODADDY_API_SECRET, DOMAIN_ZONE

GODADDY_TOKEN = os.getenv("GODADDY_TOKEN", "")


class GoDaddyAgent:
    def __init__(self):
        self.domain = DOMAIN_ZONE or "tubban.com"
        self.api_key = GODADDY_API_KEY
        self.api_secret = GODADDY_API_SECRET
        self.token = GODADDY_TOKEN
        
        self.base_urls = [
            "https://api.godaddy.com",
            "https://api.ote-godaddy.com"
        ]

    def _get_auth_headers_list(self) -> list:
        """
        根据 .env 中的配置，构建多种可能的 Authorization 请求头组合
        """
        headers_list = []
        
        # 1. 尝试使用 GODADDY_TOKEN (PAT Format)
        if self.token:
            headers_list.append({"Authorization": f"sso-key {self.token}", "Content-Type": "application/json"})
            headers_list.append({"Authorization": f"Bearer {self.token}", "Content-Type": "application/json"})

        # 2. 尝试使用 Key & Secret
        if self.api_key and self.api_secret:
            headers_list.append({"Authorization": f"sso-key {self.api_key}:{self.api_secret}", "Content-Type": "application/json"})

        if not headers_list:
            headers_list.append({"Authorization": f"sso-key {self.token or 'dummy'}", "Content-Type": "application/json"})

        return headers_list

    def set_cname(self, subdomain: str, target: str = "cname.vercel-dns.com") -> bool:
        """
        为给定的子域名写入 CNAME 解析
        """
        record_name = subdomain.replace(f".{self.domain}", "").strip()
        payload = [{"data": target, "ttl": 600}]

        return self._send_godaddy_request("CNAME", record_name, payload, f"{subdomain} ➔ {target}")

    def set_txt(self, name: str, value: str) -> bool:
        """
        添加/替换指定 TXT 验证记录
        """
        record_name = name.replace(f".{self.domain}", "").strip()
        if record_name.endswith("."):
            record_name = record_name[:-1]
            
        payload = [{"data": value, "ttl": 600}]

        return self._send_godaddy_request("TXT", record_name, payload, f"{record_name} ➔ Value: {value[:30]}...")

    def _send_godaddy_request(self, record_type: str, record_name: str, payload: list, desc: str) -> bool:
        """
        循环尝试 Authorization Header 变体与 Endpoint 发起 PUT 请求
        """
        headers_list = self._get_auth_headers_list()

        for base_url in self.base_urls:
            url = f"{base_url}/v1/domains/{self.domain}/records/{record_type}/{record_name}"
            for headers in headers_list:
                try:
                    res = requests.put(url, headers=headers, json=payload, timeout=10)
                    if res.status_code in (200, 204):
                        print(f"   🌐 [GoDaddy API] 成功写入 {record_type} 记录 [{base_url.split('//')[1]}]: {desc}")
                        return True
                    elif res.status_code == 404:
                        # 404 说明需要用 POST 增加新 Record 组
                        post_url = f"{base_url}/v1/domains/{self.domain}/records"
                        post_payload = [{"type": record_type, "name": record_name, "data": payload[0]["data"], "ttl": 600}]
                        post_res = requests.patch(post_url, headers=headers, json=post_payload, timeout=10)
                        if post_res.status_code in (200, 204):
                            print(f"   🌐 [GoDaddy API] 成功追加 {record_type} 记录 [{base_url.split('//')[1]}]: {desc}")
                            return True
                except Exception as e:
                    pass

        print(f"   ⚠️ [GoDaddy API] 写入失败 (鉴权或 Endpoint 限制) ➔ {desc}")
        return False
