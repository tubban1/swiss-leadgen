"""
GoDaddy Agent — DNS 记录自动化管理
负责自动添加与移除 CNAME 记录，实现子域名 (xxx.sites.tubban.com) 自动绑定与下线
支持 GODADDY_TOKEN (Personal Access Token) 或 GODADDY_API_KEY/SECRET 验证
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
        将 backerei-pierre-biel.sites.tubban.com 转换为 GoDaddy 要求的 CNAME 名称:
        即 backerei-pierre-biel.sites
        """
        clean = full_subdomain.replace("https://", "").replace("http://", "").split("/")[0]
        if clean.endswith(f".{self.domain}"):
            clean = clean[:-len(f".{self.domain}")].rstrip(".")
        return clean

    def set_cname(self, subdomain: str, target: str = "cname.vercel-dns.com") -> bool:
        """
        添加/更新一条显式 CNAME 记录
        例如: set_cname("backerei-pierre-biel.sites.tubban.com", "cname.vercel-dns.com")
        在 GoDaddy 侧生成: backerei-pierre-biel.sites.tubban.com ➔ cname.vercel-dns.com
        """
        record_name = self._clean_record_name(subdomain)
        url = f"{GODADDY_API_BASE}/domains/{self.domain}/records/CNAME/{record_name}"
        data = [{
            "data": target,
            "ttl": 600,
        }]
        print(f"   🌐 [GoDaddy API] 显式创建 CNAME 解析: {record_name}.{self.domain} ➔ {target}")
        
        if not self.headers.get("Authorization"):
            print("   ℹ️ 尚未配置 GODADDY_API_KEY 与 SECRET，已预生成完整 CNAME 指令")
            return True

        try:
            r = requests.put(url, headers=self.headers, json=data, timeout=15)
            if r.status_code in (200, 204):
                print(f"   ✅ [GoDaddy API] CNAME 记录成功写入: {record_name}.{self.domain}")
                return True
            else:
                print(f"   ⚠️ [GoDaddy API] 响应 HTTP [{r.status_code}]: {r.text}")
                print(f"      👉 请确保在 https://developer.godaddy.com 创建了 API Key & Secret 并写入 .env 中的 GODADDY_API_KEY / GODADDY_API_SECRET")
                return False
        except Exception as e:
            print(f"   ❌ [GoDaddy API] 请求网络异常: {e}")
            return False

    def delete_cname(self, subdomain: str) -> bool:
        """
        到期下线：移除特定 CNAME 记录
        """
        record_name = self._clean_record_name(subdomain)
        url = f"{GODADDY_API_BASE}/domains/{self.domain}/records/CNAME/{record_name}"
        print(f"   🌐 [GoDaddy API] 删除 CNAME 记录: {record_name}.{self.domain}")

        if not self.headers.get("Authorization"):
            print("   ℹ️ 未完整配置 GODADDY_TOKEN，跳过真实 DNS 删除")
            return True

        try:
            r = requests.delete(url, headers=self.headers, timeout=15)
            if r.status_code in (200, 204):
                print(f"   ✅ [GoDaddy API] CNAME 记录已成功删除: {record_name}.{self.domain}")
                return True
            else:
                print(f"   ⚠️ [GoDaddy API] 删除响应 [{r.status_code}]: {r.text}")
                return False
        except Exception as e:
            print(f"   ❌ [GoDaddy API] 删除请求异常: {e}")
            return False
