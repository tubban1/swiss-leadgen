"""
彻底清理 deployments 表中的重复数据，建立 lead_id 与 subdomain 唯一索引约束，并刷新视图
"""
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()
load_dotenv(Path(__file__).parent.parent / '.env')

import psycopg2

def cleanup():
    db_url = os.getenv("DATABASE_URL")
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()

    print("\n" + "="*80)
    print("🧹 [数据库深度去重] 正在清理 deployments 表中的重复记录...")
    print("="*80 + "\n")

    # 1. 查找并删除重复记录，只保留 id 最大 (最新/有效) 的那一条
    cur.execute("""
        DELETE FROM deployments
        WHERE id IN (
            SELECT id
            FROM (
                SELECT id,
                       ROW_NUMBER() OVER (
                           PARTITION BY lead_id 
                           ORDER BY 
                               CASE WHEN vercel_status = 'mounted' THEN 1 ELSE 2 END,
                               created_at DESC
                       ) as rnum
                FROM deployments
            ) t
            WHERE t.rnum > 1
        );
    """)
    deleted_count = cur.rowcount
    print(f"✅ 成功清理 {deleted_count} 条多余的重复 deployment 行！")

    # 2. 为 deployments 表添加 UNIQUE 约束，防止未来出现重复记录
    try:
        cur.execute("""
            ALTER TABLE deployments 
            ADD CONSTRAINT deployments_lead_id_unique UNIQUE (lead_id);
        """)
        print("✅ 成功为 deployments.lead_id 添加 UNIQUE 唯一性约束")
    except Exception as e:
        print(f"ℹ️ 唯一约束已存在或无需重新创建: {e}")
        conn.rollback()

    try:
        cur.execute("""
            ALTER TABLE deployments 
            ADD CONSTRAINT deployments_subdomain_unique UNIQUE (subdomain);
        """)
        print("✅ 成功为 deployments.subdomain 添加 UNIQUE 唯一性约束")
    except Exception as e:
        print(f"ℹ️ 子域名唯一约束已存在: {e}")
        conn.rollback()

    # 3. 重新建立 v_leads_full 视图
    cur.execute("DROP VIEW IF EXISTS v_leads_full CASCADE;")
    cur.execute("""
        CREATE VIEW v_leads_full AS
        SELECT 
            l.id,
            l.place_id,
            l.name,
            l.category,
            l.address,
            l.city,
            l.canton,
            l.language,
            l.status,
            l.slug,
            l.subdomain,
            le.email,
            le.phone,
            le.website_hint,
            le.rating,
            le.review_count,
            le.google_maps_url,
            le.reviews_data,
            le.opening_hours,
            le.services_data,
            sc.admin_pass as admin_pass,
            sc.site_config,
            d.dns_verification,
            d.cname_target,
            d.vercel_status,
            d.godaddy_status,
            d.is_published,
            d.expires_at,
            l.created_at,
            l.updated_at
        FROM leads l
        LEFT JOIN lead_enrichments le ON l.id = le.lead_id
        LEFT JOIN site_configs sc ON l.id = sc.lead_id
        LEFT JOIN deployments d ON l.id = d.lead_id;
    """)
    print("✅ 成功刷新 `v_leads_full` 视图！")

    conn.commit()

    # 4. 打印去重后的唯一完整数据清单
    cur.execute("""
        SELECT d.id, l.name, d.subdomain, d.cname_target, d.vercel_status, d.godaddy_status
        FROM deployments d
        JOIN leads l ON d.lead_id = l.id
        ORDER BY d.created_at DESC;
    """)
    rows = cur.fetchall()
    print(f"\n✨ 去重完成，数据库 deployments 表当前保留 {len(rows)} 条纯净唯一商户记录：\n")
    for r in rows:
        print(f"Deploy ID: {r[0]:<36} | Merchant: {r[1]:<30} | Subdomain: {r[2]:<38} | CNAME: {r[3]}")

    conn.close()

if __name__ == "__main__":
    cleanup()
