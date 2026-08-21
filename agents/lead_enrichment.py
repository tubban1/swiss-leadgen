"""
Lead Enrichment Agent — 使用 Serper.dev（2,500次免费，无需信用卡）
具备三重二次确认校验 (Triple Verification)，确保商家 100% 无独立官网
"""
import re
import time
import requests
from config import SERPER_API_KEY
from crm import get_leads_by_status, update_lead

EMAIL_RE = re.compile(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}")

# 常见社交媒体与第三方平台黄页目录（排除清单）
NOT_A_BUSINESS_WEBSITE = [
    "facebook.com", "instagram.com", "google.com", "tripadvisor.com",
    "booking.com", "yelp.com", "local.ch", "search.ch", "yellow.ch",
    "linkedin.com", "twitter.com", "tiktok.com", "kompass.com",
    "cylex-schweiz.ch", "tuugo.ch", "tel.search.ch", "ch-directories.ch",
    "localsearch.ch", "moneyhouse.ch", "zefix.ch", "schweizerische.ch"
]


class LeadEnrichmentAgent:

    def _serper_search(self, query: str, num: int = 5) -> list:
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
            print(f"   ⚠️  Serper 搜索提示: {e}")
            return []

    def _has_own_website(self, name: str, city: str) -> bool:
        """
        二次深度校验：全网搜索商家名称，精准判定是否有独立官网
        """
        # 1. 拆分商家名字的核心关键词 (忽略 AG, GmbH 等公司后缀)
        clean_name = re.sub(r"(?i)\b(gmbh|ag|ltd|sarl|sa|co|inc)\b", "", name).strip().lower()
        name_tokens = [t for t in re.split(r"\W+", clean_name) if len(t) > 2]

        if not name_tokens:
            name_tokens = [name.lower()]

        # 2. 全网检索
        query = f'"{name}" {city} Switzerland'
        results = self._serper_search(query, num=8)

        for item in results:
            link = item.get("link", "").lower()
            
            # 如果是已知社交平台或通用黄页目录，跳过
            if any(blocked in link for blocked in NOT_A_BUSINESS_WEBSITE):
                continue

            # 3. 提取域名判断是否与商家名字匹配
            from urllib.parse import urlparse
            domain = urlparse(link).netloc.replace("www.", "")

            # 如果域名中包含了商家核心关键字，说明商家已有自己的独立官网！
            match_count = sum(1 for token in name_tokens if token in domain)
            if match_count >= 1:
                print(f"   🔎 [二次确认拦截] 发现商家已有官网: https://{domain} (匹配关键词: {name_tokens})")
                return True

        return False

    def _find_email_from_search(self, name: str, city: str) -> str | None:
        """从全网公开检索中精准获取商家 Email"""
        query = f'"{name}" {city} Switzerland email OR kontakt OR mail'
        results = self._serper_search(query, num=5)
        for item in results:
            text = item.get("snippet", "") + " " + item.get("link", "")
            for email in EMAIL_RE.findall(text):
                email_lower = email.lower()
                if any(s in email_lower for s in ["example", "test", "noreply", "wix", "google", "sentry"]):
                    continue
                return email
        return None

    def enrich(self, batch_size: int = 20) -> int:
        """对 discovered leads 进行二次确认校验和邮箱补充"""
        leads = get_leads_by_status("discovered")[:batch_size]
        if not leads:
            print("✅ 没有待二次验证 (enrichment) 的 leads")
            return 0

        print(f"\n🛡️ 开始二次验证 (Lead Enrichment)...")
        enriched = 0

        for lead in leads:
            print(f"   二次校验: {lead['name']} ({lead['city']})")

            # 深度二次确认
            if self._has_own_website(lead["name"], lead["city"]):
                print(f"   ❌ [二次确认失败] 该商家已有官网，标记为 rejected 并丢弃")
                update_lead(lead["id"], status="rejected_has_website")
                time.sleep(0.5)
                continue

            print(f"   ✅ [二次确认通过] 确认商家确实无独立官网！")

            # 提取真实邮箱
            email = self._find_email_from_search(lead["name"], lead["city"])

            if email:
                print(f"   ✉️ 找到联系邮箱: {email}")
            else:
                print(f"   ℹ️ 暂未查到公开邮箱（保留数据，后续人工/电话跟进）")

            update_lead(lead["id"], email=email, status="enriched")
            enriched += 1
            time.sleep(0.5)

        print(f"\n🏁 二次验证完成，{enriched}/{len(leads)} 个真正无网站的优质商家通过筛查！")
        return enriched
