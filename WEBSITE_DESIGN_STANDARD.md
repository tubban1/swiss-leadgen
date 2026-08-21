# 🇨🇭 Swiss LeadGen — 多租户商业建站标准规范文档 (Website Design Standard)

> **重要说明**：本项目中所有由 AI 引擎或 Lead Scraping 流程创建、渲染的瑞士商户网站，必须**严格强制遵守**本规范文档中的美学与功能要求。

---

## 🎨 一、 视觉美学与设计原则 (Visual & Aesthetics)

1. **拒绝通用/平庸 UI (No Generic Designs)**：
   - 严禁使用极简单调的白底黑字或无质感卡片。
   - 针对不同行业（Bäckerei, Coiffeur, Zahnarzt, Sanitär, Café）必须采用**定制的行业色调与视觉语言**：
     - **Bäckerei (烘焙店)**: 暖香麦金 / 奶油象牙白 / 烤棕调 (`Warm Amber & Cream Ivory`)
     - **Coiffeur / Beauty (美发沙龙)**: 时尚玫瑰金 / 雾粉 / 奢华炭黑 (`Luxe Rose Gold & Soft Blush`)
     - **Zahnarzt (牙科诊所)**: 瑞士医疗无瑕蓝 / 极清白 (`Swiss Medical Cyan & Pure White`)
     - **Sanitär / Trade (水暖工程)**: 工业钢蓝 / 警示活力橙 (`Industrial Steel Blue & Safety Orange`)
     - **Café / Restaurant (咖啡餐馆)**: 意式浓缩暗调 / 优雅金赭色 (`Rich Espresso & Champagne Accent`)

2. **必须包含高清真实视觉图片 (High-Res Industry Imagery)**：
   - 严禁出现空白占位图或灰色框。
   - 页面 Hero 区、产品/服务卡片、环境画廊必须嵌入极高清晰度的真实商业质感图片。

3. **微交互与响应式布局 (Micro-Animations & Responsive)**：
   - 必须包含 Hover 高光过渡、阴影悬浮提升、毛玻璃悬浮 Header (`backdrop-blur`)。
   - 完美适配 Mobile (手机)、Tablet (平板) 和 Desktop (桌面端)。

---

## 🌐 二、 瑞士多语言引擎规范 (Swiss Bilingual Standard: DE & FR)

根据瑞士国情（德语区 & 法语区/双语城市如 Biel/Bienne），所有网站**必须原生提供德语 (DE) 与法语 (FR) 的无缝一键实时切换**：

1. **切换器位置**：位于 Header 导航栏显著位置（`[ DE | FR ]` 切换开关）。
2. **全页面文本覆盖**：
   - Hero 标题 & 描述
   - 核心优势与品质承诺
   - 菜单 / 服务 / 价目表
   - 客户评价 & 评分
   - 在线预订与咨询表单
   - 营业时间与页脚版权信息

---

## 📐 三、 标准页面内容架构 (Standard Content Layout)

每个商户网站必须包含以下 **8 大完整结构模块**：

1. **Top Announcement Bar**: 提示瑞士本地品质保证 + 语言切换器。
2. **Navbar**: 品牌 Logo、极简导航、一键拨号 CTA、DE/FR 语言开关。
3. **Hero Section**: 品牌巨幕、高清实景主图、评分 Badge、双按钮 CTA (在线预订 & 电话联系)。
4. **Highlights & Trust Badges**: 4 大本地核心优势（如 100% Natursauerteig / 24/7 Notfallservice / Swiss Dental Standard）。
5. **Services / Menu / Price List**: 富媒体列表（带图标、价格 CHF、服务描述与推荐标签）。
6. **Photo Gallery**: 高清实景展厅/特色展示画廊。
7. **Reviews & Testimonials**: 真实客户评价卡片与 Google 评分。
8. **Contact & Inquiry Form**: 交互式联系表单、详细地址、电话与营业时间表。

---

## ⚙️ 四、 技术与数据对接要求 (Data & SSR Standard)

1. **Neon PostgreSQL 直连数据**：商家名称、评分、评价数、城市、电话、地址等信息必须直连数据库。
2. **零 307/500 重定向异常**：使用 Next.js Client & Server Components 混合架构，确保 100% 响应 `200 OK`。
