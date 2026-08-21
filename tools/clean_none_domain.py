"""
从 Vercel REST API 中彻底清理并解绑指定的临时/废弃域名
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from agents.vercel_agent import VercelAgent

def run(target_domain: str = "audit-demo-subdomain.sites.tubban.com"):
    vercel = VercelAgent()
    print(f"🧹 尝试从 Vercel 项目 {vercel.project_id} 中卸载域名: {target_domain}...")
    res = vercel.remove_domain(target_domain)
    print(f"✅ Vercel 卸载响应: {res}")

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "audit-demo-subdomain.sites.tubban.com"
    run(target)
