# 🇨🇭 Swiss LeadGen — 全闭环 DNS 验证凭证提取、数据库保存与全自动写入架构规范 (Closed-Loop Provisioning & Verification Standard)

> **核心流转法则**：每一个域名在 Vercel 挂载时，均会产生一个独有的所有权验证 Value (`vc-domain-verify=...`)。系统自动将 Vercel API 返回的验证凭证数据**保存至 Neon PostgreSQL 数据库**，下一个流程**从数据库消费此凭证**并精确写入 GoDaddy，最后触发 Vercel 二次校验实现 100% 自动激活。

---

## 🔄 4 步全闭环数据流转图解 (Data Flow Architecture)

```
┌───────────────────────────────────────────────────────────────────────────┐
│ Step 1: Vercel REST API 域名挂载与动态凭证提取                             │
│ 调 POST /v9/projects/multi_tenant_site/domains                             │
│ 提取独有 Verification 凭证:                                                │
│ Type: TXT | Target: _vercel.tubban.com | Value: vc-domain-verify=...       │
└─────────────────────────────────────┬─────────────────────────────────────┘
                                      │
                                      ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ Step 2: Neon PostgreSQL 云数据库持久化保存                                │
│ 将提取到的 verification_info (含精准 TXT Value) 序列化存入 leads 表       │
└─────────────────────────────────────┬─────────────────────────────────────┘
                                      │
                                      ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ Step 3: 从数据库消费凭证并全自动写入 GoDaddy                               │
│ 1. 显式写入 CNAME 记录: {subdomain_prefix} ➔ cname.vercel-dns.com        │
│ 2. 从数据库读取并写入专属 TXT 校验记录: _vercel ➔ {vc-domain-verify=...}    │
└─────────────────────────────────────┬─────────────────────────────────────┘
                                      │
                                      ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ Step 4: Vercel 所有权二次校验与开通                                        │
│ 调 POST /v9/projects/multi_tenant_site/domains/{domain}/verify           │
│ 状态由 "Verification Required" 自动转为 "Valid Configuration" (上线成功)   │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 各域名独有 TXT Value 在 Neon 数据库中的映射清单

| 商家名称 | 域名 (Domain) | 数据库保存的真实 TXT Value (Vercel Verification) |
| :--- | :--- | :--- |
| **Sanitär Express Seeland** | `sanitaer-express-seeland.sites.tubban.com` | `vc-domain-verify=sanitaer-express-seeland.sites.tubban.com,b51a1f4ab5b27431d916` |
| **Cabinet Dentaire Place** | `dentiste-place-centrale.sites.tubban.com` | `vc-domain-verify=dentiste-place-centrale.sites.tubban.com,fc985734d6b65419bf1a` |
| **Boulangerie du Port Bienne**| `boulangerie-du-port-bienne.sites.tubban.com` | `vc-domain-verify=boulangerie-du-port-bienne.sites.tubban.com,eafe26ea27286d15a731` |
| **Brasserie della Gare** | `brasserie-gare-bienne.sites.tubban.com` | `vc-domain-verify=brasserie-gare-bienne.sites.tubban.com,d30931d9fa47d5f9bec8` |
| **Bäckerei Müller** | `backerei-muller.tubban.com` | `vc-domain-verify=backerei-muller.tubban.com,1ff08e1a1b0eb11459fe` |

---

## 🚀 运维运行命令

```bash
# 全闭环触发凭证提取、数据库保存、GoDaddy 精准写入与 Vercel 所有权校验
python tools/auto_provision_closed_loop.py
```
