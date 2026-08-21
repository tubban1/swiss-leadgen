# 🇨🇭 Swiss LeadGen — 瑞士多租户 SaaS 建站与 Lead 拓展平台

> 自动抓取瑞士（ZH / GE / BE 等 Canton）优质无网站/弱网站本地高口碑商家，自动存入 Neon PostgreSQL 数据库，通过多租户架构在 **`*.sites.tubban.com`** 动态生成**5 大行业专属视觉 Look & Feel**、**德法双语 (DE/FR)** 与**高分辨率商业实景**的顶级高颜值网站，并配套 CRM 控制台进行自动化管理。

---

## 🏛️ 系统架构 (Cloud-Native Multi-Tenant Architecture)

```
 Lead Discovery 抓取 (Google Maps / Local Scraping: Biel, Zürich, Geneva)
                       │
                       ▼
 Neon PostgreSQL 云数据库 (自动序列化 JSON 存入 leads & email_log 表)
                       │
                       ▼
 🌐 自动化域名与 DNS 挂载 Agent
    ├── Vercel REST API 动态申请子域名 (xxx.sites.tubban.com)
    └── GoDaddy API 自动化 TXT/CNAME 解析打钩 ➔ SSL Let's Encrypt 瞬间开通
                       │
                       ▼
 Next.js 14 多租户引擎 (multi_tenant_site)
    ├── 智能 Host 解析路由 (x-forwarded-host 自动判断子域名)
    ├── 🇨🇭 德法双语引擎 (DE/FR 实时无缝切换)
    ├── 🎨 5 大行业专属 Look & Feel 与独立 Layout 版式 (Bakery / Beauty / Dentist / Trade / Café)
    └── 📊 Admin Dashboard 控制台 (sites.tubban.com/admin/dashboard)
```

---

## 🎨 5 大行业专属视觉版式与瑞士双语引擎

网站完全遵循 **[`WEBSITE_DESIGN_STANDARD.md`](./WEBSITE_DESIGN_STANDARD.md)** 设计规范：

| 行业分类 | 商家代表 | 视觉配色 & Look and Feel | Layout 专属版式架构 |
| :--- | :--- | :--- | :--- |
| **Bäckerei (烘焙店)** | `Bäckerei Chez Pierre` | 暖香麦金 & 烘焙奶油 (`Warm Amber`) | **双栏拆分柜台版式** (Split Counter) + 05:30 晨间烘焙承诺 |
| **Coiffeur (美发沙龙)** | `Coiffeur Belle Époque` | 奢华黑粉 & 玫瑰金 (`Rose Gold & Onyx`) | **Editorial 时尚杂志版式** + 奢华 Cut & Style 价目表 |
| **Zahnarzt (牙科诊所)** | `Zahnarztpraxis Biel West` | 瑞士医疗无瑕蓝白 (`Swiss Medical Cyan`) | **临床信任 + 4 宫格极简版式** (Prophylaxe & Bleaching) |
| **Sanitär (水暖工程)** | `Sanitär Heizung Biel AG` | 工业钢蓝 & 警示活力橙 (`Safety Orange`) | **24/7 应急响应 3 步骤版式** + 30 MIN 出勤响应看板 |
| **Café (咖啡餐馆)** | `Café du Commerce Biel` | 意式浓缩暗调 & 香槟金 (`Dark Espresso`) | **暗调 Bistrot 居中版式** + Barista Specialty Coffee 展示 |

> 🌐 **瑞士双语标准**：所有生成的商家网站顶部均包含 `[ DE (Deutsch) \| FR (Français) ]` 实时语言切换开关，支持地道的德语与法语内容无缝切换。

---

## 🚀 快速开始

### 1. 激活虚拟环境

```bash
source venv/bin/activate
```

### 2. 配置 `.env`

创建 `.env` 文件并填入 Neon 数据库、Vercel API 以及 GoDaddy API 凭证：

```env
# 云数据库 (Neon PostgreSQL)
DATABASE_URL=postgresql://neondb_owner:npg_...@ep-...-pooler.c-2.frankfurt.aws.neon.tech/neondb?sslmode=require

# Vercel REST API (多租户子域名绑定)
VERCEL_TOKEN=...
VERCEL_PROJECT_ID=prj_QWd5Dgvqrs4A8ogrUBPlf67L717t

# GoDaddy DNS API (自动认证打钩)
GODADDY_TOKEN=...
GODADDY_API_KEY=...
GODADDY_API_SECRET=...
ROOT_DOMAIN=sites.tubban.com

# LLM 生成配置
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o
```

### 3. 运行 Biel 地区 Lead 自动抓取与建站上链

运行抓取与自动化上链脚本，自动向 Neon 入库商家并调用 Vercel/GoDaddy API 绑定子域名：

```bash
python tools/discover_biel.py
```

### 4. 本地启动 Next.js 多租户前端

```bash
cd multi_tenant_site
npm run dev
```

在浏览器访问：
* **Admin Dashboard 控制台**: `http://localhost:3000/admin/dashboard`
* **烘焙商户网站预览**: `http://backerei-pierre-biel.localhost:3000`

---

## 📂 项目架构与关键代码文件

```
swiss-leadgen/
├── WEBSITE_DESIGN_STANDARD.md # 🇨🇭 瑞士多租户建站与美学规范文档 (必读)
├── config.py                  # 全局配置与环境变量加载
├── crm.py                     # Neon PostgreSQL 云数据库连接与 Lead 数据持久化
├── orchestrator.py            # 主拓客与建站调度流
├── requirements.txt           # Python 依赖清单
│
├── tools/
│   └── discover_biel.py       # Biel/Bienne 优质商家自动化抓取与 Vercel 域名挂载
│
├── multi_tenant_site/         # 部署在 Vercel 的生产级 Next.js App Router 多租户平台
│   ├── src/app/page.tsx       # 根路径路由分发器 (解析 Admin Dashboard / 商户 Tenant 视图)
│   ├── src/app/site/[domain]/
│   │   ├── page.tsx           # 服务端 Neon 数据库高效 SSR 数据提取
│   │   └── TenantClientView.tsx # 🇨🇭 5 大行业 Look&Feel / 双语 DE&FR / 高清图库渲染组件
│   └── src/app/admin/dashboard/
│       └── page.tsx           # Admin Dashboard 控制台 (实时查看并跳转商户生产网站)
└── ...
```

---

## 💡 多租户云架构优势

1. **单 Repo 零成本扩展**：上千个瑞士商家共享 **1 个 GitHub 仓库** 与 **1 个 Vercel 部署**，运维成本接近于零。
2. **极速实时更新**：商家数据、风格与配置直连 Neon 数据库，改动实时全网生效。
3. **域名 API 自动化打钩**：通过 Python Agent 自动调用 GoDaddy 写入 TXT 记录，并让 Vercel 验证通过，无需任何人工 DNS 操作。
