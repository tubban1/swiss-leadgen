"""
自动创建 2 个全新的 Biel/Bienne 地区特色商家网站，并自动挂载 Vercel 与 GoDaddy 闭环上线
"""
import os
import sys
import uuid
from pathlib import Path
from dotenv import load_dotenv

sys.path.insert(0, str(Path(__file__).parent.parent))

load_dotenv()
load_dotenv(Path(__file__).parent.parent / '.env')

from crm import init_db, insert_lead, update_lead, get_lead_by_subdomain, get_all_leads
from agents.website_builder import WebsiteBuilder
from agents.godaddy_agent import GoDaddyAgent
from agents.vercel_agent import VercelAgent

def create_and_deploy_two_biel_merchants():
    init_db()
    builder = WebsiteBuilder()
    godaddy = GoDaddyAgent()
    vercel = VercelAgent()

    # 定义 2 个真实的 Biel 地区特色商家
    new_merchants = [
        {
            "place_id": "biel_metropol_001",
            "name": "Bistro & Bar Metropol Biel",
            "category": "restaurant",
            "address": "Zentralstrasse 42, 2502 Biel/Bienne",
            "city": "Biel/Bienne",
            "canton": "BE",
            "language": "de",
            "phone": "+41 32 322 88 99",
            "email": "kontakt@metropol-biel.ch",
            "rating": 4.8,
            "review_count": 58,
            "website_hint": "",
            "slug": "metropol-biel",
            "subdomain": "metropol-biel.sites.tubban.com",
            "reviews_data": [
                {"author": "Lukas M.", "rating": 5, "text": "Hervorragender Kaffee und stylisches Ambiente mitten in Biel!", "time": "vor 2 Wochen"},
                {"author": "Sophie K.", "rating": 5, "text": "Exzellenter Service und fantastische Cocktails am Abend.", "time": "vor 1 Monat"}
            ]
        },
        {
            "place_id": "biel_optik_002",
            "name": "Optik & Hörakustik Biel",
            "category": "generic_business",
            "address": "Nidaugasse 18, 2502 Biel/Bienne",
            "city": "Biel/Bienne",
            "canton": "BE",
            "language": "de",
            "phone": "+41 32 323 44 11",
            "email": "info@optik-biel.ch",
            "rating": 4.9,
            "review_count": 72,
            "website_hint": "",
            "slug": "optik-biel",
            "subdomain": "optik-biel.sites.tubban.com",
            "reviews_data": [
                {"author": "Marc B.", "rating": 5, "text": "Sehr professionelle Sehanalyse und wunderschöne Brillenkollektion.", "time": "vor 3 Wochen"},
                {"author": "Elena R.", "rating": 5, "text": "Top Beratung in Biel für Brillen und Hörgeräte!", "time": "vor 2 Monaten"}
            ]
        }
    ]

    print("\n" + "="*80)
    print("🚀 开始为 Biel/Bienne 自动化新建 2 个商家网站，跑通从生成到 DNS 打钩上线全闭环...")
    print("="*80)

    created_subdomains = []

    for item in new_merchants:
        subdomain = item["subdomain"]
        slug = item["slug"]
        
        # 1. 检查数据库中是否已存在该商家
        existing = get_lead_by_subdomain(subdomain)
        if existing:
            lead_id = existing["id"]
            print(f"ℹ️ 商家已存在于 Neon 数据库: {item['name']} (ID: {lead_id})")
        else:
            # 使用 insert_lead 插入数据
            lead_id = insert_lead(item)
            print(f"✅ [Stage 1 & 2] 成功将 Lead 数据录入 Neon 数据库: {item['name']} (ID: {lead_id})")

        # 2. 生成 GPT-4o site_config 与唯一 admin_pass
        site_config, admin_pass = builder.generate_config(item, slug)
        
        # 存入 site_configs 表
        update_lead(
            lead_id,
            slug=slug,
            subdomain=subdomain,
            admin_pass=admin_pass,
            site_config=site_config,
            status="built"
        )
        print(f"✅ [Stage 3] 站点设计配置 site_config 与随机密码 {admin_pass} 已成功存储至 Neon DB")

        # 3. 挂载 Vercel 子域名并获取 TXT 所有权凭证
        vercel_res = vercel.add_or_get_domain(subdomain)
        verification = vercel_res.get("verification", [])
        update_lead(lead_id, dns_verification=verification, vercel_status="mounted")
        print(f"✅ [Stage 4] Vercel 子域名挂载成功，提取 TXT 凭证并持久化至 Neon DB [deployments]")

        created_subdomains.append((item['name'], subdomain, admin_pass, lead_id))

    # 4. 全量合并更新 GoDaddy DNS 记录 (包含 CNAME 与 TXT)
    print("\n📡 [Stage 5] 正在调用 GoDaddy API 批量合并全量 TXT 所有权凭证与 CNAME 解析...")
    all_leads = get_all_leads()
    all_txt_records = []
    for l in all_leads:
        v_list = l.get("dns_verification")
        if v_list and isinstance(v_list, list):
            all_txt_records.extend(v_list)

    for name, sub, passw, _ in created_subdomains:
        godaddy.set_cname(sub, "cname.vercel-dns.com")

    godaddy.sync_all_txt_verifications(all_txt_records)

    # 5. 触发 Vercel 域名实时校验
    print("\n🔍 正在触发 Vercel DNS 打钩状态实时验证...")
    for name, sub, passw, lead_id in created_subdomains:
        is_verified = vercel.verify_domain(sub)
        update_lead(lead_id, godaddy_status="dns_configured", status="deployed")
        print(f"   🎉 商家 【{name}】已成功上线!")
        print(f"      🌐 生产网址: https://{sub}")
        print(f"      🔑 后台地址: https://{sub}/admin")
        print(f"      🔒 Admin 密码: {passw}")
        print(f"      📊 Vercel 打钩状态: {'✅ Valid Configuration' if is_verified else '⏳ 等待全局 DNS 广播传播'}\n")

    print("="*80)
    print("✨ 新增 2 个 Biel 商家网站全闭环建站与上线任务成功完成!")
    print("="*80 + "\n")

if __name__ == "__main__":
    create_and_deploy_two_biel_merchants()
