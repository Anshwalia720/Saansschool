import 'server-only';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const path = process.env.SAANSSCHOOL_DB_PATH || join(process.cwd(), '.data', 'saansschool.sqlite');
mkdirSync(dirname(path), { recursive: true });
const db = new DatabaseSync(path);
db.exec('PRAGMA busy_timeout = 10000; PRAGMA foreign_keys = ON;');
db.exec(`
CREATE TABLE IF NOT EXISTS schools (id INTEGER PRIMARY KEY, name TEXT NOT NULL, city TEXT NOT NULL, lat REAL NOT NULL, lon REAL NOT NULL, language TEXT NOT NULL DEFAULT 'English', starts_at TEXT NOT NULL DEFAULT '08:00', ends_at TEXT NOT NULL DEFAULT '14:30', assembly_at TEXT NOT NULL DEFAULT '08:15', preferences TEXT NOT NULL DEFAULT '[true,true,true,true]', updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, school_id INTEGER NOT NULL REFERENCES schools(id), name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, role TEXT NOT NULL CHECK(role IN ('principal','teacher','parent')), password_salt TEXT NOT NULL, password_hash TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS air_quality_cache (cache_key TEXT PRIMARY KEY, payload TEXT NOT NULL, fetched_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS alerts (id INTEGER PRIMARY KEY, school_id INTEGER NOT NULL REFERENCES schools(id), created_by INTEGER NOT NULL REFERENCES users(id), language TEXT NOT NULL, subject TEXT NOT NULL, message TEXT NOT NULL, channel TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'queued', provider_id TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS alert_deliveries (id INTEGER PRIMARY KEY, alert_id INTEGER NOT NULL REFERENCES alerts(id) ON DELETE CASCADE, user_id INTEGER NOT NULL REFERENCES users(id), status TEXT NOT NULL DEFAULT 'queued', sent_at TEXT, error TEXT, UNIQUE(alert_id,user_id));
CREATE TABLE IF NOT EXISTS alert_feedback (id INTEGER PRIMARY KEY, alert_id INTEGER NOT NULL REFERENCES alerts(id) ON DELETE CASCADE, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, message TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE(alert_id,user_id));
CREATE TABLE IF NOT EXISTS schema_migrations (name TEXT PRIMARY KEY, applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);`);

const parentPreviewMigration = 'enable_parent_preview_feedback_v1';
if (!db.prepare('SELECT name FROM schema_migrations WHERE name=?').get(parentPreviewMigration)) {
  const schools = db.prepare('SELECT id,preferences FROM schools').all() as {id:number;preferences:string}[];
  const updatePreferences = db.prepare('UPDATE schools SET preferences=? WHERE id=?');
  for (const school of schools) {
    try {
      const preferences = JSON.parse(school.preferences) as unknown;
      if (Array.isArray(preferences)) {
        while (preferences.length < 4) preferences.push(false);
        preferences[2] = true;
        updatePreferences.run(JSON.stringify(preferences), school.id);
      }
    } catch { /* Leave malformed settings for the settings page to repair. */ }
  }
  db.prepare('INSERT INTO schema_migrations(name) VALUES(?)').run(parentPreviewMigration);
}

export { db };
