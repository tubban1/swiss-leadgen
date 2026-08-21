"""
Lead Discovery Agent — Playwright 直接抓取 Google Maps
完全免费，无需任何 API Key
提取包含商家名称、地址、电话、Google 评分、评价数、以及真实客户评语摘录
"""
import asyncio
import re
import time
from playwright.async_api import async_playwright, TimeoutError as PwTimeout
from config import SWISS_CITIES, BUSINESS_CATEGORIES, LEAD_FILTER_MIN_RATING, LEAD_FILTER_MIN_REVIEWS
from crm import lead_exists, insert_lead
from tools.utils import make_slug, detect_language_from_canton

NOT_REAL_WEBSITE = [
    "facebook.com", "instagram.com", "google.com", "tripadvisor.com",
    "booking.com", "yelp.com", "local.ch", "search.ch", "yellow.ch",
    "linkedin.com", "twitter.com", "tiktok.com",
]


async def _scrape_city_category(page, city: dict, category: dict, max_results: int = 20) -> list:
    """抓取一个城市×行业的 Google Maps 结果及真实用户评价"""
    query = f'{category["type"]} {city["name"]} Switzerland'
    url = f"https://www.google.com/maps/search/{query.replace(' ', '+')}"

    results = []
    try:
        await page.goto(url, wait_until="networkidle", timeout=30000)
        await page.wait_for_timeout(3000)

        # 滚动加载更多结果
        feed = page.locator('[role="feed"]')
        for _ in range(3):
            await feed.evaluate("el => el.scrollBy(0, 1000)")
            await page.wait_for_timeout(1500)

        # 获取所有商家卡片
        cards = await page.locator('[role="feed"] > div[jsaction]').all()

        for card in cards[:max_results]:
            try:
                name_el = card.locator("div.fontHeadlineSmall, .qBF1Pd")
                name = await name_el.first.inner_text() if await name_el.count() > 0 else ""
                if not name:
                    continue

                # 点击卡片获取详情
                await card.click()
                await page.wait_for_timeout(2000)

                # 评分
                rating_el = page.locator('div[jsaction*="pane"] span[aria-label*="star"], span[aria-label*="Stern"]')
                rating_text = await rating_el.first.get_attribute("aria-label") if await rating_el.count() > 0 else ""
                rating = float(re.search(r"[\d.]+", rating_text).group()) if re.search(r"[\d.]+", rating_text) else 0

                # 评价数
                review_el = page.locator('div[jsaction*="pane"] button[jsaction*="review"] span')
                review_text = await review_el.first.inner_text() if await review_el.count() > 0 else "0"
                reviews = int(re.sub(r"[^\d]", "", review_text)) if re.sub(r"[^\d]", "", review_text) else 0

                # 过滤高分商家
                if rating < LEAD_FILTER_MIN_RATING or reviews < LEAD_FILTER_MIN_REVIEWS:
                    continue

                # 网站检测
                website_el = page.locator('a[data-item-id="authority"], a[href*="http"][aria-label*="ite"]')
                website = await website_el.first.get_attribute("href") if await website_el.count() > 0 else ""

                # 有真实独立网站则跳过
                if website and not any(b in website for b in NOT_REAL_WEBSITE):
                    continue

                # 地址
                addr_el = page.locator('button[data-item-id="address"]')
                address = await addr_el.first.inner_text() if await addr_el.count() > 0 else ""

                # 电话
                phone_el = page.locator('button[data-item-id*="phone"]')
                phone = await phone_el.first.inner_text() if await phone_el.count() > 0 else ""

                # 提取真实客户好评摘录 (Top 2 评语)
                review_snippets = []
                review_nodes = await page.locator('div.My5sp, span.wife1e, div.DU29qf').all()
                for node in review_nodes[:2]:
                    txt = await node.inner_text()
                    if txt and len(txt) > 15:
                        review_snippets.append(txt.strip().replace("\n", " "))

                maps_url = page.url
                place_id_match = re.search(r"1s([^!]+)!2s", maps_url)
                place_id = place_id_match.group(1) if place_id_match else f"{name}_{city['name']}"

                results.append({
                    "place_id": place_id,
                    "name": name.strip(),
                    "category": category["type"],
                    "template": category["template"],
                    "address": address.strip(),
                    "city": city["name"],
                    "canton": city["canton"],
                    "language": city["lang"],
                    "email": None,
                    "phone": phone.strip(),
                    "website_hint": website,
                    "rating": rating,
                    "review_count": reviews,
                    "review_snippets": review_snippets,
                    "google_maps_url": maps_url,
                    "slug": make_slug(name.strip()),
                })

            except Exception as e:
                continue

    except PwTimeout:
        print(f"   ⏰ 超时: {city['name']} × {category['type']}")
    except Exception as e:
        print(f"   ⚠️  错误: {e}")

    return results


async def _run_discovery(max_per_run: int = 50) -> int:
    """异步主逻辑"""
    new_count = 0

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(
            headless=True,
            args=["--lang=de-CH", "--no-sandbox"],
        )
        context = await browser.new_context(
            locale="de-CH",
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
            viewport={"width": 1280, "height": 800},
        )
        page = await context.new_page()

        try:
            await page.goto("https://www.google.com/maps", timeout=15000)
            accept = page.locator('button:has-text("Accept all"), button:has-text("Alle akzeptieren")')
            if await accept.count() > 0:
                await accept.first.click()
                await page.wait_for_timeout(1000)
        except Exception:
            pass

        for city in SWISS_CITIES:
            for category in BUSINESS_CATEGORIES:
                print(f"   🔍 抓取: {city['name']} × {category['type']}")
                places = await _scrape_city_category(page, city, category)

                for place in places:
                    if lead_exists(place["place_id"]):
                        continue
                    insert_lead(place)
                    new_count += 1
                    print(f"      ✅ {place['name']} (⭐{place['rating']}, {place['review_count']} 条评价)")
                    if new_count >= max_per_run:
                        await browser.close()
                        return new_count

                await asyncio.sleep(2)

        await browser.close()

    return new_count


class LeadDiscoveryAgent:
    def discover(self, max_per_run: int = 50) -> int:
        print(f"\n🔍 开始 Lead Discovery (Playwright 全量数据抓取)...")
        n = asyncio.run(_run_discovery(max_per_run))
        print(f"\n🏁 Discovery 完成，新增 {n} 个 leads")
        return n
