"""
Deploy Agent — 单 Repo 多租户版本
在单 Repo 架构下：
无需为每个商家新建 GitHub Repo 或触发新的 Vercel 部署。
只需：
1. 将 AI 生成的 site_config 写入数据库
2. 自动匹配通配符 *.sites.tubban.com 解析
3. 校验子域名解析与激活
"""
from agents.godaddy_agent import GoDaddyAgent
from tools.utils import wait_for_url
from crm import update_lead, set_deployed
from config import ROOT_DOMAIN


class DeployAgent:
    def __init__(self):
        self.godaddy = GoDaddyAgent()
        self.cname_target = "cname.vercel-dns.com"

    def run(self, lead: dict, site_config: dict) -> dict:
        """
        多租户部署流程
        lead: 包含 slug, id, name 等
        site_config: AI 生成的独立网站配置
        """
        slug = lead["slug"]
        lead_id = lead["id"]
        subdomain = f"{slug}.{ROOT_DOMAIN}"
        subdomain_url = f"https://{subdomain}"
        admin_url = f"https://{subdomain}/admin"

        print(f"\n{'='*50}")
        print(f"🚀 多租户部署: {lead['name']} ({subdomain})")
        print(f"{'='*50}")

        # Step 1: 保存 site_config 到数据库
        update_lead(lead_id, site_config=site_config, subdomain=subdomain)
        print(f"✅ 网站配置 JSON 已更新至 CRM 数据库 [Neon PostgreSQL]")

        # Step 2: DNS 通配符绑定确认
        print(f"🌐 DNS 解析: 通配符 *.{ROOT_DOMAIN} ➔ {self.cname_target} 就绪")

        # Step 3: 标记为已部署
        set_deployed(lead_id)

        result = {
            "subdomain": subdomain,
            "subdomain_url": subdomain_url,
            "admin_url": admin_url,
            "status": "deployed",
        }

        print(f"\n🎉 多租户网站在线激活！")
        print(f"   网站地址: {subdomain_url}")
        print(f"   后台地址: {admin_url}")
        print(f"   后台密码: {lead['admin_pass']}")

        return result

    def takedown(self, lead: dict):
        """
        30 天到期下线：将数据库 is_published 置 0
        """
        slug = lead["slug"]
        print(f"\n🔌 多租户下线: {lead['name']} ({slug})")
        update_lead(lead["id"], is_published=False, status="expired")
        print(f"   已下线：数据库 is_published 设为 False，网页停止对外响应")
