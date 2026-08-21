# 🇨🇭 Swiss Multi-Tenant Website Design Standard & Explicit 1-by-1 Provisioning Spec
## 瑞士多租户 SaaS 建站视觉美学与逐个独立域名挂载/解析固化规范

> 本文档固化了平台所有的视觉美学标准（Awwwards 级别）、布局规范、德法双语交互，以及 **Vercel REST API + GoDaddy DNS API 逐个独立挂载/显式解析固化流程**。所有新加入的商家与城市拓展均必须 100% 遵循此标准。

---

## 🏛️ 1. 逐个独立挂载与显式解析固化标准 (Explicit 1-by-1 Provisioning Pipeline)

鉴于 Vercel 项目采用独立域名挂载模式，平台所有新增商家的网络部署已完全固化为**“逐个独立挂载 Vercel、逐个显式解析 GoDaddy”**的标准流水线：

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
│ 3. Vercel REST API 逐个独立挂载      │  │ 4. GoDaddy REST API 逐个显式 CNAME   │
│    VercelAgent.add_domain(subdomain) │  │    GoDaddyAgent.set_cname(prefix,    │
│    -> 挂载进项目 multi_tenant_site   │  │    "cname.vercel-dns.com")           │
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
# Vercel 自动化凭证 (对应项目 multi_tenant_site)
VERCEL_TOKEN=vcp_...
VERCEL_PROJECT_ID=multi_tenant_site

# GoDaddy 自动化凭证
GODADDY_TOKEN=gd_pat_...
GODADDY_API_KEY=your_key
GODADDY_API_SECRET=your_secret
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

- [x] 新增商家是否自动经由 `DeployAgent` 逐个向 Vercel (`multi_tenant_site`) 与 GoDaddy 申请挂载？
- [x] 商家子域名是否具备唯一性（如 `*.sites.tubban.com`）？
- [x] 页面视觉是否应用了 Bento Grid 与 Ambient Mesh Gradients？
- [x] 德法双语切换在 Desktop 与 Mobile 端均响应灵敏？
- [x] 页面包含可交互的在线预约/预订 Lead-Capture 表单？
