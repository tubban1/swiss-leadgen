# 🇨🇭 Swiss LeadGen — Awwwards 级多租户 Web Design Skill 标准规范

> **核心原则（Constraint-First De-Templatization）**：全站坚决杜绝平庸 AI 模板感（Cookie-Cutter UI）。结合 **Awwwards / BentoGrids.com / Editorial Luxury** 顶级设计规范，针对每个瑞士商家打造打破常规版式的非对称高奢体验。

---

## 🎨 一、 顶级设计 Skill 五大核心维度 (5 Luxury Core Principles)

### 1. 非对称 Bento Grid 布局 (Asymmetrical Bento Architecture)
- 严禁使用等宽、对齐的普通卡片网格。
- 必须使用 **Bento Grid 模块分割**：
  - **2x2 主张巨型卡**：承载品牌的核心价值、Google 5.0 信任勋章与实景图。
  - **2x1 横向高光条**：承载即时 Callout（如 05:30 晨间烘焙 / 24/7 应急 Hotline）。
  - **1x1 浮雕指标块**：承载毛玻璃高光数据（如 30 MIN 出勤 / 100% Natursauerteig）。

### 2. 杂志级高端字阶系统 (Editorial Luxury Typography)
- **标题 (Headings)**: 采用典雅高贵的 Serif 衬线体或超粗非对称大字（`font-serif tracking-tight leading-[1.05]`）。
- **小标与 Tag (Kicker/Badges)**: 采用全大写、宽字距（`tracking-[0.2em] uppercase text-[11px]`）。
- **正文 (Body)**: 纤细优雅、高舒适度行距（`font-light text-[#a1a1aa] leading-relaxed`）。

### 3. 多层高斯模糊与双重浮雕边框 (Glassmorphism & Double Borders)
- 背景使用 **Ambient Mesh Gradient (弥散光背景)**：
  - 烘焙店：深焦糖/暗麦香渐变背景 + 柔和琥珀光晕 (`radial-gradient bg-amber-950/20 blur-3xl`)
  - 美发沙龙：奢华炭黑/玫瑰粉弥散背景 (`radial-gradient bg-rose-950/30 blur-3xl`)
  - 牙科诊所：深海医用蓝/湖蓝光晕 (`radial-gradient bg-cyan-950/30 blur-3xl`)
  - 水暖工程：工业深蓝/警示橙光晕 (`radial-gradient bg-orange-950/20 blur-3xl`)
  - 咖啡餐馆：意式浓缩暗色/金赭光晕 (`radial-gradient bg-stone-900 blur-3xl`)
- 卡片使用 **`backdrop-blur-xl bg-white/[0.03] border border-white/10 ring-1 ring-white/5`**，呈现浮雕透光质感。

### 4. 动态气泡浮窗与细节打磨 (Floating Ambient Micro-Cards)
- 在 Hero 主图四周悬浮带有高光阴影的 **Floating Glass Badges**（如：`★ 4.9 Verified Review` / `🇨🇭 100% Swiss Crafted`）。
- Hover 悬浮浮雕效果：卡片悬浮时带光彩边缘移动 (`hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1 transition-all duration-500`)。

### 5. 🇨🇭 德法双语原生无缝转换 (Swiss Native Bilingual Engine)
- 顶部导航栏配置高质感交互式 `[ DE (Deutsch) | FR (Français) ]` 动态 Pills 开关。
- 全站所有的 Bento 卡片、大字标题、预约表单与服务卡片均原生地道覆盖德法语。

---

## 📐 二、 5 大行业非对称 Bento Grid 独立 Layout 架构

| 行业 | 视觉 Theme & 弥散背光 | Hero Bento 模块分割 | 专属去模板化细节 |
| :--- | :--- | :--- | :--- |
| 🥐 **Bäckerei** | Warm Amber & Baked Oats | **2x2 新鲜面包实景卡 + 2x1 05:30 晨间烘焙卡 + 1x1 酸面包 Badge** | 浮雕金麦勋章 + 传统烘焙温度提示 |
| ✂️ **Coiffeur** | Haute Rose Gold & Luxe Onyx | **2x2 Lookbook 时尚杂志海报 + 2x1 Styling 价格表 + 1x1 VIP 咨询** | 纤细高雅线条 + Balayage 亮泽色阶表 |
| 🦷 **Zahnarzt** | Swiss Medical Cyan & Pure Ice | **2x2 瑞士无菌诊室实景 + 2x1 无痛承诺卡 + 1x1 Swiss Dental 标准** | 医用蓝白微光 + 快捷挂号悬浮窗 |
| 🛠️ **Sanitär** | Industrial Steel & Safety Orange | **2x2 24/7 应急抢修 Hero + 2x1 30 MIN 出勤看板 + 1x1 透明报价** | 橙色动能脉冲 + 施工质保印章 |
| ☕️ **Café** | Dark Espresso & Champagne Accent | **2x2 Bistrot 特调咖啡 Hero + 2x1 主厨推荐 + 1x1 桌位预订卡** | 意式特调拉花视差 + 黑金菜单卡 |
