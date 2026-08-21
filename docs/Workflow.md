# 🇨🇭 Swiss LeadGen — 逐个全自动域名挂载与解析固化流水线 (Explicit 1-by-1 Solidified Provisioning Pipeline)

> 鉴于 Vercel 不采用通配符，系统采用 **“逐个独立挂载、逐个显式解析” (1-by-1 Explicit Provisioning)** 标准流程。每个新创建的商家网站均会独立触发 Vercel API 绑定与 GoDaddy API CNAME 记录创建。

---

## 🔄 全自动化固化执行图解

```
                   ┌─────────────────────────────────────────┐
                   │  1. 商家抓取 / 新建 (discover_biel.py)  │
                   └────────────────────┬────────────────────┘
                                        │
                                        ▼
                   ┌─────────────────────────────────────────┐
                   │  2. Neon PostgreSQL 数据库持久化        │
                   │     (status = 'deployed', is_pub=1)     │
                   └────────────────────┬────────────────────┘
                                        │
                                        ▼
                   ┌─────────────────────────────────────────┐
                   │  3. Vercel REST API 逐个独立挂载        │
                   │     POST /v9/projects/{project}/domains │
                   │     Project ID: multi_tenant_site       │
                   └────────────────────┬────────────────────┘
                                        │
                                        ▼
                   ┌─────────────────────────────────────────┐
                   │  4. GoDaddy REST API 逐个显式解析绑定   │
                   │     PUT /v1/domains/{domain}/records/   │
                   │     CNAME/{subdomain_prefix}            │
                   │     Target: cname.vercel-dns.com        │
                   └────────────────────┬────────────────────┘
                                        │
                                        ▼
                   ┌─────────────────────────────────────────┐
                   │  5. 极速全线开通在线 (HTTPS / SSL Ready)│
                   └─────────────────────────────────────────┘
```

---

## 🛠️ 代码模块分工

| 顺序 | 模块名称 | 核心职责 | 关联 API / 节点 |
| :--- | :--- | :--- | :--- |
| **Step 1** | `crm.py` | Lead 数据存入 Neon PostgreSQL 云数据库 | `insert_lead()` / `update_lead()` |
| **Step 2** | `agents/vercel_agent.py` | 逐个调用 Vercel REST API 向 `multi_tenant_site` 项目挂载独立子域名 | `POST /v9/projects/multi_tenant_site/domains` |
| **Step 3** | `agents/godaddy_agent.py` | 逐个调用 GoDaddy API 在 `tubban.com` 根下写入对应的 CNAME 记录 | `PUT /v1/domains/tubban.com/records/CNAME/{prefix}` |
| **Step 4** | `agents/deploy_agent.py` | 统一调度器，实现单键并发与防重全自动部署 | `DeployAgent().run(lead)` |

---

## 🔑 凭证配置 (`.env`)

```env
# Vercel REST API
VERCEL_TOKEN=vcp_...
VERCEL_PROJECT_ID=multi_tenant_site

# GoDaddy REST API
GODADDY_TOKEN=gd_pat_...
GODADDY_API_KEY=your_key
GODADDY_API_SECRET=your_secret
ROOT_DOMAIN=sites.tubban.com
```

---

## 🚀 批量自动化运行工具

```bash
# 1. 批量对数据库中全部商家逐个执行 Vercel + GoDaddy 挂载解析
python tools/auto_provision_all.py

# 2. 新增指定城市商家并自动逐个挂载
python tools/discover_biel.py
```
