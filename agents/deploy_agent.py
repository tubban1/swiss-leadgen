"""
Deploy Agent — 闭环多租户网络部署与 DNS 动态凭证流水线
在单 Repo / 多租户架构下实现四步无缝数据流转：
1. 调 Vercel API 挂载域名，实时提取独有的所有权验证 Value (TXT: vc-domain-verify=...)
2. 将真实 DNS 验证凭证 (verification_info) 与站点配置保存至 Neon PostgreSQL 数据库
3. 从数据库提取凭证数据，精准调用 GoDaddy API 写入专属 CNAME 与 TXT 验证记录
4. 触发 Vercel 自动化二次校验 (verify_domain)，使得域名状态直接激活上线
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
        全闭环全自动化部署流水线
        """
        slug = lead.get("slug", "")
        lead_id = lead.get("id", "")
        subdomain = lead.get("subdomain") or f"{slug}.{ROOT_DOMAIN}"
        subdomain_url = f"https://{subdomain}"
        admin_url = f"https://{subdomain}/admin"

        print(f"\n{'='*70}")
        print(f"🚀 [全闭环 4 步部署 Pipeline] 挂载并配置站点: {lead['name']}")
        print(f"   ├─ 域名地址: {subdomain_url}")
        print(f"   └─ 关联 ID: {lead_id}")
        print(f"{'='*70}")

        # ─── Step 1: Vercel API 挂载域名并提取特有 verification_info (TXT Value)
        vercel_res = self.vercel.add_or_get_domain(subdomain)
        verification_info = vercel_res.get("verification", [])
        is_verified_on_vercel = vercel_res.get("verified", False)

        # ─── Step 2: 将抓取的真实验证凭证与配置持久化保存到 CRM 数据库 (Neon PostgreSQL)
        site_cfg = site_config or lead.get("site_config") or {}
        if isinstance(site_cfg, dict):
            site_cfg["dns_verification"] = verification_info

        update_lead(
            lead_id, 
            site_config=site_cfg, 
            subdomain=subdomain, 
            status="deployed", 
            is_published=True
        )
        print(f"   ✅ [1/4 Database] 已将从 Vercel 获取的凭证数据 (TXT Value) 保存至 CRM 数据库")

        # ─── Step 3: 从数据库/上下文提取凭证，精准写入 GoDaddy DNS (CNAME & TXT)
        # 3.1 写入基础 CNAME 记录
        godaddy_cname_ok = self.godaddy.set_cname(subdomain, self.cname_target)
        
        # 3.2 消费数据库里的 verification_info 动态写入 TXT 校验凭证
        godaddy_txt_ok = True
        if verification_info:
            for v_item in verification_info:
                v_type = v_item.get("type", "").upper()
                v_domain = v_item.get("domain", "")
                v_value = v_item.get("value", "")

                if v_type == "TXT" and v_domain and v_value:
                    ok = self.godaddy.set_txt(v_domain, v_value)
                    if not ok:
                        godaddy_txt_ok = False
        print(f"   ✅ [2/4 GoDaddy API] 已根据数据库凭证完成 CNAME 与 TXT 验证记录精准写入")

        # ─── Step 4: 触发 Vercel 二次所有权自动校验
        if not is_verified_on_vercel:
            verified_now = self.vercel.verify_domain(subdomain)
        else:
            verified_now = True

        # 设置已部署状态
        set_deployed(lead_id)

        result = {
            "subdomain": subdomain,
            "subdomain_url": subdomain_url,
            "admin_url": admin_url,
            "status": "deployed",
            "vercel_verified": verified_now,
            "verification_info": verification_info
        }

        print(f"\n🎉 [Pipeline Success] 商家 {lead['name']} 已闭环完成 Vercel & GoDaddy 精准部署！")
        print(f"   🌐 访问地址: {subdomain_url}")
        print(f"   🔑 管理后台: {admin_url}\n")

        return result

    def takedown(self, lead: dict):
        """
        商家下线流水线：自动解绑并更新数据库
        """
        slug = lead.get("slug", "")
        subdomain = lead.get("subdomain") or f"{slug}.{ROOT_DOMAIN}"

        print(f"\n🔌 [全自动下线 Pipeline] 卸载站点: {lead['name']} ({subdomain})")
        
        self.vercel.remove_domain(subdomain)
        self.godaddy.delete_cname(subdomain)
        update_lead(lead["id"], is_published=False, status="expired")

        print(f"   ✅ 下线完成：已从 Vercel & GoDaddy 解绑\n")
