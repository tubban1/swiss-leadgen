"""
为 Neon 数据库中所有 12 家商户重新生成并固化独一无二的高强度随机密码
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from crm import init_db, get_all_leads, update_lead
from tools.utils import generate_password

def run():
    init_db()
    leads = get_all_leads()

    print(f"\n🔐 正在为 12 家商户全量生成并固化独一无二的随机 Admin 密码...\n")

    for lead in leads:
        # 生成高强度随机密码
        new_pass = generate_password()
        update_lead(lead["id"], admin_pass=new_pass)
        print(f"   ✅ [Password Generated] {lead['name']:<32} 🔑 Admin Pass: {new_pass}")

    print(f"\n🎉 12 家商户的专属随机密码已更新落存至 Neon PostgreSQL 数据库！\n")

if __name__ == "__main__":
    run()
