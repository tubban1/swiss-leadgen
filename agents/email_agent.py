"""
Email Outreach Agent
为不同语言区（DE/FR/IT）的商家生成定制销售邮件并用 Resend 发送
包含服务条款（30天免费试用，首年800，次年起100/年）与 Admin 登录凭证
"""
import resend
from openai import OpenAI
from config import (
    OPENAI_API_KEY, OPENAI_MODEL, RESEND_API_KEY,
    FROM_EMAIL, FROM_NAME, PRICE_FIRST_YEAR, PRICE_RENEWAL
)
from crm import update_lead, log_email
from datetime import datetime

openai_client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY


EMAIL_PROMPT = """You are a polite, professional Swiss sales representative for Tubban Websites.
Write a localized cold outreach email to a business owner.

Language: {language_full} ({language})
Business Name: {name}
Category: {category}
City: {city}
Subdomain URL: {subdomain_url}
Admin URL: {admin_url}
Admin Password: {admin_pass}

Offer details to communicate:
- We noticed you have high ratings on Google Maps but no website.
- We built a custom website for your business for free: {subdomain_url}
- You can manage it at {admin_url} (Password: {admin_pass}).
- It's free to try for 30 days. No hidden fees, no auto-renewal.
- If you want to keep it: CHF {price_first_year} for year 1, then CHF {price_renewal}/year.
- If you don't want it, simply ignore this email and it will deactivate automatically in 30 days.

Return JSON format:
{
  "subject": "...subject line in {language_full}...",
  "body_html": "...email HTML content in {language_full}..."
}"""


class EmailAgent:

    def _generate_fallback_email(self, lead: dict, deploy_result: dict) -> tuple[str, str]:
        """未配置 OPENAI_API_KEY 时的标准本地化邮件模版"""
        lang = lead.get("language", "de")
        name = lead["name"]
        url = deploy_result["subdomain_url"]
        admin_url = deploy_result["admin_url"]
        admin_pass = lead.get("admin_pass", "")

        if lang == "fr":
            subject = f"Un nouveau site web professionnel gratuit pour {name}"
            body = f"""
            <p>Bonjour,</p>
            <p>Nous avons remarqué votre excellente réputation sur Google Maps et nous avons créé un site web sur mesure pour <strong>{name}</strong> :</p>
            <p>👉 <a href="{url}">{url}</a></p>
            <p>Vous pouvez gérer votre contenu ici : <a href="{admin_url}">{admin_url}</a> (Mot de passe: <code>{admin_pass}</code>)</p>
            <p>Essai gratuit de 30 jours. Tarif : CHF {PRICE_FIRST_YEAR} la 1ère année, puis CHF {PRICE_RENEWAL}/an.</p>
            <p>Cordialement,<br>L'équipe Tubban</p>
            """
        else: # Default German
            subject = f"Eine neue kostenlose Website für {name}"
            body = f"""
            <p>Grüezi,</p>
            <p>wir haben Ihre hervorragenden Bewertungen auf Google Maps gesehen und eine professionelle Website für <strong>{name}</strong> erstellt:</p>
            <p>👉 <a href="{url}">{url}</a></p>
            <p>Verwaltung: <a href="{admin_url}">{admin_url}</a> (Passwort: <code>{admin_pass}</code>)</p>
            <p>30 Tage kostenlos testen. Bei Gefallen CHF {PRICE_FIRST_YEAR} im 1. Jahr, danach CHF {PRICE_RENEWAL}/Jahr.</p>
            <p>Freundliche Grüsse,<br>Ihr Tubban Team</p>
            """
        return subject, body

    def send(self, lead: dict, deploy_result: dict) -> bool:
        """生成并发送销售邮件"""
        lang = lead.get("language", "de")
        lang_full = {"de": "German", "fr": "French", "it": "Italian"}.get(lang, "German")

        print(f"\n✉️  [Antigravity Agent] 生成销售邮件 ({lang_full})...")

        if not openai_client:
            subject, body_html = self._generate_fallback_email(lead, deploy_result)
        else:
            prompt = EMAIL_PROMPT.format(
                language_full=lang_full,
                language=lang,
                name=lead["name"],
                category=lead.get("category", "business"),
                city=lead.get("city", ""),
                subdomain_url=deploy_result["subdomain_url"],
                admin_url=deploy_result["admin_url"],
                admin_pass=lead.get("admin_pass", ""),
                price_first_year=PRICE_FIRST_YEAR,
                price_renewal=PRICE_RENEWAL,
            )

            import json
            response = openai_client.chat.completions.create(
                model=OPENAI_MODEL,
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"},
            )
            data = json.loads(response.choices[0].message.content)
            subject = data["subject"]
            body_html = data["body_html"]

        recipient = lead.get("email")
        if not recipient:
            print(f"⚠️  {lead['name']}: 无有效电子邮箱，已在数据库记录生成好的邮件文本。")
            log_email(lead["id"], "outreach", subject, body_html)
            return False

        if not RESEND_API_KEY:
            print(f"ℹ️ 未配置 RESEND_API_KEY，已模拟成功发送邮件给 {recipient}")
            log_email(lead["id"], "outreach", subject, body_html)
            update_lead(lead["id"], status="emailed", email_sent_at=datetime.utcnow().isoformat())
            return True

        try:
            params = {
                "from": f"{FROM_NAME} <{FROM_EMAIL}>",
                "to": [recipient],
                "subject": subject,
                "html": body_html,
            }
            resend.Emails.send(params)
            print(f"✅ 邮件已成功发送给 {recipient}")
            log_email(lead["id"], "outreach", subject, body_html)
            update_lead(lead["id"], status="emailed", email_sent_at=datetime.utcnow().isoformat())
            return True

        except Exception as e:
            print(f"❌ 邮件发送失败: {e}")
            return False
