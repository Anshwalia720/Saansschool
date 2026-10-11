'use client';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router=useRouter(); const [email,setEmail]=useState('principal@saansschool.demo'); const [password,setPassword]=useState('SaansDemo123!'); const [error,setError]=useState(''); const [busy,setBusy]=useState(false);
  async function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError('');
    try { const response=await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})}); const data=await response.json(); if(!response.ok) throw new Error(data.error||'Unable to sign in.'); router.replace('/dashboard'); router.refresh(); }
    catch(e) { setError(e instanceof Error?e.message:'Unable to sign in.'); } finally { setBusy(false); }
  }
  return <main style={{maxWidth:420,margin:'12vh auto',padding:32,background:'#fff',borderRadius:20,boxShadow:'0 16px 50px #1232'}}><div className="brand-mark">s.</div><h1>Sign in to SaansSchool</h1><p>Use your school account to view air quality and manage school updates.</p><form onSubmit={submit} style={{display:'grid',gap:14}}><label className="field-label">Email<input type="email" required autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)}/></label><label className="field-label">Password<input type="password" required autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)}/></label>{error&&<p role="alert" style={{color:'#a33'}}>{error}</p>}<button className="primary-btn" disabled={busy}>{busy?'Signing in…':'Sign in'}</button></form><p style={{marginTop:20,fontSize:13}}>Demo roles: principal@saansschool.demo · teacher@saansschool.demo · parent@saansschool.demo<br/>Password: SaansDemo123!</p></main>;
}
