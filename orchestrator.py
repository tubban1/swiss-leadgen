"""
主 Orchestrator — 多租户架构版本
串联完整流水线：Discovery → Enrichment → Prompt-Driven Config Build → Multi-Tenant Deploy → Email
"""
from crm import init_db, insert_lead, update_lead, get_expired_leads
from agents.website_builder import WebsiteBuilder
from agents.deploy_agent import DeployAgent
from agents.email_agent import EmailAgent
from tools.utils import make_slug
from config import ROOT_DOMAIN


def run_pipeline(lead_data: dict):
    """
    运行单个 lead 的多租户流水线
    """
    # 1. 初始化 CRM DB
    init_db()

    # 2. 生成 slug 与子域名
    slug = make_slug(lead_data["name"])
    lead_data["slug"] = slug
    lead_data["subdomain"] = f"{slug}.{ROOT_DOMAIN}"

    # 3. 插入 CRM
    lead_id = insert_lead(lead_data)
    lead_data["id"] = lead_id

    print(f"\n{'='*60}")
    print(f"🎯 处理 Lead: {lead_data['name']}")
    print(f"   Slug: {slug}")
    print(f"   目标子域名: {lead_data['subdomain']}")
    print(f"   语言: {lead_data.get('language', 'de')}")
    print(f"{'='*60}")

    # ── Step 1: Prompt-Driven Configuration Build ─────────
    builder = WebsiteBuilder()
    site_config, admin_pass = builder.generate_config(lead_data, slug)

    lead_data["admin_pass"] = admin_pass
    update_lead(lead_id, admin_pass=admin_pass, status="built")

    # ── Step 2: Multi-Tenant Deploy ───────────────────────
    deployer = DeployAgent()
    deploy_result = deployer.run(lead_data, site_config)

    # ── Step 3: Outreach Email ────────────────────────────
    if lead_data.get("email"):
        emailer = EmailAgent()
        emailer.send(lead_data, deploy_result)
    else:
        print(f"\n⚠️  商家未提供电子邮箱，跳过自动发送。网站已在多租户系统激活: {deploy_result['subdomain_url']}")

    print(f"\n✅ 流水线完成！")
    print(f"   商家名称: {lead_data['name']}")
    print(f"   网站地址: {deploy_result['subdomain_url']}")
    print(f"   后台地址: {deploy_result['admin_url']}")
    print(f"   后台密码: {admin_pass}")

    return deploy_result


def run_expiry_check():
    """检查到期未付款的 leads 并执行下线"""
    expired = get_expired_leads()
    if not expired:
        print("✅ 当前没有到期的 leads")
        return

    deployer = DeployAgent()
    print(f"⚠️  发现 {len(expired)} 个到期未付款 Lead，正在下线...")
    for lead in expired:
        deployer.takedown(lead)


# ─── MVP 测试入口 ──────────────────────────────────────────

if __name__ == "__main__":
    TEST_LEAD = {
        "place_id": "test_place_multi_tenant_002",
        "name": "Café Bellevue",
        "category": "restaurant",
        "address": "Quai du Mont-Blanc 7, 1201 Genève",
        "city": "Geneva",
        "canton": "GE",
        "language": "fr",
        "email": None,           # 测试可填入真实邮箱
        "phone": "+41 22 731 20 40",
        "website_hint": None,
        "rating": 4.7,
        "review_count": 145,
        "google_maps_url": "https://maps.google.com/?q=Café+Bellevue+Geneva",
    }

    run_pipeline(TEST_LEAD)
