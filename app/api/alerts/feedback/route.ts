import { currentUser } from '../../../lib/server/auth';
import { db } from '../../../lib/server/db';

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) return Response.json({ error: 'Sign in required.' }, { status: 401 });
  if (user.role !== 'parent') return Response.json({ error: 'Parent access required.' }, { status: 403 });

  const body = await request.json().catch(() => null);
  const alertId = Number(body?.alertId);
  const message = typeof body?.message === 'string' ? body.message.trim() : '';
  if (!Number.isSafeInteger(alertId) || alertId < 1 || message.length < 3 || message.length > 2000) {
    return Response.json({ error: 'Choose an alert and enter feedback between 3 and 2,000 characters.' }, { status: 400 });
  }

  const school = db.prepare('SELECT preferences FROM schools WHERE id=?').get(user.school_id) as { preferences: string } | undefined;
  let enabled = false;
  try { enabled = JSON.parse(school?.preferences || '[]')?.[2] === true; } catch { enabled = false; }
  if (!enabled) return Response.json({ error: 'Parent alert previews and feedback are disabled by the school.' }, { status: 403 });

  const delivered = db.prepare(`SELECT 1 FROM alerts a JOIN alert_deliveries d ON d.alert_id=a.id
    WHERE a.id=? AND a.school_id=? AND d.user_id=? AND d.status='sent'`).get(alertId, user.school_id, user.id);
  if (!delivered) return Response.json({ error: 'This alert is not available for your parent account.' }, { status: 404 });

  db.prepare(`INSERT INTO alert_feedback(alert_id,user_id,message) VALUES(?,?,?)
    ON CONFLICT(alert_id,user_id) DO UPDATE SET message=excluded.message,updated_at=CURRENT_TIMESTAMP`).run(alertId, user.id, message);
  return Response.json({ ok: true, message: 'Your feedback was shared with the school.' });
}
