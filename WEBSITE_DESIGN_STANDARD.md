# 🇨🇭 Swiss Multi-Tenant Website Design Standard & Automated Provisioning Spec
## 瑞士多租户 SaaS 建站与视觉美学与自动化域名流水线规范

> 本文档固化了平台所有的视觉美学标准（Awwwards 级别）、布局规范、德法双语交互，以及 **Vercel REST API + GoDaddy DNS API 自动化固化部署流程**。所有新加入的商家与城市拓展均必须 100% 遵循此标准。

---

## 🏛️ 1. 自动化部署与网络挂载固化标准 (Vercel & GoDaddy Solidified Pipeline)

为避免人工干预 DNS 与域名配置，平台所有新增商家的上游接入已完全固化为自动化流水线 `DeployAgent` (位于 `agents/deploy_agent.py`)：

```
                    ┌────────────────────────────────────────┐
                    │ 1. 抓取与分析 (discover_biel.py)        │
                    └───────────────────┬────────────────────┘
                                        │
                                        ▼
                    ┌────────────────────────────────────────┐
                    │ 2. Neon PostgreSQL 数据持久化           │
                    │    (insert_lead & update_lead)         │
                    └───────────────────┬────────────────────┘
                                        │
                                        ▼
           ┌────────────────────────────┴────────────────────────────┐
           │                                                         │
           ▼                                                         ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────────────┐
│ 3. Vercel REST API 动态挂载 (v9)    │  │ 4. GoDaddy REST API CNAME 自动解析   │
│    VercelAgent.add_domain(subdomain) │  │    GoDaddyAgent.set_cname(prefix,    │
│    -> 自动挂载子域名进 Vercel 项目   │  │    "cname.vercel-dns.com")           │
└──────────────────┬───────────────────┘  └──────────────────┬───────────────────┘
                   │                                         │
                   └────────────────────┬────────────────────┘
                                        │
                                        ▼
                    ┌────────────────────────────────────────┐
                    │ 5. 全线开通并处于 deployed 在线状态     │
                    └────────────────────────────────────────┘
```

### 固化 API 配置文件与凭证要求 (`.env`)
```env
# Vercel 自动化凭证
VERCEL_TOKEN=your_vercel_bearer_token
VERCEL_PROJECT_ID=tubban-multi-tenant-site

# GoDaddy 自动化凭证
GODADDY_TOKEN=your_godaddy_personal_access_token
GODADDY_API_KEY=your_godaddy_api_key
GODADDY_API_SECRET=your_godaddy_api_secret
ROOT_DOMAIN=sites.tubban.com
```

---

## 🎨 2. Awwwards 级“高奢去模板化”视觉设计标准 (Editorial Luxury)

### 2.1 便当盒布局系统 (Asymmetrical Bento Grid Architecture)
* **核心原则**：禁止任何机械划一的 3x3 均匀网格。
* **组合规则**：每一个行业的主 Hero 区域必须由 **2x2 品牌核心主张卡片** + **2x1 动态数据/微距卡片** + **1x1 双重高光指标** 组合而成。

### 2.2 顶级渲染技术 (Double-Relief Glassmorphism & Ambient Mesh)
* **双重浮雕边框**：所有 Card 必须具备 `backdrop-blur-2xl bg-white/[0.03] border border-white/10 ring-1 ring-white/5` 科技浮雕感。
* **环境弥散背光**：
  * Bakery 烘焙: `bg-amber-600/15 blur-[140px]` 暖麦金
  * Coiffeur 沙龙: `bg-rose-900/20 blur-[160px]` 玫瑰高奢黑粉
  * Dentist 牙科: `bg-cyan-950/30 blur-[160px]` 冰蓝纯净
  * Sanitär 水暖: `bg-orange-950/20 blur-[160px]` 工业警示橙
  * Café 餐饮: `bg-amber-950/20 blur-[160px]` 浓缩暗调香槟金

### 2.3 真实口碑评价墙 (Google Verified Client Reviews Wall)
* 所有商家必须展示 **★ 4.9/5.0 Google Local Guide** 口碑评价墙。
* 包含真实 Swiss Local 评论者实名与头像首字母徽章。

### 2.4 地道德法双语切换 (Native DE / FR Bilingual Switcher)
* 头部强固定 `[ DE | FR ]` 实时语言切换器。
* 全站 Hero 标语、服务价目、客户评价、预约表单文本实现秒级无缝联动转换。

---

## 📋 3. 规范落地检查清单 (Checklist)

- [x] 新增商家是否自动经由 `DeployAgent` 调起 Vercel & GoDaddy API？
- [x] 商家域名是否具备唯一性（如 `*.sites.tubban.com`）？
- [x] 页面视觉是否应用了 Bento Grid 与 Ambient Mesh Gradients？
- [x] 德法双语切换在 Desktop 与 Mobile 端均响应灵敏？
- [x] 页面包含可交互的在线预约/预订 Lead-Capture 表单？
