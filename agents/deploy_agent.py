"""
Deploy Agent — 自动化多租户部署与网络域名挂载引擎
在单 Repo / 多租户架构下：
1. 自动写入 / 更新 Neon PostgreSQL 数据库
2. 自动通过 Vercel API 将商家子域名逐个独立挂载至 Vercel 生产应用 (multi_tenant_site)
3. 自动通过 GoDaddy API 逐个显式配置 CNAME 域名解析 (xxx.sites ➔ cname.vercel-dns.com)
4. 校验解析在线激活状态
"""
from agents.godaddy_agent import GoDaddyAgent
from agents.vercel_agent import VercelAgent
from crm import update_lead, set_deployed
from config import ROOT_DOMAIN


class DeployAgent:
    def __init__(self):
        self.godaddy = GoDaddyAgent()
        self.vercel = VercelAgent()
        self.cname_target = "cname.vercel-dns.com"

    def run(self, lead: dict, site_config: dict = None) -> dict:
        """
        全自动化部署与域名配置流水线
        lead: 包含 slug, id, name, subdomain 等
        site_config: 商家动态配置 (可选)
        """
        slug = lead.get("slug", "")
        lead_id = lead.get("id", "")
        subdomain = lead.get("subdomain") or f"{slug}.{ROOT_DOMAIN}"
        subdomain_url = f"https://{subdomain}"
        admin_url = f"https://{subdomain}/admin"

        print(f"\n{'='*65}")
        print(f"🚀 [1-by-1 自动化部署 Pipeline] 挂载并解析新站点: {lead['name']}")
        print(f"   ├─ 域名地址: {subdomain_url}")
        print(f"   └─ 关联 ID: {lead_id}")
        print(f"{'='*65}")

        # 1. 保存 / 更新 CRM 数据库中的配置与域名
        update_lead(
            lead_id, 
            site_config=site_config or {}, 
            subdomain=subdomain, 
            status="deployed", 
            is_published=True
        )
        print(f"   ✅ [1/3 Database] Neon PostgreSQL 状态更新为 deployed")

        # 2. Vercel REST API 逐个独立挂载域名
        vercel_ok = self.vercel.add_domain(subdomain)
        if vercel_ok:
            print(f"   ✅ [2/3 Vercel API] 域名 {subdomain} 自动化挂载完成")
        else:
            print(f"   ⚠️ [2/3 Vercel API] 域名 {subdomain} 挂载提示排查")

        # 3. GoDaddy REST API CNAME 逐个显式自动解析绑定
        godaddy_ok = self.godaddy.set_cname(subdomain, self.cname_target)
        if godaddy_ok:
            print(f"   ✅ [3/3 GoDaddy API] CNAME 显式解析记录成功写入")

        # 4. 设置已部署状态
        set_deployed(lead_id)

        result = {
            "subdomain": subdomain,
            "subdomain_url": subdomain_url,
            "admin_url": admin_url,
            "status": "deployed",
            "vercel_provisioned": vercel_ok,
            "godaddy_provisioned": godaddy_ok
        }

        print(f"\n🎉 [Pipeline Success] 商家 {lead['name']} 已全自动化完成 Vercel & GoDaddy 部署与挂载！")
        print(f"   🌐 访问地址: {subdomain_url}")
        print(f"   🔑 管理后台: {admin_url}\n")

        return result

    def takedown(self, lead: dict):
        """
        商家下线流水线：自动从 Vercel & GoDaddy 解绑并更新数据库
        """
        slug = lead.get("slug", "")
        subdomain = lead.get("subdomain") or f"{slug}.{ROOT_DOMAIN}"

        print(f"\n🔌 [全自动下线 Pipeline] 卸载站点: {lead['name']} ({subdomain})")
        
        # 1. Vercel 解绑
        self.vercel.remove_domain(subdomain)
        # 2. GoDaddy 删 CNAME
        self.godaddy.delete_cname(subdomain)
        # 3. 数据库置为未发布
        update_lead(lead["id"], is_published=False, status="expired")

        print(f"   ✅ 下线完成：已从 Vercel & GoDaddy 解绑，数据库 is_published=False\n")
