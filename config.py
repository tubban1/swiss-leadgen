import os
from pathlib import Path
from dotenv import load_dotenv

# 加载 .env
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

ROOT_DOMAIN = os.getenv("ROOT_DOMAIN", "sites.tubban.com")
DOMAIN_ZONE = os.getenv("DOMAIN_ZONE", "tubban.com")

VERCEL_TOKEN = os.getenv("VERCEL_TOKEN", "")
VERCEL_PROJECT_ID = os.getenv("VERCEL_PROJECT_ID", "multi_tenant_site")

GODADDY_API_KEY = os.getenv("GODADDY_API_KEY", "")
GODADDY_API_SECRET = os.getenv("GODADDY_API_SECRET", "")

DATABASE_URL = os.getenv("DATABASE_URL", "")

FREE_TRIAL_DAYS = int(os.getenv("FREE_TRIAL_DAYS", "30"))

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASS = os.getenv("SMTP_PASS", "")
EMAIL_FROM = os.getenv("EMAIL_FROM", "Swiss Web Design <noreply@tubban.com>")
