"""
Swiss LeadGen — 全局配置
包含 API 密钥、瑞士城市列表、行业模板与默认参数
"""
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# ─── Lead Discovery & Enrichment ────────────────────────
OUTSCRAPER_API_KEY = os.getenv("OUTSCRAPER_API_KEY", "")
SERPER_API_KEY     = os.getenv("SERPER_API_KEY", "")

# ─── LLM ──────────────────────────────────────────────────
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL   = os.getenv("OPENAI_MODEL", "gpt-4o")

# ─── GitHub ───────────────────────────────────────────────
GITHUB_TOKEN   = os.getenv("GITHUB_TOKEN", "")
GITHUB_ORG     = os.getenv("GITHUB_ORG", "")

# ─── Vercel ───────────────────────────────────────────────
VERCEL_TOKEN      = os.getenv("VERCEL_TOKEN", "")
VERCEL_PROJECT_ID = os.getenv("VERCEL_PROJECT_ID", "multi_tenant_site")
VERCEL_TEAM_ID    = os.getenv("VERCEL_TEAM_ID", "")

# ─── GoDaddy & Domain ─────────────────────────────────────
GODADDY_TOKEN      = os.getenv("GODADDY_TOKEN", "")
GODADDY_API_KEY    = os.getenv("GODADDY_API_KEY", "")
GODADDY_API_SECRET = os.getenv("GODADDY_API_SECRET", "")
ROOT_DOMAIN        = os.getenv("ROOT_DOMAIN", "sites.tubban.com")

# ─── 数据库 (PostgreSQL Neon / SQLite) ───────────────────
DATABASE_URL       = os.getenv("DATABASE_URL", "")

# ─── Email (Resend) ───────────────────────────────────────
RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
FROM_EMAIL     = os.getenv("FROM_EMAIL", "hello@tubban.com")
FROM_NAME      = os.getenv("FROM_NAME", "Tubban Websites")

# ─── 商业模式 & 定价 ─────────────────────────────────────
PRICE_FIRST_YEAR = 800     # 首年套餐价格 (CHF)
PRICE_RENEWAL    = 100     # 次年起每年续费 (CHF)
FREE_TRIAL_DAYS  = 30      # 免费试用天数

# ─── Lead 筛选标准 ────────────────────────────────────────
LEAD_FILTER_MIN_RATING  = 4.2   # 最低 Google 评分
LEAD_FILTER_MIN_REVIEWS = 15    # 最少评价数

# ─── 瑞士城市定义 ────────────────────────────────────────
SWISS_CITIES = [
    {"name": "Zürich", "canton": "ZH", "lang": "de", "coords": (47.3769, 8.5417)},
    {"name": "Geneva", "canton": "GE", "lang": "fr", "coords": (46.2044, 6.1432)},
    {"name": "Basel", "canton": "BS", "lang": "de", "coords": (47.5596, 7.5886)},
    {"name": "Lausanne", "canton": "VD", "lang": "fr", "coords": (46.5197, 6.6323)},
    {"name": "Bern", "canton": "BE", "lang": "de", "coords": (46.9480, 7.4474)},
    {"name": "Lucerne", "canton": "LU", "lang": "de", "coords": (47.0502, 8.3093)},
    {"name": "St. Gallen", "canton": "SG", "lang": "de", "coords": (47.4245, 9.3767)},
    {"name": "Lugano", "canton": "TI", "lang": "it", "coords": (46.0037, 8.9511)},
]

# ─── 目标行业与类别 ───────────────────────────────────────
BUSINESS_CATEGORIES = [
    {"type": "bakery", "template": "bakery"},
    {"type": "restaurant", "template": "restaurant"},
    {"type": "hair_salon", "template": "beauty"},
    {"type": "car_repair", "template": "repair"},
    {"type": "dentist", "template": "health"},
    {"type": "plumber", "template": "trade"},
]
