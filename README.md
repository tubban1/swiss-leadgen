# Swiss LeadGen — 多租户全自动化闭环部署与领域驱动架构 (DDD)

![Vercel Verified](https://img.shields.io/badge/Vercel-100%25%20Verified-success?style=flat-square&logo=vercel)
![GoDaddy Automation](https://img.shields.io/badge/GoDaddy-Auto%20DNS%20Injected-blue?style=flat-square&logo=godaddy)
![Database Architecture](https://img.shields.io/badge/NeonDB-DDD%204--Table%20Relational-emerald?style=flat-square&logo=postgresql)

本项目是一套 100% 自动化的多租户 (Multi-Tenant) 商家网站自动化生成、Vercel 部署与 GoDaddy DNS 智能解析闭环系统。

---

## 🔥 核心架构亮点 (Core Highlights)

1. **领域驱动数据库 (DDD 4-Table Architecture)**：
   解耦为 `leads`, `lead_enrichments`, `site_configs`, `deployments` 四大解耦表及 `v_leads_full` 全量视图。所有 Agent 的中间数据（包含 Vercel 的 TXT 所有权凭证 `vc-domain-verify=...`）**100% 显式持久化至 Neon PostgreSQL**。
2. **100% 闭环无人工干预**：
   从 Leads 发现 -> 真实评价富化 -> Bento 动态 UI 生成 -> Vercel 自动挂载 -> GoDaddy 全量 TXT 合并 & 特化 CNAME (`4486e1c3ac91a3bb.vercel-dns-017.com`) 解析 -> Vercel 打勾验证，一气呵成。
3. **固化生产工具链**：
   提供单商家 1-by-1 原子化部署与全量商家保全解析自动化脚本。

---

## 🛠️ 固化标准化生产工具 (Production Toolkits)

| 工具脚本 | 功能描述 | 示例命令 |
| :--- | :--- | :--- |
| `tools/provision_single_merchant.py` | **单商家标准化 1-by-1 固化工具** (提取 -> 存库 -> 写入 -> 校验) | `python tools/provision_single_merchant.py <subdomain>` |
| `tools/deploy_all_merchants_bulletproof.py` | **12 家商家全量凭证保全与 CNAME 上线脚本** | `python tools/deploy_all_merchants_bulletproof.py` |
| `tools/inspect_vercel_real_domain.py` | **Vercel API 真实 Payload 审计与凭证验证工具** | `python tools/inspect_vercel_real_domain.py <subdomain>` |

---

## 📖 详细文档指引

关于领域驱动数据库结构设计、五阶段 Agent 流水线及中间 Value 传递规范，请参见：
👉 [多租户全自动化闭环部署与领域驱动架构标准 (Workflow.md)](./docs/Workflow.md)
