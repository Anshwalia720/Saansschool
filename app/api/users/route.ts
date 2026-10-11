import { demoReadOnlyResponse, publicDemoEnabled } from '../../lib/server/demo-mode';
export async function GET() {
  if (publicDemoEnabled) return demoReadOnlyResponse();
  const [{ currentUser }, { db }] = await Promise.all([import('../../lib/server/auth'), import('../../lib/server/db')]);
  const user=await currentUser(); if(!user) return Response.json({error:'Sign in required.'},{status:401});
  if(user.role==='parent') return Response.json({error:'Staff access required.'},{status:403});
  const users=db.prepare('SELECT id,name,email,role FROM users WHERE school_id=? ORDER BY role,name').all(user.school_id);
  return Response.json({users});
}
export async function POST(request:Request) {
  if (publicDemoEnabled) return demoReadOnlyResponse();
  const [{ currentUser, passwordRecord }, { db }] = await Promise.all([import('../../lib/server/auth'), import('../../lib/server/db')]);
  const actor=await currentUser(); if(!actor) return Response.json({error:'Sign in required.'},{status:401});
  if(actor.role!=='principal') return Response.json({error:'Only a principal can add school users.'},{status:403});
  const body=await request.json().catch(()=>null);
  if(!body||typeof body.name!=='string'||typeof body.email!=='string'||typeof body.password!=='string'||!['teacher','parent'].includes(body.role)||body.password.length<12) return Response.json({error:'Provide a name, email, teacher/parent role, and password of at least 12 characters.'},{status:400});
  const email=body.email.trim().toLowerCase(); if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({error:'Enter a valid email address.'},{status:400});
  const {salt,hash}=passwordRecord(body.password);
  try { const result=db.prepare('INSERT INTO users(school_id,name,email,role,password_salt,password_hash) VALUES(?,?,?,?,?,?)').run(actor.school_id,body.name.trim().slice(0,120),email,body.role,salt,hash); return Response.json({user:{id:Number(result.lastInsertRowid),name:body.name.trim(),email,role:body.role}},{status:201}); }
  catch { return Response.json({error:'Could not create user. That email may already be registered.'},{status:409}); }
}
