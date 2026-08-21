"""
从 Vercel REST API 中彻底清理并解绑错误的 None.sites.tubban.com 域名
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from agents.vercel_agent import VercelAgent

def run():
    vercel = VercelAgent()
    bad_domain = "None.sites.tubban.com"
    print(f"🧹 尝试从 Vercel 项目 {vercel.project_id} 中卸载错误域名: {bad_domain}...")
    res = vercel.remove_domain(bad_domain)
    print(f"✅ Vercel 卸载响应: {res}")

if __name__ == "__main__":
    run()
