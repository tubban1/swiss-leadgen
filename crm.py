"""
CRM 数据库 — 自动适配 Neon PostgreSQL / SQLite
严格管理 Multi-Agent 流水线的 5 个中间态与完整数据结构：
1. LeadDiscovery: place_id, name, address, city, canton, language, rating...
2. LeadEnrichment: email, phone, website_hint, reviews_data, opening_hours, services_data
3. SiteBuilder: slug, subdomain, admin_pass, site_config (Awwwards 站姿与双语配置)
4. VercelAgent: vercel_status, dns_verification (从 Vercel API 提取的动态凭证 Value)
5. GoDaddyAgent: godaddy_status, is_published, status, expires_at
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
    """初始化数据库表并执行 Schema Migration 补全 Multi-Agent 所有中间态字段"""
    conn = db.get_connection()
    if db.is_postgres:
        with conn.cursor() as cur:
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
                    
                    -- Lead Enrichment Agent 产出的中间态
                    email            VARCHAR(255),
                    phone            VARCHAR(100),
                    website_hint     TEXT,
                    rating           NUMERIC(3, 2),
                    review_count     INT,
                    google_maps_url  TEXT,
                    reviews_data     TEXT,
                    opening_hours    TEXT,
                    services_data    TEXT,
                    
                    -- Site Builder Agent 产出的中间态
                    slug             VARCHAR(255) UNIQUE,
                    subdomain        VARCHAR(255) UNIQUE,
                    admin_pass       VARCHAR(100),
                    site_config      TEXT,
                    
                    -- Vercel Agent & GoDaddy Agent 产出的网络中间态
                    dns_verification TEXT,
                    vercel_status    VARCHAR(50) DEFAULT 'unmounted',
                    godaddy_status   VARCHAR(50) DEFAULT 'unconfigured',
                    is_published     BOOLEAN DEFAULT TRUE,
                    
                    status           VARCHAR(50) DEFAULT 'discovered',
                    
                    email_sent_at    TIMESTAMP,
                    followup_sent_at TIMESTAMP,
                    paid_at          TIMESTAMP,
                    expires_at       TIMESTAMP,
                    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );

                -- 自动 Schema Migration 补全列
                ALTER TABLE leads ADD COLUMN IF NOT EXISTS reviews_data TEXT;
                ALTER TABLE leads ADD COLUMN IF NOT EXISTS opening_hours TEXT;
                ALTER TABLE leads ADD COLUMN IF NOT EXISTS services_data TEXT;
                ALTER TABLE leads ADD COLUMN IF NOT EXISTS dns_verification TEXT;
                ALTER TABLE leads ADD COLUMN IF NOT EXISTS vercel_status VARCHAR(50) DEFAULT 'unmounted';
                ALTER TABLE leads ADD COLUMN IF NOT EXISTS godaddy_status VARCHAR(50) DEFAULT 'unconfigured';

                CREATE TABLE IF NOT EXISTS email_log (
                    id          VARCHAR(64) PRIMARY KEY,
                    lead_id     VARCHAR(64) REFERENCES leads(id),
                    type        VARCHAR(50),
                    subject     TEXT,
                    body_html   TEXT,
                    sent_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    opened      INT DEFAULT 0
                );
            """)
            conn.commit()
            print("✅ CRM 数据库初始化与 Full Schema Migration 成功 [Neon PostgreSQL: 所有 Multi-Agent 中间态字段就绪]")
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
                
                email            TEXT,
                phone            TEXT,
                website_hint     TEXT,
                rating           REAL,
                review_count     INTEGER,
                google_maps_url  TEXT,
                reviews_data     TEXT,
                opening_hours    TEXT,
                services_data    TEXT,
                
                slug             TEXT UNIQUE,
                subdomain        TEXT UNIQUE,
                admin_pass       TEXT,
                site_config      TEXT,
                
                dns_verification TEXT,
                vercel_status    TEXT DEFAULT 'unmounted',
                godaddy_status   TEXT DEFAULT 'unconfigured',
                is_published     INTEGER DEFAULT 1,
                
                status           TEXT DEFAULT 'discovered',
                
                email_sent_at    DATETIME,
                followup_sent_at DATETIME,
                paid_at          DATETIME,
                expires_at       DATETIME,
                created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS email_log (
                id          TEXT PRIMARY KEY,
                lead_id     TEXT REFERENCES leads(id),
                type        TEXT,
                subject     TEXT,
                body_html   TEXT,
                sent_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
                opened      INTEGER DEFAULT 0
            );
        """)
        conn.commit()
        print(f"✅ CRM 数据库初始化成功 [SQLite: {DB_PATH}]")
    conn.close()


def _row_to_dict(row, cursor=None):
    if row is None:
        return None
    if isinstance(row, dict):
        d = row
    elif hasattr(row, 'keys'): # SQLite Row
        d = dict(row)
    elif cursor and hasattr(cursor, 'description'):
        colnames = [desc[0] for desc in cursor.description]
        d = dict(zip(colnames, row))
    else:
        d = dict(row)

    # 自动解析 JSON 字符串
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
    # 防重复
    if lead_exists(data.get("place_id", "")):
        conn = db.get_connection()
        if db.is_postgres:
            with conn.cursor() as cur:
                cur.execute("SELECT id FROM leads WHERE place_id=%s", (data["place_id"],))
                lead_id = cur.fetchone()[0]
        else:
            lead_id = conn.execute("SELECT id FROM leads WHERE place_id=?", (data["place_id"],)).fetchone()[0]
        conn.close()
        return lead_id

    lead_id = str(uuid.uuid4())
    conn = db.get_connection()
    full_data = {**data, "id": lead_id}
    
    if db.is_postgres:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO leads (id, place_id, name, category, address, city,
                    canton, language, email, phone, website_hint, rating, review_count,
                    google_maps_url, slug, status)
                VALUES (%(id)s, %(place_id)s, %(name)s, %(category)s, %(address)s, %(city)s,
                    %(canton)s, %(language)s, %(email)s, %(phone)s, %(website_hint)s, %(rating)s, %(review_count)s,
                    %(google_maps_url)s, %(slug)s, 'discovered')
            """, full_data)
            conn.commit()
    else:
        conn.execute("""
            INSERT INTO leads (id, place_id, name, category, address, city,
                canton, language, email, phone, website_hint, rating, review_count,
                google_maps_url, slug, status)
            VALUES (:id, :place_id, :name, :category, :address, :city,
                :canton, :language, :email, :phone, :website_hint, :rating, :review_count,
                :google_maps_url, :slug, 'discovered')
        """, full_data)
        conn.commit()
    conn.close()
    return lead_id


def update_lead(lead_id: str, **kwargs):
    kwargs["updated_at"] = datetime.utcnow().isoformat()

    json_fields = ["site_config", "dns_verification", "reviews_data", "opening_hours", "services_data"]
    for field in json_fields:
        if field in kwargs and isinstance(kwargs[field], (dict, list)):
            kwargs[field] = json.dumps(kwargs[field], ensure_ascii=False)

    if db.is_postgres and "is_published" in kwargs:
        kwargs["is_published"] = bool(kwargs["is_published"])

    conn = db.get_connection()
    if db.is_postgres:
        fields = ", ".join(f"{k}=%({k})s" for k in kwargs)
        with conn.cursor() as cur:
            cur.execute(f"UPDATE leads SET {fields} WHERE id=%(_id)s", {**kwargs, "_id": lead_id})
            conn.commit()
    else:
        fields = ", ".join(f"{k}=:{k}" for k in kwargs)
        conn.execute(f"UPDATE leads SET {fields} WHERE id=:_id", {**kwargs, "_id": lead_id})
        conn.commit()
    conn.close()


def get_lead_by_id(lead_id: str) -> dict | None:
    conn = db.get_connection()
    if db.is_postgres:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM leads WHERE id=%s", (lead_id,))
            row = cur.fetchone()
            result = _row_to_dict(row, cur)
    else:
        row = conn.execute("SELECT * FROM leads WHERE id=?", (lead_id,)).fetchone()
        result = _row_to_dict(row)
    conn.close()
    return result


def get_lead_by_subdomain(subdomain: str) -> dict | None:
    conn = db.get_connection()
    if db.is_postgres:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM leads WHERE subdomain=%s AND is_published=TRUE", (subdomain,))
            row = cur.fetchone()
            result = _row_to_dict(row, cur)
    else:
        row = conn.execute("SELECT * FROM leads WHERE subdomain=? AND is_published=1", (subdomain,)).fetchone()
        result = _row_to_dict(row)
    conn.close()
    return result


def get_all_leads() -> list:
    conn = db.get_connection()
    if db.is_postgres:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM leads ORDER BY created_at DESC")
            rows = cur.fetchall()
            results = [_row_to_dict(r, cur) for r in rows]
    else:
        rows = conn.execute("SELECT * FROM leads ORDER BY created_at DESC").fetchall()
        results = [_row_to_dict(r) for r in rows]
    conn.close()
    return results


def set_deployed(lead_id: str):
    expires = (datetime.utcnow() + timedelta(days=FREE_TRIAL_DAYS)).isoformat()
    update_lead(lead_id, status="deployed", expires_at=expires, is_published=True if db.is_postgres else 1)


if __name__ == "__main__":
    init_db()
