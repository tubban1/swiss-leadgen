"""
查询 Neon PostgreSQL 数据库中所有 12 家商家的 Admin 随机密码与后台登录链接
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from crm import init_db, get_all_leads

def run():
    init_db()
    leads = get_all_leads()

    print(f"\n==========================================================================")
    print(f"🔑 全量 12 家商户 Admin 随机密码与后台登录地址清单")
    print(f"==========================================================================")
    print(f"{'商户名称 (Business Name)':<35} | {'随机密码 (Admin Password)':<18} | {'后台登录链接 (Admin URL)'}")
    print(f"--------------------------------------------------------------------------")

    for lead in leads:
        name = lead["name"]
        subdomain = lead.get("subdomain", "")
        pass_code = lead.get("admin_pass", "N/A")
        admin_url = f"https://{subdomain}/admin"

        print(f"{name:<35} | {pass_code:<18} | {admin_url}")

    print(f"==========================================================================\n")

if __name__ == "__main__":
    run()
