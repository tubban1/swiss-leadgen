# 🇨🇭 Swiss LeadGen — Multi-Agent 强中间态数据库存储与数据流转规范 (Explicit Multi-Agent Pipeline Storage Spec)

> **核心设计思想**：每个 Agent 的产出与网络交互凭证，**都必须作为强中间态显式保存至 Neon PostgreSQL 数据库中**，供下一个 Agent 或部署节点直接消费与使用。

---

## 🗄️ 1. `leads` 数据库表结构与 Agent 产出中间态映射

```sql
CREATE TABLE leads (
    -- Agent 1: LeadDiscoveryAgent 产出
    id               VARCHAR(64) PRIMARY KEY,
    place_id         VARCHAR(255) UNIQUE,
    name             TEXT NOT NULL,
    category         VARCHAR(100),
    address          TEXT,
    city             VARCHAR(100),
    canton           VARCHAR(10),
    language         VARCHAR(10),
    rating           NUMERIC(3, 2),
    review_count     INT,
    google_maps_url  TEXT,
    
    -- Agent 2: LeadEnrichmentAgent 产出中间态
    email            VARCHAR(255),
    phone            VARCHAR(100),
    website_hint     TEXT,
    reviews_data     TEXT,       -- [中间态] 抓取的真实 Google 用户评语列表 (JSON)
    opening_hours    TEXT,       -- [中间态] 营业时间 JSON
    services_data    TEXT,       -- [中间态] 主营服务项目与价格表 (JSON)
    
    -- Agent 3: SiteBuilderAgent 产出中间态
    slug             VARCHAR(255) UNIQUE,
    subdomain        VARCHAR(255) UNIQUE,
    admin_pass       VARCHAR(100),
    site_config      TEXT,       -- [中间态] 全套 Awwwards 建站与双语 Content (JSON)
    
    -- Agent 4: VercelAgent 产出中间态
    dns_verification TEXT,       -- [中间态] 从 Vercel API 获取的专属 TXT 验证 Value (JSON)
    vercel_status    VARCHAR(50) DEFAULT 'unmounted',
    
    -- Agent 5: GoDaddyAgent 产出中间态
    godaddy_status   VARCHAR(50) DEFAULT 'unconfigured',
    is_published     BOOLEAN DEFAULT TRUE,
    status           VARCHAR(50) DEFAULT 'discovered',
    expires_at       TIMESTAMP
);
```

---

## 🔄 2. Multi-Agent 数据流转全景图

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Agent 1: LeadDiscoveryAgent                                              │
│ 产出: name, address, city, rating, place_id                              │
│ 存库 ➔ leads (status = 'discovered')                                     │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │
                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ Agent 2: LeadEnrichmentAgent                                             │
│ 产出: reviews_data (真实评论), email, phone, services_data               │
│ 存库 ➔ UPDATE leads SET reviews_data=..., email=... (status = 'enriched')│
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │
                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ Agent 3: SiteBuilderAgent                                                │
│ 消费: reviews_data + category ➔ 生成 Awwwards site_config & 双语 Content │
│ 存库 ➔ UPDATE leads SET site_config=... (status = 'configured')          │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │
                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ Agent 4: VercelAgent                                                     │
│ 消费: subdomain ➔ 调 Vercel API 挂载 ➔ 提取独有 Verification TXT Value    │
│ 存库 ➔ UPDATE leads SET dns_verification=... (status = 'vercel_mounted') │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │
                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ Agent 5: GoDaddyAgent                                                    │
│ 消费: 从 DB 读取 dns_verification 独立列 ➔ 写入 GoDaddy CNAME & TXT 记录 │
│ 触发 ➔ Vercel 二次校验 (verify_domain) ➔ 上线 (status = 'deployed')      │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 常用流水线命令

```bash
# 1. 重新为全量 Lead 生成并保存 site_config 中间态
python tools/enrich_and_build_all_leads.py

# 2. 全闭环 5 阶段 Agent 数据流转与全自动挂载/解析
python tools/auto_provision_closed_loop.py

# 3. 查验 Neon DB 中各中间态字段保存状态
python tools/check_db_dns_verification.py
```
