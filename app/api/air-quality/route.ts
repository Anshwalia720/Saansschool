import { db } from '../../lib/server/db';
const CACHE_MS=15*60*1000;
export async function GET(request: Request) {
  const params=new URL(request.url).searchParams;
  const lat=Number(params.get('lat')); const lon=Number(params.get('lon'));
  if(!Number.isFinite(lat)||!Number.isFinite(lon)||lat < -90||lat>90||lon < -180||lon>180) return Response.json({error:'Valid lat and lon query parameters are required.'},{status:400});
  const key=`${lat.toFixed(2)},${lon.toFixed(2)}`;
  const cached=db.prepare('SELECT payload,fetched_at FROM air_quality_cache WHERE cache_key=?').get(key) as {payload:string;fetched_at:number}|undefined;
  if(cached && Date.now()-cached.fetched_at<CACHE_MS) return Response.json({...JSON.parse(cached.payload),cached:true},{headers:{'Cache-Control':'private, max-age=60'}});
  const upstream=new URL('https://air-quality-api.open-meteo.com/v1/air-quality');
  upstream.search=new URLSearchParams({latitude:String(lat),longitude:String(lon),hourly:'pm2_5,pm10',timezone:'Asia/Kolkata',past_days:'30',forecast_days:'3'}).toString();
  try {
    const response=await fetch(upstream,{signal:AbortSignal.timeout(12000),cache:'no-store'});
    if(!response.ok) throw new Error(`Air quality source returned ${response.status}.`);
    const data=await response.json() as {hourly?:{time?:unknown[];pm2_5?:unknown[];pm10?:unknown[]};error?:boolean;reason?:string};
    if(data.error||!Array.isArray(data.hourly?.time)||!Array.isArray(data.hourly?.pm2_5)||!Array.isArray(data.hourly?.pm10)) throw new Error(data.reason||'The air quality source returned incomplete data.');
    const payload={hourly:{time:data.hourly.time,pm2_5:data.hourly.pm2_5,pm10:data.hourly.pm10},fetchedAt:Date.now()};
    db.prepare('INSERT INTO air_quality_cache(cache_key,payload,fetched_at) VALUES(?,?,?) ON CONFLICT(cache_key) DO UPDATE SET payload=excluded.payload,fetched_at=excluded.fetched_at').run(key,JSON.stringify(payload),payload.fetchedAt);
    return Response.json({...payload,cached:false},{headers:{'Cache-Control':'private, max-age=60'}});
  } catch(error) {
    if(cached) return Response.json({...JSON.parse(cached.payload),cached:true,stale:true});
    return Response.json({error:error instanceof Error?error.message:'Unable to fetch air quality data.'},{status:502});
  }
}
