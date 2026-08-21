"""
Scheduler — 定时任务
- 每天凌晨 2:00：运行 Lead Discovery
- 每天凌晨 3:00：运行 Lead Enrichment
- 每天上午 9:00：为 enriched leads 构建并部署网站
- 每天 10:00：检查 30 天到期，自动下线
- 7天后：发送跟进邮件
"""
import logging
from datetime import datetime, timedelta
from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.cron import CronTrigger

from crm import get_leads_by_status, get_expired_leads, update_lead
from agents.lead_discovery import LeadDiscoveryAgent
from agents.lead_enrichment import LeadEnrichmentAgent
from agents.website_builder import WebsiteBuilder
from agents.deploy_agent import DeployAgent
from agents.email_agent import EmailAgent
from tools.utils import make_slug

logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)

BUILD_DIR_BASE = "builds"


# ── 定时任务函数 ──────────────────────────────────────────

def job_discovery():
    """每天：发现新 leads"""
    log.info("⏰ [Scheduler] 开始 Lead Discovery")
    agent = LeadDiscoveryAgent()
    n = agent.discover(max_per_run=50)
    log.info(f"✅ Discovery 完成，新增 {n} 个 leads")


def job_enrichment():
    """每天：enrichment 处理"""
    log.info("⏰ [Scheduler] 开始 Lead Enrichment")
    agent = LeadEnrichmentAgent()
    n = agent.enrich(batch_size=30)
    log.info(f"✅ Enrichment 完成，处理 {n} 个 leads")


def job_build_and_deploy():
    """每天：为 enriched leads 构建并部署网站"""
    log.info("⏰ [Scheduler] 开始 Build & Deploy")
    leads = get_leads_by_status("enriched")
    if not leads:
        log.info("   没有待处理的 enriched leads")
        return

    builder = WebsiteBuilder()
    deployer = DeployAgent()

    for lead in leads[:10]:  # 每次最多处理 10 个
        try:
            slug = lead.get("slug") or make_slug(lead["name"])
            update_lead(lead["id"], slug=slug, status="building")

            site_dir, admin_pass = builder.build(lead, slug)
            update_lead(lead["id"], admin_pass=admin_pass, status="built")
            lead["admin_pass"] = admin_pass
            lead["slug"] = slug

            deploy_result = deployer.run(lead, site_dir)

            # 如果有邮箱，立即发送
            if lead.get("email"):
                emailer = EmailAgent()
                emailer.send(lead, deploy_result)
            else:
                log.info(f"   ⚠️  {lead['name']}: 无邮箱，跳过发送")

        except Exception as e:
            log.error(f"❌ 处理失败 {lead['name']}: {e}")
            update_lead(lead["id"], status="error")


def job_followup():
    """每天：对 7 天前发过邮件但未转化的 lead 发跟进"""
    log.info("⏰ [Scheduler] 检查跟进邮件")
    from crm import get_conn
    conn = get_conn()
    cutoff = (datetime.utcnow() - timedelta(days=7)).isoformat()
    rows = conn.execute("""
        SELECT * FROM leads
        WHERE status = 'emailed'
          AND email_sent_at < ?
          AND followup_sent_at IS NULL
          AND paid_at IS NULL
    """, (cutoff,)).fetchall()
    conn.close()

    emailer = EmailAgent()
    for row in rows:
        lead = dict(row)
        deploy_result = {
            "subdomain_url": f"https://{lead['subdomain']}",
            "admin_url": f"https://{lead['subdomain']}/admin",
        }
        emailer.send_followup(lead, deploy_result)


def job_expiry_check():
    """每天：检查到期未付款的 leads，执行下线"""
    log.info("⏰ [Scheduler] 检查到期 leads")
    expired = get_expired_leads()
    if not expired:
        log.info("   没有到期 leads")
        return

    deployer = DeployAgent()
    for lead in expired:
        try:
            deployer.takedown(lead)
        except Exception as e:
            log.error(f"❌ 下线失败 {lead['name']}: {e}")


# ── 启动调度器 ────────────────────────────────────────────

def start():
    scheduler = BlockingScheduler(timezone="Europe/Zurich")

    # 每天凌晨 2:00 发现新 leads
    scheduler.add_job(job_discovery, CronTrigger(hour=2, minute=0))
    # 每天凌晨 3:00 enrichment
    scheduler.add_job(job_enrichment, CronTrigger(hour=3, minute=0))
    # 每天上午 9:00 构建部署
    scheduler.add_job(job_build_and_deploy, CronTrigger(hour=9, minute=0))
    # 每天上午 10:00 跟进邮件
    scheduler.add_job(job_followup, CronTrigger(hour=10, minute=0))
    # 每天下午 11:00 检查到期
    scheduler.add_job(job_expiry_check, CronTrigger(hour=23, minute=0))

    print("""
╔══════════════════════════════════╗
║  Swiss LeadGen Scheduler 已启动  ║
╠══════════════════════════════════╣
║  02:00  Lead Discovery           ║
║  03:00  Lead Enrichment          ║
║  09:00  Build & Deploy           ║
║  10:00  Follow-up Emails         ║
║  23:00  Expiry Check             ║
╚══════════════════════════════════╝
    """)
    scheduler.start()


if __name__ == "__main__":
    start()
