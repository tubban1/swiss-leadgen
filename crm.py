"""
CRM 数据库 — 自动适配 Neon PostgreSQL / SQLite
多表解耦架构 (Relational Enterprise Schema):
1. leads (主表): place_id, name, address, city, status...
2. lead_enrichments (1:1 富化数据表): reviews_data, phone, email, opening_hours...
3. site_configs (1:1 站点建站配置表): slug, subdomain, admin_pass, site_config JSON
4. deployments (1:N 网络部署与 DNS 凭证表): vercel_status, dns_verification TXT Value, godaddy_status, expires_at
5. email_log (1:N 营销邮件日志表)
"""
import sqlite3
import json
import uuid
from datetime import datetime, timedelta
from pathlib import Path
from config import DATABASE_URL, FREE_TRIAL_DAYS

try:
    import psycopg2
    import psycopg2.extras
    HAS_POSTGRES = True
except ImportError:
    HAS_POSTGRES = False

DB_PATH = Path(__file__).parent / "crm.db"


class DatabaseWrapper:
    def __init__(self):
        self.is_postgres = bool(DATABASE_URL and HAS_POSTGRES)

    def get_connection(self):
        if self.is_postgres:
            conn = psycopg2.connect(DATABASE_URL)
            return conn
        else:
            conn = sqlite3.connect(DB_PATH)
            conn.row_factory = sqlite3.Row
            return conn


db = DatabaseWrapper()


def init_db():
    """初始化多表关系型数据库架构并自动完成全量解耦数据 Migration 填充"""
    conn = db.get_connection()
    if db.is_postgres:
        with conn.cursor() as cur:
            # 1. 核心 Lead 主表
            cur.execute("""
                CREATE TABLE IF NOT EXISTS leads (
                    id               VARCHAR(64) PRIMARY KEY,
                    place_id         VARCHAR(255) UNIQUE,
                    name             TEXT NOT NULL,
                    category         VARCHAR(100),
                    address          TEXT,
                    city             VARCHAR(100),
                    canton           VARCHAR(10),
                    language         VARCHAR(10),
                    status           VARCHAR(50) DEFAULT 'discovered',
                    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)

            # 2. 富化数据表 (Lead Enrichment)
            cur.execute("""
                CREATE TABLE IF NOT EXISTS lead_enrichments (
                    lead_id          VARCHAR(64) PRIMARY KEY REFERENCES leads(id) ON DELETE CASCADE,
                    email            VARCHAR(255),
                    phone            VARCHAR(100),
                    website_hint     TEXT,
                    rating           NUMERIC(3, 2),
                    review_count     INT,
                    google_maps_url  TEXT,
                    reviews_data     TEXT,
                    opening_hours    TEXT,
                    services_data    TEXT,
                    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)

            # 3. 站点建站配置表 (Site Builder Config)
            cur.execute("""
                CREATE TABLE IF NOT EXISTS site_configs (
                    lead_id          VARCHAR(64) PRIMARY KEY REFERENCES leads(id) ON DELETE CASCADE,
                    slug             VARCHAR(255) UNIQUE,
                    subdomain        VARCHAR(255) UNIQUE,
                    admin_pass       VARCHAR(100),
                    site_config      TEXT,
                    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)

            # 4. 网络部署与 DNS 凭证表 (Deployments & DNS Verifications)
            cur.execute("""
                CREATE TABLE IF NOT EXISTS deployments (
                    id               VARCHAR(64) PRIMARY KEY,
                    lead_id          VARCHAR(64) REFERENCES leads(id) ON DELETE CASCADE,
                    subdomain        VARCHAR(255),
                    dns_verification TEXT,
                    vercel_status    VARCHAR(50) DEFAULT 'unmounted',
                    godaddy_status   VARCHAR(50) DEFAULT 'unconfigured',
                    is_published     BOOLEAN DEFAULT TRUE,
                    expires_at       TIMESTAMP,
                    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)

            # 5. 邮件日志表
            cur.execute("""
                CREATE TABLE IF NOT EXISTS email_log (
                    id          VARCHAR(64) PRIMARY KEY REFERENCES leads(id) ON DELETE CASCADE,
                    lead_id     VARCHAR(64),
                    type        VARCHAR(50),
                    subject     TEXT,
                    body_html   TEXT,
                    sent_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    opened      INT DEFAULT 0
                );
            """)

            # 视图 View: 聚合 4 表
            cur.execute("""
                CREATE OR REPLACE VIEW v_leads_full AS
                SELECT 
                    l.id, l.place_id, l.name, l.category, l.address, l.city, l.canton, l.language, l.status, l.created_at,
                    e.email, e.phone, e.website_hint, e.rating, e.review_count, e.google_maps_url, e.reviews_data, e.opening_hours, e.services_data,
                    s.slug, s.subdomain, s.admin_pass, s.site_config,
                    d.dns_verification, d.vercel_status, d.godaddy_status, d.is_published, d.expires_at
                FROM leads l
                LEFT JOIN lead_enrichments e ON l.id = e.lead_id
                LEFT JOIN site_configs s ON l.id = s.lead_id
                LEFT JOIN deployments d ON l.id = d.lead_id;
            """)
            conn.commit()

            # 自动全量迁移补全子表记录 (自动匹配旧列)
            cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name='leads';")
            cols = [r[0] for r in cur.fetchall()]
            if 'slug' in cols and 'subdomain' in cols:
                cur.execute("""
                    INSERT INTO site_configs (lead_id, slug, subdomain, admin_pass, site_config)
                    SELECT id, slug, subdomain, admin_pass, site_config FROM leads WHERE slug IS NOT NULL
                    ON CONFLICT (lead_id) DO UPDATE SET 
                        slug = EXCLUDED.slug, 
                        subdomain = EXCLUDED.subdomain,
                        site_config = COALESCE(site_configs.site_config, EXCLUDED.site_config);

                    INSERT INTO lead_enrichments (lead_id, email, phone, website_hint, rating, review_count, google_maps_url, reviews_data)
                    SELECT id, email, phone, website_hint, rating, review_count, google_maps_url, reviews_data FROM leads
                    ON CONFLICT (lead_id) DO UPDATE SET email = EXCLUDED.email;

                    INSERT INTO deployments (id, lead_id, subdomain, dns_verification)
                    SELECT md5(id || 'deploy')::varchar(64), id, subdomain, dns_verification FROM leads WHERE subdomain IS NOT NULL
                    ON CONFLICT (id) DO NOTHING;
                """)
                conn.commit()
            print("✅ CRM 数据库解耦多表 Migration 与数据无缝整合成功 [Neon PostgreSQL]")
    else:
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS leads (
                id               TEXT PRIMARY KEY,
                place_id         TEXT UNIQUE,
                name             TEXT NOT NULL,
                category         TEXT,
                address          TEXT,
                city             TEXT,
                canton           TEXT,
                language         TEXT,
                status           TEXT DEFAULT 'discovered',
                created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS lead_enrichments (
                lead_id          TEXT PRIMARY KEY REFERENCES leads(id),
                email            TEXT,
                phone            TEXT,
                website_hint     TEXT,
                rating           REAL,
                review_count     INTEGER,
                google_maps_url  TEXT,
                reviews_data     TEXT,
                opening_hours    TEXT,
                services_data    TEXT,
                updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS site_configs (
                lead_id          TEXT PRIMARY KEY REFERENCES leads(id),
                slug             TEXT UNIQUE,
                subdomain        TEXT UNIQUE,
                admin_pass       TEXT,
                site_config      TEXT,
                updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS deployments (
                id               TEXT PRIMARY KEY,
                lead_id          TEXT REFERENCES leads(id),
                subdomain        TEXT,
                dns_verification TEXT,
                vercel_status    TEXT DEFAULT 'unmounted',
                godaddy_status   TEXT DEFAULT 'unconfigured',
                is_published     INTEGER DEFAULT 1,
                expires_at       DATETIME,
                created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        """)
        conn.commit()
        print(f"✅ CRM 数据库解耦多表初始化成功 [SQLite: {DB_PATH}]")
    conn.close()


def _row_to_dict(row, cursor=None):
    if row is None:
        return None
    if isinstance(row, dict):
        d = row
    elif hasattr(row, 'keys'):
        d = dict(row)
    elif cursor and hasattr(cursor, 'description'):
        colnames = [desc[0] for desc in cursor.description]
        d = dict(zip(colnames, row))
    else:
        d = dict(row)

    json_fields = ["site_config", "dns_verification", "reviews_data", "opening_hours", "services_data"]
    for field in json_fields:
        if d.get(field) and isinstance(d[field], str):
            try:
                d[field] = json.loads(d[field])
            except Exception:
                pass

    return d


def lead_exists(place_id: str) -> bool:
    conn = db.get_connection()
    if db.is_postgres:
        with conn.cursor() as cur:
            cur.execute("SELECT 1 FROM leads WHERE place_id=%s", (place_id,))
            exists = cur.fetchone() is not None
    else:
        exists = conn.execute("SELECT 1 FROM leads WHERE place_id=?", (place_id,)).fetchone() is not None
    conn.close()
    return exists


def insert_lead(data: dict) -> str:
    """插入 Lead 并同步分流写入 4 大解耦表"""
    place_id = data.get("place_id", "")
    if lead_exists(place_id):
        conn = db.get_connection()
        if db.is_postgres:
            with conn.cursor() as cur:
                cur.execute("SELECT id FROM leads WHERE place_id=%s", (place_id,))
                lead_id = cur.fetchone()[0]
        else:
            lead_id = conn.execute("SELECT id FROM leads WHERE place_id=?", (place_id,)).fetchone()[0]
        conn.close()
        return lead_id

    lead_id = str(uuid.uuid4())
    conn = db.get_connection()
    
    if db.is_postgres:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO leads (id, place_id, name, category, address, city, canton, language, status)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 'discovered')
            """, (lead_id, place_id, data.get("name"), data.get("category"), data.get("address"),
                  data.get("city"), data.get("canton"), data.get("language")))
            
            cur.execute("""
                INSERT INTO lead_enrichments (lead_id, email, phone, website_hint, rating, review_count, google_maps_url)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (lead_id) DO NOTHING;
            """, (lead_id, data.get("email"), data.get("phone"), data.get("website_hint"),
                  data.get("rating"), data.get("review_count"), data.get("google_maps_url")))

            cur.execute("""
                INSERT INTO site_configs (lead_id, slug, subdomain, admin_pass)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (lead_id) DO NOTHING;
            """, (lead_id, data.get("slug"), data.get("subdomain"), data.get("admin_pass")))

            cur.execute("""
                INSERT INTO deployments (id, lead_id, subdomain)
                VALUES (%s, %s, %s)
                ON CONFLICT (id) DO NOTHING;
            """, (str(uuid.uuid4()), lead_id, data.get("subdomain")))
            
            conn.commit()
    else:
        conn.execute("""
            INSERT INTO leads (id, place_id, name, category, address, city, canton, language, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'discovered')
        """, (lead_id, place_id, data.get("name"), data.get("category"), data.get("address"),
              data.get("city"), data.get("canton"), data.get("language")))
        
        conn.execute("""
            INSERT INTO lead_enrichments (lead_id, email, phone, website_hint, rating, review_count, google_maps_url)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (lead_id, data.get("email"), data.get("phone"), data.get("website_hint"),
              data.get("rating"), data.get("review_count"), data.get("google_maps_url")))

        conn.execute("""
            INSERT INTO site_configs (lead_id, slug, subdomain, admin_pass)
            VALUES (?, ?, ?, ?)
        """, (lead_id, data.get("slug"), data.get("subdomain"), data.get("admin_pass")))

        conn.execute("""
            INSERT INTO deployments (id, lead_id, subdomain)
            VALUES (?, ?, ?)
        """, (str(uuid.uuid4()), lead_id, data.get("subdomain")))

        conn.commit()
    conn.close()
    return lead_id


def update_lead(lead_id: str, **kwargs):
    """精确分流更新到 4 大专业解耦子表"""
    now_iso = datetime.utcnow().isoformat()
    
    json_fields = ["site_config", "dns_verification", "reviews_data", "opening_hours", "services_data"]
    for field in json_fields:
        if field in kwargs and isinstance(kwargs[field], (dict, list)):
            kwargs[field] = json.dumps(kwargs[field], ensure_ascii=False)

    conn = db.get_connection()
    if db.is_postgres:
        with conn.cursor() as cur:
            # 1. 主表
            lead_fields = {k: v for k, v in kwargs.items() if k in ["name", "category", "address", "city", "canton", "language", "status"]}
            if lead_fields:
                lead_fields["updated_at"] = now_iso
                stmt = ", ".join(f"{k}=%({k})s" for k in lead_fields)
                cur.execute(f"UPDATE leads SET {stmt} WHERE id=%(_id)s", {**lead_fields, "_id": lead_id})

            # 2. 富化表
            enrich_fields = {k: v for k, v in kwargs.items() if k in ["email", "phone", "website_hint", "rating", "review_count", "google_maps_url", "reviews_data", "opening_hours", "services_data"]}
            if enrich_fields:
                enrich_fields["updated_at"] = now_iso
                stmt = ", ".join(f"{k}=%({k})s" for k in enrich_fields)
                cur.execute(f"UPDATE lead_enrichments SET {stmt} WHERE lead_id=%(_id)s", {**enrich_fields, "_id": lead_id})

            # 3. 站点表
            site_fields = {k: v for k, v in kwargs.items() if k in ["slug", "subdomain", "admin_pass", "site_config"]}
            if site_fields:
                site_fields["updated_at"] = now_iso
                stmt = ", ".join(f"{k}=%({k})s" for k in site_fields)
                cur.execute(f"UPDATE site_configs SET {stmt} WHERE lead_id=%(_id)s", {**site_fields, "_id": lead_id})

            # 4. 部署表
            deploy_fields = {k: v for k, v in kwargs.items() if k in ["subdomain", "dns_verification", "vercel_status", "godaddy_status", "is_published", "expires_at"]}
            if deploy_fields:
                deploy_fields["updated_at"] = now_iso
                if "is_published" in deploy_fields:
                    deploy_fields["is_published"] = bool(deploy_fields["is_published"])
                stmt = ", ".join(f"{k}=%({k})s" for k in deploy_fields)
                cur.execute(f"UPDATE deployments SET {stmt} WHERE lead_id=%(_id)s", {**deploy_fields, "_id": lead_id})

            conn.commit()
    else:
        lead_fields = {k: v for k, v in kwargs.items() if k in ["name", "category", "address", "city", "canton", "language", "status"]}
        if lead_fields:
            stmt = ", ".join(f"{k}=:{k}" for k in lead_fields)
            conn.execute(f"UPDATE leads SET {stmt} WHERE id=:_id", {**lead_fields, "_id": lead_id})

        enrich_fields = {k: v for k, v in kwargs.items() if k in ["email", "phone", "website_hint", "rating", "review_count", "google_maps_url", "reviews_data", "opening_hours", "services_data"]}
        if enrich_fields:
            stmt = ", ".join(f"{k}=:{k}" for k in enrich_fields)
            conn.execute(f"UPDATE lead_enrichments SET {stmt} WHERE lead_id=:_id", {**enrich_fields, "_id": lead_id})

        site_fields = {k: v for k, v in kwargs.items() if k in ["slug", "subdomain", "admin_pass", "site_config"]}
        if site_fields:
            stmt = ", ".join(f"{k}=:{k}" for k in site_fields)
            conn.execute(f"UPDATE site_configs SET {stmt} WHERE lead_id=:_id", {**site_fields, "_id": lead_id})

        deploy_fields = {k: v for k, v in kwargs.items() if k in ["subdomain", "dns_verification", "vercel_status", "godaddy_status", "is_published", "expires_at"]}
        if deploy_fields:
            stmt = ", ".join(f"{k}=:{k}" for k in deploy_fields)
            conn.execute(f"UPDATE deployments SET {stmt} WHERE lead_id=:_id", {**deploy_fields, "_id": lead_id})

        conn.commit()
    conn.close()


def get_lead_by_id(lead_id: str) -> dict | None:
    conn = db.get_connection()
    if db.is_postgres:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM v_leads_full WHERE id=%s", (lead_id,))
            row = cur.fetchone()
            result = _row_to_dict(row, cur)
    else:
        query = """
            SELECT l.*, e.email, e.phone, e.website_hint, e.rating, e.review_count, e.google_maps_url, e.reviews_data, e.opening_hours, e.services_data,
                   s.slug, s.subdomain, s.admin_pass, s.site_config,
                   d.dns_verification, d.vercel_status, d.godaddy_status, d.is_published, d.expires_at
            FROM leads l
            LEFT JOIN lead_enrichments e ON l.id = e.lead_id
            LEFT JOIN site_configs s ON l.id = s.lead_id
            LEFT JOIN deployments d ON l.id = d.lead_id
            WHERE l.id=?
        """
        row = conn.execute(query, (lead_id,)).fetchone()
        result = _row_to_dict(row)
    conn.close()
    return result


def get_lead_by_subdomain(subdomain: str) -> dict | None:
    conn = db.get_connection()
    if db.is_postgres:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM v_leads_full WHERE subdomain=%s AND is_published=TRUE", (subdomain,))
            row = cur.fetchone()
            result = _row_to_dict(row, cur)
    else:
        query = """
            SELECT l.*, e.email, e.phone, e.website_hint, e.rating, e.review_count, e.google_maps_url, e.reviews_data, e.opening_hours, e.services_data,
                   s.slug, s.subdomain, s.admin_pass, s.site_config,
                   d.dns_verification, d.vercel_status, d.godaddy_status, d.is_published, d.expires_at
            FROM leads l
            LEFT JOIN lead_enrichments e ON l.id = e.lead_id
            LEFT JOIN site_configs s ON l.id = s.lead_id
            LEFT JOIN deployments d ON l.id = d.lead_id
            WHERE s.subdomain=? AND d.is_published=1
        """
        row = conn.execute(query, (subdomain,)).fetchone()
        result = _row_to_dict(row)
    conn.close()
    return result


def get_all_leads() -> list:
    conn = db.get_connection()
    if db.is_postgres:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM v_leads_full ORDER BY created_at DESC")
            rows = cur.fetchall()
            results = [_row_to_dict(r, cur) for r in rows]
    else:
        query = """
            SELECT l.*, e.email, e.phone, e.website_hint, e.rating, e.review_count, e.google_maps_url, e.reviews_data, e.opening_hours, e.services_data,
                   s.slug, s.subdomain, s.admin_pass, s.site_config,
                   d.dns_verification, d.vercel_status, d.godaddy_status, d.is_published, d.expires_at
            FROM leads l
            LEFT JOIN lead_enrichments e ON l.id = e.lead_id
            LEFT JOIN site_configs s ON l.id = s.lead_id
            LEFT JOIN deployments d ON l.id = d.lead_id
            ORDER BY l.created_at DESC
        """
        rows = conn.execute(query).fetchall()
        results = [_row_to_dict(r) for r in rows]
    conn.close()
    return results


def set_deployed(lead_id: str):
    expires = (datetime.utcnow() + timedelta(days=FREE_TRIAL_DAYS)).isoformat()
    update_lead(lead_id, status="deployed", vercel_status="mounted", godaddy_status="dns_configured", expires_at=expires, is_published=True if db.is_postgres else 1)


if __name__ == "__main__":
    init_db()
