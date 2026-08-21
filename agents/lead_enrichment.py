"""
Lead Enrichment Agent — 使用 Serper.dev（2,500次免费，无需信用卡）
替代 Google Custom Search API
"""
import re
import time
import requests
from config import SERPER_API_KEY
from crm import get_leads_by_status, update_lead

EMAIL_RE = re.compile(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}")

NOT_A_WEBSITE = [
    "facebook.com", "instagram.com", "google.com", "tripadvisor.com",
    "booking.com", "yelp.com", "local.ch", "search.ch", "yellow.ch",
    "linkedin.com", "twitter.com", "tiktok.com",
]


class LeadEnrichmentAgent:

    def _serper_search(self, query: str, num: int = 5) -> list:
        """
        Serper.dev Google Search API
        2,500次免费（一次性），无需信用卡
        注册: https://serper.dev
        """
        if not SERPER_API_KEY:
            return []
        headers = {
            "X-API-KEY": SERPER_API_KEY,
            "Content-Type": "application/json",
        }
        payload = {"q": query, "num": num, "gl": "ch", "hl": "de"}
        try:
            r = requests.post(
                "https://google.serper.dev/search",
                headers=headers,
                json=payload,
                timeout=10,
            )
            r.raise_for_status()
            return r.json().get("organic", [])
        except Exception as e:
            print(f"   ⚠️  Serper 搜索失败: {e}")
            return []

    def _has_own_website(self, name: str, city: str) -> bool:
        """验证商家是否有独立网站（非社交媒体）"""
        query = f'"{name}" {city} -site:facebook.com -site:google.com -site:tripadvisor.com'
        results = self._serper_search(query, num=5)
        for item in results:
            link = item.get("link", "")
            if not any(blocked in link for blocked in NOT_A_WEBSITE):
                return True
        return False

    def _find_email_from_search(self, name: str, city: str) -> str | None:
        """从搜索结果摘要中提取邮箱"""
        query = f'"{name}" {city} email kontakt @'
        results = self._serper_search(query, num=5)
        for item in results:
            text = item.get("snippet", "") + " " + item.get("link", "")
            for email in EMAIL_RE.findall(text):
                if any(s in email.lower() for s in ["example", "test", "noreply", "wix", "google"]):
                    continue
                return email
        return None

    def _find_email_from_page(self, url: str) -> str | None:
        """抓取网页查找邮箱"""
        if not url:
            return None
        try:
            r = requests.get(
                url,
                headers={"User-Agent": "Mozilla/5.0 (compatible; TubbanBot/1.0)"},
                timeout=8,
            )
            for email in EMAIL_RE.findall(r.text):
                if any(s in email.lower() for s in ["example", "test", "noreply", "wix"]):
                    continue
                return email
        except Exception:
            pass
        return None

    def enrich(self, batch_size: int = 20) -> int:
        """对 discovered leads 进行验证和信息补充"""
        leads = get_leads_by_status("discovered")[:batch_size]
        if not leads:
            print("✅ 没有待 enrichment 的 leads")
            return 0

        print(f"\n📊 开始 Enrichment，处理 {len(leads)} 个 leads...")
        enriched = 0

        for lead in leads:
            print(f"   处理: {lead['name']} ({lead['city']})")

            # 双重验证是否有独立网站
            if self._has_own_website(lead["name"], lead["city"]):
                print(f"   ❌ 有独立网站，排除")
                update_lead(lead["id"], status="rejected_has_website")
                time.sleep(0.5)
                continue

            # 查找邮箱
            email = (
                self._find_email_from_search(lead["name"], lead["city"])
                or self._find_email_from_page(lead.get("google_maps_url"))
            )

            if email:
                print(f"   ✅ 邮箱: {email}")
            else:
                print(f"   ⚠️  无邮箱（仍可继续，人工跟进）")

            update_lead(lead["id"], email=email, status="enriched")
            enriched += 1
            time.sleep(0.5)

        print(f"\n🏁 Enrichment 完成，{enriched}/{len(leads)} 通过")
        return enriched
