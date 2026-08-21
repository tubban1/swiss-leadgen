"""
GoDaddy Agent — 自动化向 GoDaddy DNS Zone 添加 CNAME 与合并 TXT 域名验证记录
支持 API PAT Token (gd_pat_...) 鉴权与多 TXT 凭证全量合并写入
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
        headers_list = []
        if self.token:
            headers_list.append({"Authorization": f"sso-key {self.token}", "Content-Type": "application/json"})
            headers_list.append({"Authorization": f"Bearer {self.token}", "Content-Type": "application/json"})
        if self.api_key and self.api_secret:
            headers_list.append({"Authorization": f"sso-key {self.api_key}:{self.api_secret}", "Content-Type": "application/json"})
        if not headers_list:
            headers_list.append({"Authorization": f"sso-key {self.token or 'dummy'}", "Content-Type": "application/json"})
        return headers_list

    def set_cname(self, subdomain: str, target: str = "cname.vercel-dns.com") -> bool:
        """
        写入或替换子域名的 CNAME 解析记录
        """
        record_name = subdomain.replace(f".{self.domain}", "").strip()
        payload = [{"data": target, "ttl": 600}]
        return self._put_godaddy_record("CNAME", record_name, payload, f"{subdomain} ➔ {target}")

    def sync_all_txt_verifications(self, txt_records: list) -> bool:
        """
        关键突破：将所有商家在 Neon 数据库中保存的 Verification TXT Value (如 vc-domain-verify=...) 
        全量合并打包一次性提交给 GoDaddy 的 _vercel 记录，彻底避免后一个商家覆盖前一个商家的 TXT 验证！
        """
        if not txt_records:
            return True

        # 构建 GoDaddy 要求的 Records 批量数组
        payload = []
        seen_values = set()
        for item in txt_records:
            val = item.get("value", "").strip()
            if val and val not in seen_values:
                seen_values.add(val)
                payload.append({"data": val, "ttl": 600})

        if not payload:
            return True

        print(f"   🔐 [GoDaddy API] 正在将 {len(payload)} 条商家的 Verification TXT 凭证全量合并写入 _vercel 记录...")
        return self._put_godaddy_record("TXT", "_vercel", payload, f"全量写入 {len(payload)} 条 _vercel TXT 凭证")

    def _put_godaddy_record(self, record_type: str, record_name: str, payload: list, desc: str) -> bool:
        headers_list = self._get_auth_headers_list()

        for base_url in self.base_urls:
            url = f"{base_url}/v1/domains/{self.domain}/records/{record_type}/{record_name}"
            for headers in headers_list:
                try:
                    res = requests.put(url, headers=headers, json=payload, timeout=10)
                    if res.status_code in (200, 204):
                        print(f"   🌐 [GoDaddy API] 成功写入 {record_type} 记录 [{base_url.split('//')[1]}]: {desc}")
                        return True
                except Exception:
                    pass

        print(f"   ⚠️ [GoDaddy API] 写入失败 ➔ {desc}")
        return False
