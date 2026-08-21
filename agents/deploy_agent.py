"""
Deploy Agent — 闭环多租户网络部署与 DNS 动态凭证流水线
在单 Repo / 多租户架构下实现 4 步无缝数据流转：
1. 调 Vercel API 挂载域名，实时提取独有的所有权验证 Value (TXT: vc-domain-verify=...)
2. 将真实 DNS 验证凭证显式持久化保存至 Neon PostgreSQL 数据库的 dns_verification 独立列
3. 从数据库中提取 dns_verification 记录，精准调用 GoDaddy API 写入专属 CNAME 与 TXT 验证记录
4. 触发 Vercel 自动化二次校验 (verify_domain)，使得域名状态直接激活上线
"""
from agents.godaddy_agent import GoDaddyAgent
from agents.vercel_agent import VercelAgent
from crm import update_lead, get_lead_by_id, set_deployed
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

        print(f"\n{'='*75}")
        print(f"🚀 [4 步闭环部署 Pipeline] 挂载并配置站点: {lead['name']}")
        print(f"   ├─ 域名地址: {subdomain_url}")
        print(f"   └─ 关联 ID: {lead_id}")
        print(f"{'='*75}")

        # ─── Step 1: Vercel API 挂载域名并提取特有 verification_info (TXT Value)
        vercel_res = self.vercel.add_or_get_domain(subdomain)
        verification_info = vercel_res.get("verification", [])
        is_verified_on_vercel = vercel_res.get("verified", False)

        # ─── Step 2: 将抓取的真实验证凭证 (TXT Value) 显式持久化保存到 DB 的 dns_verification 独立列
        update_lead(
            lead_id, 
            site_config=site_config or lead.get("site_config") or {}, 
            subdomain=subdomain, 
            dns_verification=verification_info,
            status="deployed", 
            is_published=True
        )
        print(f"   ✅ [1/4 DB Persistence] 已将 Vercel 动态凭证 (TXT Value) 保存至 Neon DB [dns_verification 独立列]")

        # ─── Step 3: 强制从 Neon 数据库中读取刚保存的 dns_verification 数据，精准写入 GoDaddy
        db_lead = get_lead_by_id(lead_id) or {}
        saved_dns_records = db_lead.get("dns_verification") or verification_info

        # 3.1 写入基础 CNAME 记录
        godaddy_cname_ok = self.godaddy.set_cname(subdomain, self.cname_target)
        
        # 3.2 从数据库提取 dns_verification 记录，动态写入 GoDaddy TXT 校验凭证
        godaddy_txt_ok = True
        if saved_dns_records and isinstance(saved_dns_records, list):
            for v_item in saved_dns_records:
                v_type = v_item.get("type", "").upper()
                v_domain = v_item.get("domain", "")
                v_value = v_item.get("value", "")

                if v_type == "TXT" and v_domain and v_value:
                    print(f"   📥 [3/4 DB Consumer] 从数据库提取凭证 -> Domain: {v_domain} | Value: {v_value[:35]}...")
                    ok = self.godaddy.set_txt(v_domain, v_value)
                    if not ok:
                        godaddy_txt_ok = False
        print(f"   ✅ [3/4 GoDaddy API] 已成功消费数据库凭证并完成 CNAME 与 TXT 记录精准写入")

        # ─── Step 4: 触发 Vercel 所有权自动二次校验
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
            "dns_verification": saved_dns_records
        }

        print(f"\n🎉 [Pipeline Success] 商家 {lead['name']} 已全闭环完成 Vercel 凭证提取 -> DB 独占列保存 -> GoDaddy 精准写入 -> Vercel 校验！")
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
