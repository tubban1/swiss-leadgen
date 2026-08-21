"""
Scheduler — 多租户全自动调度轮询引擎
- 每天 02:00：运行 Lead Discovery (批量搜寻无网站商家)
- 每天 03:00：运行 Lead Enrichment (二次确认防护与邮箱抽取)
- 每天 09:00：为高意向商家批量 AI 建站、激活子域名并自动外发 Outreach 邮件
- 每天 10:00：自动发送 7 天未转化跟进邮件
- 每天 23:00：检查 30 天试用期到期情况，未付费者自动无痛下线
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


def job_discovery():
    """批量搜寻新 leads"""
    log.info("⏰ [Scheduler] 开始批量搜寻无网站商家 (Lead Discovery)")
    agent = LeadDiscoveryAgent()
    n = agent.discover(max_per_run=50)
    log.info(f"✅ Discovery 完成，新增 {n} 个无网站商家")


def job_enrichment():
    """二次确认与邮箱抽取"""
    log.info("⏰ [Scheduler] 开始二次确认与邮箱提取 (Lead Enrichment)")
    agent = LeadEnrichmentAgent()
    n = agent.enrich(batch_size=30)
    log.info(f"✅ Enrichment 完成，精准筛选出 {n} 个商家")


def job_build_and_deploy():
    """批量为优质商家 AI 建站并激活多租户域名与发信"""
    log.info("⏰ [Scheduler] 开始批量 AI 建站与多租户域名激活")
    leads = get_leads_by_status("enriched")
    if not leads:
        log.info("   当前没有待处理的 enriched leads")
        return

    builder = WebsiteBuilder()
    deployer = DeployAgent()

    for lead in leads[:10]:  # 批处理最多 10 个
        try:
            slug = lead.get("slug") or make_slug(lead["name"])
            update_lead(lead["id"], slug=slug, status="building")

            # 1. GPT-4o 生成 site_config 并在数据库注入
            site_config, admin_pass = builder.generate_config(lead, slug)
            lead["admin_pass"] = admin_pass
            lead["slug"] = slug
            update_lead(lead["id"], admin_pass=admin_pass, status="built")

            # 2. 多租户激活域名
            deploy_result = deployer.run(lead, site_config)

            # 3. 如果包含邮箱，自动触达外发邮件
            if lead.get("email"):
                emailer = EmailAgent()
                emailer.send(lead, deploy_result)
            else:
                log.info(f"   ⚠️ {lead['name']}: 暂无公开邮箱，跳过自动发信，网站已激活备用")

        except Exception as e:
            log.error(f"❌ 商家建站处理失败 {lead['name']}: {e}")
            update_lead(lead["id"], status="error")


def job_followup():
    """跟进未转化商家"""
    log.info("⏰ [Scheduler] 检查发送跟进邮件")
    from crm import db, _row_to_dict
    conn = db.get_connection()
    cutoff = (datetime.utcnow() - timedelta(days=7)).isoformat()
    
    if db.is_postgres:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT * FROM leads
                WHERE status = 'emailed'
                  AND email_sent_at < %s
                  AND followup_sent_at IS NULL
                  AND paid_at IS NULL
            """, (cutoff,))
            rows = cur.fetchall()
            results = [_row_to_dict(r, cur) for r in rows]
    else:
        rows = conn.execute("""
            SELECT * FROM leads
            WHERE status = 'emailed'
              AND email_sent_at < ?
              AND followup_sent_at IS NULL
              AND paid_at IS NULL
        """, (cutoff,)).fetchall()
        results = [_row_to_dict(r) for r in rows]
    conn.close()

    emailer = EmailAgent()
    for lead in results:
        deploy_result = {
            "subdomain_url": f"https://{lead['subdomain']}",
            "admin_url": f"https://{lead['subdomain']}/admin",
        }
        emailer.send_followup(lead, deploy_result)


def job_expiry_check():
    """试用期到期检查，无痛下线"""
    log.info("⏰ [Scheduler] 检查试用期到期 leads")
    expired = get_expired_leads()
    if not expired:
        log.info("   无到期 leads")
        return

    deployer = DeployAgent()
    for lead in expired:
        try:
            deployer.takedown(lead)
        except Exception as e:
            log.error(f"❌ 试用期下线失败 {lead['name']}: {e}")


def run_all_immediately():
    """立刻一次性跑完完整批处理循环（免去等待定时器）"""
    log.info("🚀 开启立即批量全自动化轮询任务...")
    job_discovery()
    job_enrichment()
    job_build_and_deploy()


def start():
    scheduler = BlockingScheduler(timezone="Europe/Zurich")

    # 瑞士本地时间定时绑定
    scheduler.add_job(job_discovery, CronTrigger(hour=2, minute=0))
    scheduler.add_job(job_enrichment, CronTrigger(hour=3, minute=0))
    scheduler.add_job(job_build_and_deploy, CronTrigger(hour=9, minute=0))
    scheduler.add_job(job_followup, CronTrigger(hour=10, minute=0))
    scheduler.add_job(job_expiry_check, CronTrigger(hour=23, minute=0))

    print("""
╔══════════════════════════════════════════════════════════╗
║  Swiss LeadGen Autonomous Multi-Tenant Pipeline Active   ║
╠══════════════════════════════════════════════════════════╣
║  02:00  Batch Lead Discovery                             ║
║  03:00  Secondary Enrichment & Email Extraction          ║
║  09:00  AI Site Generation & Subdomain Activation        ║
║  10:00  Automated Outreach Follow-up                     ║
║  23:00  30-Day Free Trial Expiry Check                   ║
╚══════════════════════════════════════════════════════════╝
    """)
    scheduler.start()


if __name__ == "__main__":
    import sys
    if "--now" in sys.argv:
        run_all_immediately()
    else:
        start()
