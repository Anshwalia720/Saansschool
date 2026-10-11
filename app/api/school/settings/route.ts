import { currentUser } from '../../../lib/server/auth';
import { db } from '../../../lib/server/db';
export async function GET() {
  const user=await currentUser(); if(!user) return Response.json({error:'Sign in required.'},{status:401});
  const school=db.prepare('SELECT id,name,city,lat,lon,language,starts_at as startsAt,ends_at as endsAt,assembly_at as assemblyAt,preferences,updated_at as updatedAt FROM schools WHERE id=?').get(user.school_id) as Record<string,unknown>;
  return Response.json({...school,preferences:JSON.parse(String(school.preferences))});
}
export async function PATCH(request: Request) {
  const user=await currentUser(); if(!user) return Response.json({error:'Sign in required.'},{status:401});
  if(user.role!=='principal') return Response.json({error:'Only a principal can update school settings.'},{status:403});
  const data=await request.json().catch(()=>null); if(!data || typeof data.name!=='string' || typeof data.city!=='string' || typeof data.language!=='string' || !Array.isArray(data.preferences) || !data.preferences.every((x:unknown)=>typeof x==='boolean')) return Response.json({error:'Invalid school settings.'},{status:400});
  const coords=data.coordinates;
  if(!coords || !Number.isFinite(coords.lat) || !Number.isFinite(coords.lon) || coords.lat < -90 || coords.lat > 90 || coords.lon < -180 || coords.lon > 180) return Response.json({error:'Invalid school coordinates.'},{status:400});
  db.prepare('UPDATE schools SET name=?,city=?,lat=?,lon=?,language=?,starts_at=?,ends_at=?,assembly_at=?,preferences=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').run(data.name.slice(0,120),data.city.slice(0,120),coords.lat,coords.lon,data.language.slice(0,40),String(data.startsAt||'08:00'),String(data.endsAt||'14:30'),String(data.assemblyAt||'08:15'),JSON.stringify(data.preferences),user.school_id);
  return Response.json({ok:true});
}
