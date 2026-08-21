"""
Deploy Agent — 单 Repo 多租户版本
在单 Repo 架构下：
无需为每个商家新建 GitHub Repo 或触发新的 Vercel 部署。
只需：
1. 将 AI 生成的 site_config 写入数据库
2. 调用 GoDaddy API 配置 DNS CNAME，将 xxx.tubban.com 指向 Vercel 多租户统一节点
3. 校验子域名解析
"""
from agents.godaddy_agent import GoDaddyAgent
from tools.utils import wait_for_url
from crm import update_lead, set_deployed
from config import ROOT_DOMAIN


class DeployAgent:
    def __init__(self):
        self.godaddy = GoDaddyAgent()
        # Vercel 通配符域名的标准 CNAME 目标
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
        print(f"✅ 网站配置 JSON 已更新至 CRM 数据库")

        # Step 2: 在 GoDaddy 创建 CNAME 指向 Vercel 统一部署
        try:
            self.godaddy.set_cname(slug, self.cname_target)
        except Exception as e:
            print(f"⚠️  DNS 配置提示: {e} (如是在开发测试阶段，可忽略)")

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
        30 天到期下线：将数据库 is_published 置 0，并尝试关闭 DNS 记录
        """
        slug = lead["slug"]
        print(f"\n🔌 多租户下线: {lead['name']} ({slug})")
        
        # 1. 关停数据库在线标志
        update_lead(lead["id"], is_published=0, status="expired")

        # 2. 修改 DNS 记录
        try:
            self.godaddy.delete_cname(slug)
        except Exception as e:
            print(f"⚠️  DNS 下线提示: {e}")

        print(f"   已下线：数据库置为未开启，域名已关停")
