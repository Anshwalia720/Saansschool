import { demoReadOnlyResponse, publicDemoEnabled } from '../../lib/server/demo-mode';

function escapeHtml(value: unknown, maxLength = 1000) {
  const text = typeof value === 'string' || typeof value === 'number' ? String(value).slice(0, maxLength) : '';
  return text.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character] ?? character);
}

function renderTomorrowPlanEmail(recipientName: string, rawPlan: unknown) {
  if (!rawPlan || typeof rawPlan !== 'object') return undefined;
  const plan = rawPlan as Record<string, unknown>;
  const activities = Array.isArray(plan.activities) ? plan.activities.slice(0, 30) : [];
  const preferences = Array.isArray(plan.preferences) ? plan.preferences.slice(0, 12) : [];
  const activityCards = activities.map((rawActivity) => {
    const item = rawActivity && typeof rawActivity === 'object' ? rawActivity as Record<string, unknown> : {};
    return `<tr><td style="padding:0 0 12px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fffdf8;border:1px solid #e8e0d1;border-radius:14px"><tr><td width="54" valign="top" style="padding:18px 0 18px 18px;font-size:23px;color:#a66008">${escapeHtml(item.icon, 4)}</td><td style="padding:18px 18px 18px 8px"><div style="font-size:17px;font-weight:700;color:#191947">${escapeHtml(item.title, 100)} <span style="display:inline-block;margin-left:6px;padding:5px 10px;border-radius:20px;background:#fff0c7;color:#925500;font-size:12px;font-weight:700">${escapeHtml(item.status, 100)}</span></div><p style="margin:10px 0;color:#65738b;font-size:14px;line-height:1.6">${escapeHtml(item.reason, 500)}</p><div style="font-size:12px;color:#718096">◉ &nbsp;${escapeHtml(item.detail, 180)}</div></td></tr></table></td></tr>`;
  }).join('');
  const preferenceRows = preferences.map((rawPreference) => {
    const item = rawPreference && typeof rawPreference === 'object' ? rawPreference as Record<string, unknown> : {};
    return `<li style="padding:3px 0;color:#65738b">${escapeHtml(item.label, 100)}: <b>${item.enabled === true ? 'Enabled' : 'Disabled'}</b></li>`;
  }).join('');
  const date = escapeHtml(plan.date, 120);
  const aqi = plan.aqi === null || plan.aqi === undefined ? 'Unavailable' : escapeHtml(plan.aqi, 20);
  const tomorrowAqi = plan.tomorrowAqi === null || plan.tomorrowAqi === undefined ? 'Unavailable' : escapeHtml(plan.tomorrowAqi, 20);
  const category = escapeHtml(plan.category, 40);
  const guidance = escapeHtml(plan.guidance, 100);
  return `<!doctype html><html><body style="margin:0;padding:0;background:#f3f0e8;font-family:Arial,Helvetica,sans-serif;color:#191947"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f0e8;padding:24px 10px"><tr><td align="center"><table role="presentation" width="760" cellspacing="0" cellpadding="0" style="width:100%;max-width:760px"><tr><td style="padding:4px 0 18px;font-size:18px;font-weight:800;color:#202052">🟠 SaansSchool <span style="font-weight:400;color:#68758b">· Tomorrow’s plan</span></td></tr><tr><td style="padding:28px 30px;background:#191947;border-radius:24px;color:white"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td width="86" valign="middle"><div style="width:72px;padding:12px 4px;border-radius:18px;background:#fff;color:#191947;text-align:center;font-weight:700;font-size:13px">${escapeHtml(plan.weekday, 12)}<b style="display:block;font-size:30px;line-height:1.2">${escapeHtml(plan.day, 3)}</b>${escapeHtml(plan.month, 12)}</div></td><td style="padding-left:18px"><span style="display:inline-block;padding:7px 12px;border-radius:20px;background:#fff0c7;color:#895400;font-size:12px;font-weight:800">AQI USED FOR PLAN · ${aqi}</span><h1 style="margin:14px 0 6px;font-size:27px;line-height:1.2;color:#fff">Small changes, thoughtful care.</h1><p style="margin:0;color:#d4d8f2;font-size:14px;line-height:1.5">${date} · ${escapeHtml(plan.city, 120)}<br>${escapeHtml(plan.schoolName, 120)} · ${category} · ${guidance}<br>Tomorrow model forecast AQI: ${tomorrowAqi}</p></td></tr></table></td></tr><tr><td style="padding:18px 0 10px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fffdf8;border:1px solid #e8e0d1;border-radius:14px"><tr><td style="padding:18px"><b style="font-size:16px">School schedule</b><p style="margin:9px 0 0;color:#65738b;font-size:14px;line-height:1.7">School hours: ${escapeHtml(plan.startsAt, 20)}–${escapeHtml(plan.endsAt, 20)}<br>Morning assembly: ${escapeHtml(plan.assemblyAt, 20)}</p></td></tr></table></td></tr><tr><td style="padding:4px 0 6px;font-size:18px;font-weight:800">Tomorrow’s activity plan</td></tr>${activityCards || '<tr><td>No activities are available.</td></tr>'}<tr><td style="padding:6px 0 14px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fffdf8;border:1px solid #e8e0d1;border-radius:14px"><tr><td style="padding:16px"><b>School safety preferences</b><ul style="margin:8px 0 0;padding-left:20px;font-size:13px">${preferenceRows || '<li>Not provided</li>'}</ul></td></tr></table></td></tr><tr><td style="padding:6px 4px 22px;color:#68758b;font-size:12px;line-height:1.6">Forecast source: Open-Meteo / Copernicus CAMS regional model estimate, not an official advisory. Please confirm local conditions before acting. This is general planning information, not medical advice.</td></tr><tr><td style="border-top:1px solid #d9ddd9;padding:16px 4px;color:#68758b;font-size:13px">Sent to ${escapeHtml(recipientName, 120)} by SaansSchool.</td></tr></table></td></tr></table></body></html>`;
}

export async function GET() {
  if (publicDemoEnabled) return demoReadOnlyResponse();
  const [{ currentUser }, { db }] = await Promise.all([import('../../lib/server/auth'), import('../../lib/server/db')]);
  const user=await currentUser(); if(!user) return Response.json({error:'Sign in required.'},{status:401});
  if(user.role==='parent') {
    const school=db.prepare('SELECT preferences FROM schools WHERE id=?').get(user.school_id) as {preferences:string}|undefined;
    let enabled=false;
    try { enabled=JSON.parse(school?.preferences||'[]')?.[2]===true; } catch { enabled=false; }
    if(!enabled) return Response.json({alerts:[],previewsEnabled:false});
    const alerts=db.prepare(`SELECT a.id,a.subject,a.message,a.created_at as createdAt,d.status,
      f.message as feedback,f.updated_at as feedbackUpdatedAt
      FROM alerts a JOIN alert_deliveries d ON d.alert_id=a.id
      LEFT JOIN alert_feedback f ON f.alert_id=a.id AND f.user_id=d.user_id
      WHERE a.school_id=? AND d.user_id=? AND d.status='sent'
      ORDER BY a.id DESC`).all(user.school_id,user.id);
    return Response.json({alerts,previewsEnabled:true});
  }
  const alerts=db.prepare('SELECT a.id,a.subject,a.message,a.channel,a.status,a.created_at as createdAt,COUNT(d.id) as recipients FROM alerts a LEFT JOIN alert_deliveries d ON d.alert_id=a.id WHERE a.school_id=? GROUP BY a.id ORDER BY a.id DESC').all(user.school_id) as {id:number;[key:string]:unknown}[];
  const feedback=db.prepare(`SELECT f.alert_id as alertId,u.name as parentName,u.email as parentEmail,f.message,f.updated_at as updatedAt
    FROM alert_feedback f JOIN users u ON u.id=f.user_id WHERE u.school_id=? ORDER BY f.updated_at DESC`).all(user.school_id) as {alertId:number;parentName:string;parentEmail:string;message:string;updatedAt:string}[];
  const feedbackByAlert=new Map<number,typeof feedback>();
  for(const item of feedback) feedbackByAlert.set(item.alertId,[...(feedbackByAlert.get(item.alertId)||[]),item]);
  return Response.json({alerts:alerts.map(alert=>({...alert,feedback:feedbackByAlert.get(alert.id)||[]}))});
}
export async function POST(request:Request) {
  if (publicDemoEnabled) return demoReadOnlyResponse();
  const [{ currentUser }, { db }] = await Promise.all([import('../../lib/server/auth'), import('../../lib/server/db')]);
  const user=await currentUser(); if(!user) return Response.json({error:'Sign in required.'},{status:401});
  if(user.role==='parent') return Response.json({error:'Staff access required.'},{status:403});
  const body=await request.json().catch(()=>null);
  if(!body || typeof body.subject!=='string'||typeof body.message!=='string'||!['en','hi'].includes(body.language)||body.subject.trim().length<2||body.message.trim().length<5) return Response.json({error:'Provide a subject, message, and supported language.'},{status:400});
  const parentCount=db.prepare("SELECT COUNT(*) as count FROM users WHERE school_id=? AND role='parent'").get(user.school_id) as {count:number};
  if(parentCount.count===0) return Response.json({error:'No parent email recipients found. Add parent accounts with email addresses in Settings first.'},{status:400});
  const channel='email';
  const saved=(()=>{
    try {
      db.exec('BEGIN IMMEDIATE');
      const inserted=db.prepare('INSERT INTO alerts(school_id,created_by,language,subject,message,channel,status) VALUES(?,?,?,?,?,?,?)').run(user.school_id,user.id,body.language,body.subject.trim().slice(0,160),body.message.trim().slice(0,5000),channel,'queued');
      const id=Number(inserted.lastInsertRowid);
      const parents=db.prepare("SELECT id FROM users WHERE school_id=? AND role='parent'").all(user.school_id) as {id:number}[];
      const add=db.prepare('INSERT INTO alert_deliveries(alert_id,user_id,status) VALUES(?,?,?)');
      for(const parent of parents) add.run(id,parent.id,'queued');
      db.exec('COMMIT');
      return {ok:true as const,id,recipients:parents.length};
    } catch(error) {
      try { db.exec('ROLLBACK'); } catch { /* A failed BEGIN has nothing to roll back. */ }
      console.error('[SaansSchool] Could not save parent alert:',error);
      return {ok:false as const};
    }
  })();
  if(!saved.ok) return Response.json({error:'Could not save the alert. Please retry.'},{status:500});
  const result={id:saved.id,recipients:saved.recipients};
  console.log(`\n========== SAANSSCHOOL PARENT ALERT SUBMITTED ==========\nAlert ID: ${result.id}\nLanguage: ${body.language}\nRecipients: ${result.recipients}\n\nSubject: ${body.subject.trim()}\n\nMessage:\n${body.message.trim()}\n========================================================\n`);
  if(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    const nodemailer = (await import('nodemailer')).default;
    const parents=db.prepare("SELECT d.id as deliveryId,u.email,u.name FROM alert_deliveries d JOIN users u ON u.id=d.user_id WHERE d.alert_id=?").all(result.id) as {deliveryId:number;email:string;name:string}[];
    const transport=nodemailer.createTransport({host:'smtp.gmail.com',port:465,secure:true,auth:{user:process.env.GMAIL_USER,pass:process.env.GMAIL_APP_PASSWORD.replace(/\s+/g,'')}});
    const outcomes=await Promise.all(parents.map(async parent=>{
      try {
        const sent=await transport.sendMail({from:`SaansSchool <${process.env.GMAIL_USER}>`,to:parent.email,subject:body.subject,text:`Hello ${parent.name},\n\n${body.message}\n\nSaansSchool`,html:renderTomorrowPlanEmail(parent.name,body.tomorrowPlan)});
        db.prepare("UPDATE alert_deliveries SET status='sent',sent_at=CURRENT_TIMESTAMP WHERE id=?").run(parent.deliveryId);
        return {ok:true,id:sent.messageId};
      } catch(error) {
        db.prepare("UPDATE alert_deliveries SET status='failed',error=? WHERE id=?").run(error instanceof Error?error.message:'Email delivery failed.',parent.deliveryId);
        return {ok:false};
      }
    }));
    const failed=outcomes.filter(item=>!item.ok).length;
    const providerIds=outcomes.filter(item=>item.ok).map(item=>item.id).join(',').slice(0,500);
    db.prepare('UPDATE alerts SET status=?,provider_id=? WHERE id=?').run(failed===0?'sent':failed===outcomes.length?'failed':'partial',providerIds||null,result.id);
    return Response.json({ok:failed===0,...result,status:failed===0?'sent':failed===outcomes.length?'failed':'partial',message:`Gmail SMTP finished: ${outcomes.length-failed} accepted, ${failed} failed.`},{status:failed===0?201:502});
  }
  return Response.json({ok:true,...result,status:'queued_provider_not_configured',message:'Alert saved to the delivery queue. Configure GMAIL_USER and GMAIL_APP_PASSWORD to send it.'},{status:201});
}
