"""
工具函数
"""
import re
import secrets
import string
import time
import unicodedata
import requests


def make_slug(name: str) -> str:
    """
    商家名 → URL-safe slug
    "Bäckerei Müller & Söhne" → "backerei-muller-sohne"
    """
    # 标准化 unicode（分解变音符号）
    name = unicodedata.normalize("NFKD", name)
    name = name.encode("ascii", "ignore").decode("ascii")
    # 小写，替换非字母数字为 -
    name = re.sub(r"[^a-z0-9]+", "-", name.lower())
    # 去除首尾 -
    name = name.strip("-")
    return name[:50]  # 最长 50 字符


def unique_slug(base_slug: str, existing_slugs: set) -> str:
    """确保 slug 唯一，冲突时添加随机 4 位后缀"""
    slug = base_slug
    while slug in existing_slugs:
        suffix = "".join(secrets.choice(string.digits) for _ in range(4))
        slug = f"{base_slug[:45]}-{suffix}"
    return slug


def generate_password(length: int = 12) -> str:
    """生成易读的安全密码（无混淆字符）"""
    alphabet = string.ascii_letters.replace("l", "").replace("O", "") + string.digits
    while True:
        pwd = "".join(secrets.choice(alphabet) for _ in range(length))
        # 确保包含大写、小写、数字
        if (any(c.isupper() for c in pwd) and
                any(c.islower() for c in pwd) and
                any(c.isdigit() for c in pwd)):
            return pwd


def wait_for_url(url: str, timeout: int = 900, interval: int = 30) -> bool:
    """
    轮询 URL 直到返回 200，用于等待 DNS 生效
    timeout: 最长等待秒数（默认 15 分钟）
    """
    deadline = time.time() + timeout
    print(f"⏳ 等待 {url} 可访问（最多 {timeout//60} 分钟）...")
    while time.time() < deadline:
        try:
            r = requests.get(url, timeout=10, allow_redirects=True)
            if r.status_code < 400:
                print(f"✅ {url} 已上线！")
                return True
        except Exception:
            pass
        remaining = int(deadline - time.time())
        print(f"   还未就绪，{remaining}s 剩余，{interval}s 后重试...")
        time.sleep(interval)
    print(f"❌ 超时：{url} 在 {timeout//60} 分钟内未能访问")
    return False


def detect_language_from_canton(canton: str) -> str:
    """Canton 代码 → 语言"""
    from config import CANTON_LANGUAGE
    return CANTON_LANGUAGE.get(canton.upper(), "de")
