# 🇨🇭 Swiss LeadGen — 领域驱动多表解耦数据库架构与 Multi-Agent 数据流转规范 (Enterprise Relational Multi-Table Architecture)

> **领域设计原则**：拒绝混乱的单表大宽表。系统严格按照 **DDD (Domain-Driven Design)** 规范，拆分为 **4 大核心专业关系型数据表**，每个 Agent 只操作并更新自身领域的数据库表，并通过外键 (`lead_id`) 形成严密高效的数据流转。

---

## 🏛️ 1. 4 大领域专业数据库表 (Enterprise Relational Tables)

```
┌───────────────────────────────────────────────────────────────────────────┐
│ 1. leads (主表 - 核心领域)                                                 │
│    id (PK), place_id, name, category, address, city, canton, language...  │
└─────────────────────────────────────┬─────────────────────────────────────┘
                                      │ 1:1 外键关联 (lead_id)
      ┌───────────────────────────────┼───────────────────────────────┐
      │                               │                               │
      ▼                               ▼                               ▼
┌──────────────────────────┐   ┌──────────────────────────┐   ┌──────────────────────────┐
│ 2. lead_enrichments      │   │ 3. site_configs          │   │ 4. deployments           │
│ (富化数据表)              │   │ (建站与排版配置表)       │   │ (网络部署与 DNS 凭证表)  │
│ ├─ email, phone          │   │ ├─ slug, subdomain       │   │ ├─ vercel_status         │
│ ├─ reviews_data (Google) │   │ ├─ admin_pass            │   │ ├─ dns_verification (TXT)│
│ └─ services_data         │   │ └─ site_config (JSON)    │   │ └─ godaddy_status        │
└──────────────────────────┘   └──────────────────────────┘   └──────────────────────────┘
```

---

## 🔄 2. 5 阶段 Multi-Agent 解耦分流读写链条

| 阶段 Agent | 读取依赖 (Inputs) | 写入目标表 (Target DB Table) | 写入/更新字段 |
| :--- | :--- | :--- | :--- |
| **Agent 1: Discovery** | Google Maps API | `leads` | `place_id`, `name`, `address`, `city` |
| **Agent 2: Enrichment** | Google Places / Outscraper | `lead_enrichments` | `email`, `phone`, `reviews_data` |
| **Agent 3: SiteBuilder** | `lead_enrichments.reviews_data` | `site_configs` | **`site_config` (全套 Awwwards 建站 JSON)** |
| **Agent 4: VercelAgent** | `site_configs.subdomain` | `deployments` | **`dns_verification` (Vercel 专属 TXT Value)** |
| **Agent 5: GoDaddyAgent** | `deployments.dns_verification` | `deployments` | `godaddy_status`, `is_published` |

---

## 📊 3. 整合联表视图 (`v_leads_full`)

为确保管理后台与调试接口的高效查询，数据库内建了平滑联表视图：
```sql
CREATE OR REPLACE VIEW v_leads_full AS
SELECT 
    l.id, l.place_id, l.name, l.category, l.address, l.city, l.canton, l.language, l.status, l.created_at,
    e.email, e.phone, e.website_hint, e.rating, e.review_count, e.google_maps_url, e.reviews_data, e.opening_hours, e.services_data,
    s.slug, s.subdomain, s.admin_pass, s.site_config,
    d.dns_verification, d.vercel_status, d.godaddy_status, d.is_published, d.expires_at
FROM leads l
LEFT JOIN lead_enrichments e ON l.id = e.lead_id
LEFT JOIN site_configs s ON l.id = s.lead_id
LEFT JOIN deployments d ON l.id = d.lead_id;
```

---

## 🚀 运维查验命令

```bash
# 1. 验证 4 大解耦表的数据独立保存统计
python tools/verify_relational_tables.py

# 2. 全量闭环 Multi-Agent 联表分流测试
python tools/auto_provision_closed_loop.py
```
