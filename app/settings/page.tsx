'use client';
import { useEffect, useState } from 'react';
import { CITIES } from '../lib/cities';
import { useCity } from '../lib/use-city';
import { PageIntro } from '../components/ui';

const preferenceNames=['AQI alert reminders','Weekly air quality summary','Parent alert previews and feedback','Extra care for sensitive students'];
type Settings={name:string;city:string;language:string;startsAt:string;endsAt:string;assemblyAt:string;preferences:boolean[]};
type SchoolUser={id:number;name:string;email:string;role:string};
const defaults:Settings={name:'Greenfield Public School',city:CITIES[0].name,language:'English',startsAt:'08:00',endsAt:'14:30',assemblyAt:'08:15',preferences:[true,true,true,true]};
export default function SettingsPage() {
  const [,setCity]=useCity(); const [settings,setSettings]=useState(defaults); const [saved,setSaved]=useState(''); const [error,setError]=useState(''); const [busy,setBusy]=useState(false);
  const [publicDemo,setPublicDemo]=useState(false); const [modeReady,setModeReady]=useState(false);
  const [users,setUsers]=useState<SchoolUser[]>([]); const [newName,setNewName]=useState(''); const [newEmail,setNewEmail]=useState(''); const [newPassword,setNewPassword]=useState(''); const [newRole,setNewRole]=useState<'teacher'|'parent'>('teacher'); const [userMessage,setUserMessage]=useState(''); const [userError,setUserError]=useState('');
  useEffect(()=>{fetch('/api/auth/me').then(r=>r.json()).then(data=>setPublicDemo(data.demoMode===true)).catch(()=>{}).finally(()=>setModeReady(true));},[]);
  useEffect(()=>{if(!modeReady||publicDemo)return;fetch('/api/school/settings').then(async r=>{if(!r.ok)throw new Error('Could not load school settings.');return r.json();}).then(data=>setSettings({...defaults,...data,preferences:data.preferences})).catch(e=>setError(e.message));},[modeReady,publicDemo]);
  useEffect(()=>{if(!modeReady||publicDemo)return;fetch('/api/users').then(async r=>{const data=await r.json();if(r.ok)setUsers(data.users||[]);else setUserError(data.error||'Could not load school users.');}).catch(()=>setUserError('Could not load school users.'));},[modeReady,publicDemo]);
  const update=(key:keyof Settings,value:Settings[keyof Settings])=>{setSettings(current=>({...current,[key]:value}));setSaved('');};
  const save=async()=>{setBusy(true);setError('');setSaved('');try{const selected=CITIES.find(item=>item.name===settings.city);if(!selected)throw new Error('Choose a supported city.');const r=await fetch('/api/school/settings',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({...settings,coordinates:{lat:selected.lat,lon:selected.lon}})});const data=await r.json();if(!r.ok)throw new Error(data.error||'Unable to save settings.');setCity(settings.city);setSaved('School profile and preferences saved.');}catch(e){setError(e instanceof Error?e.message:'Unable to save settings.');}finally{setBusy(false);}};
  const addUser=async()=>{setUserError('');setUserMessage('');try{const r=await fetch('/api/users',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:newName,email:newEmail,password:newPassword,role:newRole})});const data=await r.json();if(!r.ok)throw new Error(data.error||'Could not create account.');setUsers(current=>[...current,data.user]);setNewName('');setNewEmail('');setNewPassword('');setUserMessage('School account created.');}catch(e){setUserError(e instanceof Error?e.message:'Could not create account.');}};
  if(!modeReady)return <PageIntro title="School settings" text="Loading access mode…"/>;
  if(publicDemo)return <><PageIntro title="School settings" text="This public deployment is a read-only demo. School settings and user records are not loaded."/><div className="note-box" role="status">Settings changes and account management are disabled in public demo mode. To manage a real school, use a private deployment with authentication enabled and a persistent database.</div><section className="panel settings-panel"><div className="settings-head"><span className="settings-icon">⌖</span><div><h2>Demo school profile</h2><p>Example details shown for the public demo only</p></div></div><label className="field-label">School name<input value={defaults.name} readOnly disabled/></label><label className="field-label">School location<input value={defaults.city} readOnly disabled/></label><label className="field-label">Preferred language<input value="English" readOnly disabled/></label></section><div className="note-box">This page does not expose the database, parent contact details, or school preferences.</div></>;
  return <><PageIntro title="Make SaansSchool yours" text="School profile, location, timings, and safety preferences are saved to the school database."/><div className="settings-grid">
    <section className="panel settings-panel"><div className="settings-head"><span className="settings-icon">⌖</span><div><h2>School profile</h2><p>Basic details for your school community</p></div></div>
      <label className="field-label">School name<input value={settings.name} onChange={e=>update('name',e.target.value)}/></label>
      <label className="field-label">School location<select value={settings.city} onChange={e=>update('city',e.target.value)}>{CITIES.map(item=><option key={item.name}>{item.name}</option>)}</select></label>
      <label className="field-label">Preferred language<select value={settings.language} onChange={e=>update('language',e.target.value)}><option>English</option><option>हिन्दी</option></select></label>
    </section>
    <section className="panel settings-panel"><div className="settings-head"><span className="settings-icon">◷</span><div><h2>School timings</h2><p>Used for activity planning context</p></div></div>
      <div className="time-fields"><label className="field-label">School starts<input type="time" value={settings.startsAt} onChange={e=>update('startsAt',e.target.value)}/></label><label className="field-label">School ends<input type="time" value={settings.endsAt} onChange={e=>update('endsAt',e.target.value)}/></label></div>
      <label className="field-label">Morning assembly<input type="time" value={settings.assemblyAt} onChange={e=>update('assemblyAt',e.target.value)}/></label>
    </section>
    <section className="panel settings-panel preferences"><div className="settings-head"><span className="settings-icon">♧</span><div><h2>Safety preferences</h2><p>Choose school alerts and whether parents can preview messages and share feedback</p></div></div>
      {preferenceNames.map((label,index)=><div className="toggle-row" key={label}><span>{label}</span><button role="switch" aria-checked={settings.preferences[index]} aria-label={label} onClick={()=>update('preferences',settings.preferences.map((value,i)=>i===index?!value:value))} className={`switch ${settings.preferences[index]?'on':''}`}><i/></button></div>)}
    </section>
    <section className="panel settings-panel"><div className="settings-head"><span className="settings-icon">♙</span><div><h2>School accounts</h2><p>Create teacher and parent logins. New passwords must be at least 12 characters.</p></div></div>
      {users.map(user=><div className="toggle-row" key={user.id}><span><b>{user.name}</b><br/><small>{user.email}</small></span><span className="demo-label">{user.role}</span></div>)}
      <div className="time-fields"><label className="field-label">Name<input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Full name"/></label><label className="field-label">Role<select value={newRole} onChange={e=>setNewRole(e.target.value as 'teacher'|'parent')}><option value="teacher">Teacher</option><option value="parent">Parent</option></select></label></div>
      <label className="field-label">Email<input type="email" value={newEmail} onChange={e=>setNewEmail(e.target.value)} placeholder="name@example.com"/></label><label className="field-label">Temporary password<input type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} minLength={12} autoComplete="new-password"/></label>
      {(userError||userMessage)&&<p role={userError?'alert':'status'}>{userError||userMessage}</p>}<button className="outline-btn" onClick={addUser} disabled={!newName||!newEmail||newPassword.length<12}>Add account</button>
    </section>
    <div className="settings-save"><span role={error?'alert':'status'}>{error||saved||'Changes are stored in the school SQLite database.'}</span><button className="primary-btn" onClick={save} disabled={busy}>{busy?'Saving…':'Save preferences'}</button></div>
  </div></>;
}
