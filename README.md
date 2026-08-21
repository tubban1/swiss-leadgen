# Swiss LeadGen (单 Repo 多租户版本)

> 自动发现瑞士优质无网站本地商家，通过 GPT-4o 生成 Prompt-Driven 专属设计与文案，集中于单一多租户架构中自动部署并上线 `xxx.tubban.com`，自动发送本地化（德/法/意）销售邮件。

---

## 🏛️ 系统架构 (Single-Repo Multi-Tenant)

```
Lead Discovery (Playwright 免费抓取)
       │
       ▼
Lead Enrichment (Serper.dev 验证)
       │
       ▼
Website Builder (GPT-4o 生成 site_config 专属设计 JSON)
       │
       ▼
Deploy Agent (写入数据库 + GoDaddy 添加 *.tubban.com CNAME)
       │
       ▼
Email Outreach (Resend 发送带 Access Credentials 的销售邮件)
```

---

## 🚀 快速开始

### 1. 激活虚拟环境与依赖

```bash
cd swiss-leadgen
source venv/bin/activate
```

### 2. 配置 `.env`

复制 `.env.example` 为 `.env` 并填写秘钥（只需准备 OPENAI_API_KEY, RESEND_API_KEY, GODADDY_API_KEY 等，无需 Google API）：

```env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o
GODADDY_API_KEY=...
GODADDY_API_SECRET=...
ROOT_DOMAIN=tubban.com
RESEND_API_KEY=re_...
```

### 3. 初始化 CRM 数据库

```bash
python crm.py
```

### 4. 运行 MVP 端到端部署测试

```bash
python orchestrator.py
```

### 5. 启动每日定时巡航

```bash
python scheduler/scheduler.py
```

---

## 📂 项目结构

```
swiss-leadgen/
├── config.py                 # 全局配置
├── crm.py                    # CRM 数据库 (支持 site_config JSON 存储)
├── orchestrator.py           # MVP 主工作流
├── README.md
├── requirements.txt
│
├── agents/
│   ├── lead_discovery.py     # Playwright 免费零成本抓取 Google Maps
│   ├── lead_enrichment.py    # Serper.dev 验证无网站与邮箱
│   ├── website_builder.py    # GPT-4o 生成独特的 site_config JSON
│   ├── deploy_agent.py       # 多租户 CNAME 域名配置 & 状态更新
│   ├── godaddy_agent.py      # GoDaddy DNS CNAME 接口
│   └── email_agent.py        # 多语言销售邮件发送
│
├── multi_tenant_site/        # 统一部署在 Vercel 的 Next.js 多租户源码
│   ├── middleware.ts         # 自动解析访问的子域名
│   └── src/app/[domain]/     # 根据数据库配置动态渲染 UI
│
└── scheduler/
    └── scheduler.py          # 定时调度任务 (Discovery, Deploy, Expiry Check)
```

---

## 💡 多租户架构优势

1. **零 GitHub Repo 积压**：1000 个商家只需要 **1 个** GitHub Repo 和 **1 个** Vercel 部署。
2. **瞬间全站更新**：网站的主题、文案完全存储在数据库中，修改配置全网即时生效。
3. **试用期自动下线**：30 天未付费只需将数据库的 `is_published` 标记为 `0`，极低成本。
