"""
GoDaddy Agent — DNS 记录与所有权验证 API 管理
支持 CNAME 显式解析与从数据库消费动态 TXT 验证凭证 (vc-domain-verify=...) 写入
"""
import requests
from config import GODADDY_TOKEN, GODADDY_API_KEY, GODADDY_API_SECRET, ROOT_DOMAIN

GODADDY_API_BASE = "https://api.godaddy.com/v1"


class GoDaddyAgent:
    def __init__(self, domain: str = ROOT_DOMAIN):
        # 提取真正的主域名 tubban.com
        if "." in domain and domain.count(".") >= 1:
            parts = domain.split(".")
            self.domain = ".".join(parts[-2:])
        else:
            self.domain = domain
        
        # 组装 GoDaddy 要求的 sso-key 请求头
        if GODADDY_API_KEY and GODADDY_API_SECRET:
            auth_val = f"sso-key {GODADDY_API_KEY}:{GODADDY_API_SECRET}"
        elif GODADDY_TOKEN:
            auth_val = f"sso-key {GODADDY_TOKEN}"
        else:
            auth_val = ""

        self.headers = {
            "Authorization": auth_val,
            "Content-Type": "application/json",
        }

    def _clean_record_name(self, full_subdomain: str) -> str:
        """
        将 backerei-pierre-biel.sites.tubban.com 转换为 GoDaddy CNAME 名称: backerei-pierre-biel.sites
        将 _vercel.tubban.com 转换为 GoDaddy TXT 名称: _vercel
        """
        clean = full_subdomain.replace("https://", "").replace("http://", "").split("/")[0]
        if clean.endswith(f".{self.domain}"):
            clean = clean[:-len(f".{self.domain}")].rstrip(".")
        return clean or "@"

    def set_cname(self, subdomain: str, target: str = "cname.vercel-dns.com") -> bool:
        """
        添加/更新 CNAME 解析记录
        """
        record_name = self._clean_record_name(subdomain)
        url = f"{GODADDY_API_BASE}/domains/{self.domain}/records/CNAME/{record_name}"
        data = [{
            "data": target,
            "ttl": 600,
        }]
        print(f"   🌐 [GoDaddy API] 写入 CNAME 解析: {record_name}.{self.domain} ➔ {target}")
        
        if not self.headers.get("Authorization"):
            print("   ℹ️ 尚未配置 GODADDY_API_KEY 与 SECRET，打印预期写入数据")
            return True

        try:
            r = requests.put(url, headers=self.headers, json=data, timeout=15)
            if r.status_code in (200, 204):
                print(f"   ✅ [GoDaddy API] CNAME 记录写入成功: {record_name}.{self.domain}")
                return True
            else:
                print(f"   ⚠️ [GoDaddy API] 响应 HTTP [{r.status_code}]: {r.text}")
                return False
        except Exception as e:
            print(f"   ❌ [GoDaddy API] 请求网络异常: {e}")
            return False

    def set_txt(self, record_domain: str, txt_value: str) -> bool:
        """
        从数据库消费从 Vercel 获取的独有 TXT 验证凭证 (vc-domain-verify=...) 写入 GoDaddy
        """
        record_name = self._clean_record_name(record_domain)
        url = f"{GODADDY_API_BASE}/domains/{self.domain}/records/TXT/{record_name}"
        data = [{
            "data": txt_value,
            "ttl": 600,
        }]
        print(f"   🔐 [GoDaddy API] 写入 TXT 验证记录: {record_name}.{self.domain} ➔ Value: {txt_value[:40]}...")
        
        if not self.headers.get("Authorization"):
            print("   ℹ️ 尚未配置 GODADDY_API_KEY 与 SECRET，打印预期 TXT 验证数据")
            return True

        try:
            r = requests.put(url, headers=self.headers, json=data, timeout=15)
            if r.status_code in (200, 204):
                print(f"   ✅ [GoDaddy API] TXT 验证记录写入成功: {record_name}.{self.domain}")
                return True
            else:
                print(f"   ⚠️ [GoDaddy API] TXT 写入响应 HTTP [{r.status_code}]: {r.text}")
                return False
        except Exception as e:
            print(f"   ❌ [GoDaddy API] TXT 写入异常: {e}")
            return False
