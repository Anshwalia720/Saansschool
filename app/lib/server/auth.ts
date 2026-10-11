import 'server-only';
import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { db } from './db';

export type Role = 'principal' | 'teacher' | 'parent';
export interface User { id: number; school_id: number; name: string; email: string; role: Role; }
const SESSION_COOKIE = 'saans_session';
const DEMO_PASSWORD = 'SaansDemo123!';

function seed() {
  db.prepare('INSERT OR IGNORE INTO schools(id,name,city,lat,lon) VALUES(1,?,?,?,?)').run('Greenfield Public School','Bengaluru, Karnataka',12.97,77.59);
  const insert = db.prepare('INSERT OR IGNORE INTO users(school_id,name,email,role,password_salt,password_hash) VALUES(1,?,?,?,?,?)');
  const accounts=process.env.NODE_ENV==='production'
    ? (process.env.SAANSSCHOOL_BOOTSTRAP_EMAIL&&process.env.SAANSSCHOOL_BOOTSTRAP_PASSWORD ? [[process.env.SAANSSCHOOL_BOOTSTRAP_NAME||'School Principal',process.env.SAANSSCHOOL_BOOTSTRAP_EMAIL,'principal'] as const] : [])
    : [['Abhinav Ruhela','principal@saansschool.demo','principal'],['Abhinav Ruhela','teacher@saansschool.demo','teacher'],['Abhinav Ruhela','parent@saansschool.demo','parent']] as const;
  for (const [name,email,role] of accounts) {
    const salt = randomBytes(16).toString('hex');
    const password=process.env.NODE_ENV==='production'?process.env.SAANSSCHOOL_BOOTSTRAP_PASSWORD!:DEMO_PASSWORD;
    insert.run(name,email,role,salt,scryptSync(password,salt,64).toString('hex'));
  }
  const nameMigration = 'rename_demo_accounts_abhinav_ruhela_v1';
  if (!db.prepare('SELECT name FROM schema_migrations WHERE name=?').get(nameMigration)) {
    db.prepare("UPDATE users SET name='Abhinav Ruhela' WHERE email IN ('principal@saansschool.demo','teacher@saansschool.demo','parent@saansschool.demo')").run();
    db.prepare('INSERT INTO schema_migrations(name) VALUES(?)').run(nameMigration);
  }
}
seed();

export function verifyPassword(email: string, password: string) {
  const record = db.prepare('SELECT id,school_id,name,email,role,password_salt,password_hash FROM users WHERE email = ?').get(email.toLowerCase()) as (User & {password_salt:string;password_hash:string}) | undefined;
  if (!record) return null;
  const actual = scryptSync(password,record.password_salt,64);
  if (!timingSafeEqual(actual,Buffer.from(record.password_hash,'hex'))) return null;
  return {id:record.id,school_id:record.school_id,name:record.name,email:record.email,role:record.role};
}

export function passwordRecord(password:string) {
  const salt=randomBytes(16).toString('hex');
  return {salt,hash:scryptSync(password,salt,64).toString('hex')};
}

export async function createSession(userId: number) {
  const token = randomBytes(32).toString('hex');
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const expires = Date.now() + 1000 * 60 * 60 * 24 * 7;
  db.prepare('INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)').run(tokenHash,userId,expires);
  (await cookies()).set(SESSION_COOKIE,token,{httpOnly:true,secure:process.env.NODE_ENV === 'production',sameSite:'lax',path:'/',expires:new Date(expires)});
}

export async function currentUser(): Promise<User | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const row = db.prepare('SELECT u.id,u.school_id,u.name,u.email,u.role FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>?').get(tokenHash,Date.now()) as User | undefined;
  return row ?? null;
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) db.prepare('DELETE FROM sessions WHERE token_hash=?').run(createHash('sha256').update(token).digest('hex'));
  jar.delete(SESSION_COOKIE);
}

export function publicUser(user: User) { return {id:user.id,name:user.name,email:user.email,role:user.role,schoolId:user.school_id}; }
