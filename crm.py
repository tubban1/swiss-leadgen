"""
CRM 数据库 — 自动适配 Neon PostgreSQL / SQLite
管理所有 leads 的生命周期与多租户网站配置 (site_config)
"""
import sqlite3
import json
import uuid
from datetime import datetime, timedelta
from pathlib import Path
from config import DATABASE_URL, FREE_TRIAL_DAYS

# 如果安装了 psycopg2，则导入支持 PostgreSQL
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
    """初始化数据库表 (自动兼容 Postgres & SQLite)"""
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
                    email            VARCHAR(255),
                    phone            VARCHAR(100),
                    website_hint     TEXT,
                    rating           NUMERIC(3, 2),
                    review_count     INT,
                    google_maps_url  TEXT,
                    
                    slug             VARCHAR(255) UNIQUE,
                    subdomain        VARCHAR(255) UNIQUE,
                    admin_pass       VARCHAR(100),
                    site_config      TEXT,
                    is_published     BOOLEAN DEFAULT TRUE,
                    
                    status           VARCHAR(50) DEFAULT 'discovered',
                    
                    email_sent_at    TIMESTAMP,
                    followup_sent_at TIMESTAMP,
                    paid_at          TIMESTAMP,
                    expires_at       TIMESTAMP,
                    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );

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
            print("✅ CRM 数据库初始化成功 [Neon PostgreSQL]")
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
                
                slug             TEXT UNIQUE,
                subdomain        TEXT UNIQUE,
                admin_pass       TEXT,
                site_config      TEXT,
                is_published     BOOLEAN DEFAULT 1,
                
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
        return row
    if hasattr(row, 'keys'): # SQLite Row
        return dict(row)
    if cursor and hasattr(cursor, 'description'):
        colnames = [desc[0] for desc in cursor.description]
        return dict(zip(colnames, row))
    return dict(row)


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
    if "site_config" in kwargs and isinstance(kwargs["site_config"], (dict, list)):
        kwargs["site_config"] = json.dumps(kwargs["site_config"], ensure_ascii=False)

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

    if result and result.get("site_config"):
        if isinstance(result["site_config"], str):
            result["site_config"] = json.loads(result["site_config"])
    return result


def set_deployed(lead_id: str):
    expires = (datetime.utcnow() + timedelta(days=FREE_TRIAL_DAYS)).isoformat()
    update_lead(lead_id, status="deployed", expires_at=expires, is_published=1)


def log_email(lead_id: str, email_type: str, subject: str, body_html: str):
    log_id = str(uuid.uuid4())
    conn = db.get_connection()
    if db.is_postgres:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO email_log (id, lead_id, type, subject, body_html)
                VALUES (%s, %s, %s, %s, %s)
            """, (log_id, lead_id, email_type, subject, body_html))
            conn.commit()
    else:
        conn.execute("""
            INSERT INTO email_log (id, lead_id, type, subject, body_html)
            VALUES (?, ?, ?, ?, ?)
        """, (log_id, lead_id, email_type, subject, body_html))
        conn.commit()
    conn.close()


def get_leads_by_status(status: str) -> list:
    conn = db.get_connection()
    if db.is_postgres:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM leads WHERE status=%s", (status,))
            rows = cur.fetchall()
            results = [_row_to_dict(r, cur) for r in rows]
    else:
        rows = conn.execute("SELECT * FROM leads WHERE status=?", (status,)).fetchall()
        results = [_row_to_dict(r) for r in rows]
    conn.close()
    return results


def get_expired_leads() -> list:
    conn = db.get_connection()
    now_iso = datetime.utcnow().isoformat()
    if db.is_postgres:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT * FROM leads
                WHERE status = 'emailed'
                  AND expires_at < %s
                  AND paid_at IS NULL
            """, (now_iso,))
            rows = cur.fetchall()
            results = [_row_to_dict(r, cur) for r in rows]
    else:
        rows = conn.execute("""
            SELECT * FROM leads
            WHERE status = 'emailed'
              AND expires_at < ?
              AND paid_at IS NULL
        """, (now_iso,)).fetchall()
        results = [_row_to_dict(r) for r in rows]
    conn.close()
    return results


if __name__ == "__main__":
    init_db()
