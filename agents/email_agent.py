"""
Email Agent — 草稿模式与手工审核模式
默认只在 CRM 数据库生成草稿日志 (email_log)，不真实外发邮件。
管理员可在 Admin Dashboard 统一审核后发送或导出。
"""
import json
from config import RESEND_API_KEY, FROM_EMAIL, FROM_NAME, PRICE_FIRST_YEAR, PRICE_RENEWAL, FREE_TRIAL_DAYS
from crm import update_lead, log_email


class EmailAgent:

    def _generate_template(self, lead: dict, deploy_result: dict) -> tuple[str, str]:
        """按语言生成商业高情商 outreach 模版 (德/法/意)"""
        lang = lead.get("language", "de")
        name = lead["name"]
        city = lead.get("city", "Schweiz")
        site_url = deploy_result["subdomain_url"]
        admin_url = deploy_result["admin_url"]
        admin_pass = lead.get("admin_pass", "N/A")

        if lang == "fr":
            subject = f"Un nouveau site web moderne créé pour {name} (Essai gratuit 30 jours)"
            body_html = f"""
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1A365D;">Bonjour l'équipe de {name},</h2>
                <p>Nous avons remarqué votre excellente réputation à {city} (Note Google ⭐ <strong>{lead.get('rating', '4.8')}</strong>) et l'absence d'un site web dédié.</p>
                <p>Pour vous aider à attirer de nouveaux clients, notre IA a créé un site web sur-mesure pour vous :</p>

                <div style="background: #f4f6f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3182ce;">
                    <p style="margin: 0 0 10px 0;">🌐 <strong>Aperçu du site :</strong> <a href="{site_url}" style="color: #3182ce; font-weight: bold;">{site_url}</a></p>
                    <p style="margin: 0 0 10px 0;">🔑 <strong>Espace d'administration :</strong> <a href="{admin_url}">{admin_url}</a></p>
                    <p style="margin: 0;">🔒 <strong>Mot de passe admin :</strong> <code>{admin_pass}</code></p>
                </div>

                <p><strong>30 jours d'essai 100% gratuit</strong> sans aucun engagement.</p>
                <p>Si le site vous plaît : <strong>CHF {PRICE_FIRST_YEAR}</strong> pour la 1ère année, puis <strong>CHF {PRICE_RENEWAL}/an</strong>.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
                <p style="font-size: 12px; color: #888;">Envoyé par {FROM_NAME}</p>
            </div>
            """
        else:
            # 德语 (默认)
            subject = f"Eine neue Website für {name} (30 Tage kostenlos testen)"
            body_html = f"""
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1A365D;">Grüezi Team {name},</h2>
                <p>wir haben Ihre hervorragenden Bewertungen in {city} (Google Note ⭐ <strong>{lead.get('rating', '4.8')}</strong>) bemerkt.</p>
                <p>Um Ihre Online-Präsenz zu stärken, haben wir für Sie eine moderne Website erstellt:</p>

                <div style="background: #f4f6f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3182ce;">
                    <p style="margin: 0 0 10px 0;">🌐 <strong>Ihre neue Website:</strong> <a href="{site_url}" style="color: #3182ce; font-weight: bold;">{site_url}</a></p>
                    <p style="margin: 0 0 10px 0;">🔑 <strong>Admin-Zugang:</strong> <a href="{admin_url}">{admin_url}</a></p>
                    <p style="margin: 0;">🔒 <strong>Passwort:</strong> <code>{admin_pass}</code></p>
                </div>

                <p>Sie können die Website <strong>30 Tage lang völlig kostenlos und unverbindlich testen</strong>.</p>
                <p>Paketpreis: <strong>CHF {PRICE_FIRST_YEAR}</strong> im 1. Jahr, danach nur <strong>CHF {PRICE_RENEWAL}/Jahr</strong>.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
                <p style="font-size: 12px; color: #888;">Gesendet von {FROM_NAME}</p>
            </div>
            """

        return subject, body_html

    def send(self, lead: dict, deploy_result: dict, auto_send: bool = False) -> bool:
        """
        保存草稿至数据库。
        auto_send: 默认 False（不自动外发，仅存数据库供 Admin 审核）
        """
        subject, body_html = self._generate_template(lead, deploy_result)
        lead_id = lead["id"]

        # 无论是否真实外发，先把邮件草稿和状态存储在数据库 CRM 中！
        log_email(lead_id, "outreach_draft", subject, body_html)
        update_lead(lead_id, status="ready_for_review")

        print(f"   ✉️  [CRM 记录] 邮件草稿已生成并存入数据库 (未真实发送)")
        print(f"      主题: {subject}")

        if auto_send and RESEND_API_KEY:
            import requests
            try:
                r = requests.post(
                    "https://api.resend.com/emails",
                    headers={
                        "Authorization": f"Bearer {RESEND_API_KEY}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "from": f"{FROM_NAME} <{FROM_EMAIL}>",
                        "to": [lead["email"]],
                        "subject": subject,
                        "html": body_html,
                    },
                    timeout=10,
                )
                r.raise_for_status()
                update_lead(lead_id, status="emailed")
                print(f"   ✅ [Resend] 真实邮件已外发至 {lead['email']}")
                return True
            except Exception as e:
                print(f"   ❌ 发送失败: {e}")
                return False

        return True

    def send_followup(self, lead: dict, deploy_result: dict, auto_send: bool = False) -> bool:
        """跟进邮件草稿"""
        lang = lead.get("language", "de")
        site_url = deploy_result["subdomain_url"]

        if lang == "fr":
            subject = f"Rappel : Votre site web {lead['name']} est toujours disponible"
            body = f"<p>Bonjour, votre site est toujours accessible sur <a href='{site_url}'>{site_url}</a>.</p>"
        else:
            subject = f"Erinnerung: Ihre Website {lead['name']} ist aktiv"
            body = f"<p>Grüezi, Ihre Website ist weiterhin erreichbar unter <a href='{site_url}'>{site_url}</a>.</p>"

        log_email(lead["id"], "followup_draft", subject, body)
        print(f"   ✉️  [CRM 记录] 跟进邮件草稿已存库")
        return True
