// 'use client';

// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { useState } from 'react';

// const nav = [
//   { href: '/dashboard', icon: '⌂', label: 'Overview' },
//   { href: '/air-quality', icon: '◉', label: 'Air quality' },
//   { href: '/tomorrow-plan', icon: '✳', label: "Tomorrow’s plan" },
//   { href: '/parent-alerts', icon: '♡', label: 'Parent alerts' },
// ];
// const titleByPath: Record<string, string> = {
//   '/dashboard': 'Good morning, Abhinav Ruhela', '/air-quality': 'Air quality', '/tomorrow-plan': "Tomorrow’s school plan",
//   '/parent-alerts': 'Parent alerts', '/settings': 'School settings', '/about': 'About SaansSchool',
// };
// const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// function TrendChart() {
//   return <div className="chart-wrap"><div className="chart-labels"><span>200</span><span>150</span><span>100</span><span>50</span></div><div className="chart-area"><div className="chart-grid"><i/><i/><i/><i/></div><svg viewBox="0 0 700 190" preserveAspectRatio="none" role="img" aria-label="Demo AQI trend over seven days"><defs><linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#49a990" stopOpacity=".22"/><stop offset="1" stopColor="#49a990" stopOpacity="0"/></linearGradient></defs><path d="M0 100 C55 94 65 42 116 50 S177 111 233 83 S288 51 350 61 S405 130 466 94 S520 54 583 70 S641 105 700 79 L700 190 L0 190Z" fill="url(#fill)"/><path d="M0 100 C55 94 65 42 116 50 S177 111 233 83 S288 51 350 61 S405 130 466 94 S520 54 583 70 S641 105 700 79" fill="none" stroke="#26866f" strokeWidth="3" strokeLinecap="round"/><circle cx="700" cy="79" r="5" fill="#fff" stroke="#26866f" strokeWidth="3"/></svg><div className="chart-days">{days.map(d => <span key={d}>{d}</span>)}</div></div></div>;
// }

// function Pill({ children, tone = 'green' }: { children: React.ReactNode; tone?: string }) { return <span className={`pill ${tone}`}>{children}</span>; }

// function Dashboard() {
//   return <>
//     <section className="welcome-row"><div><div className="eyebrow">MONDAY, 12 OCTOBER 2026 <span className="live-dot"/> DEMO DATA</div><h1>Good morning, Abhinav Ruhela <span>☀</span></h1><p>Here’s the air quality outlook for your school community.</p></div><button className="outline-btn" onClick={() => window.print()}>↗ <span>Export summary</span></button></section>
//     <div className="notice"><span className="notice-icon">✳</span><div><b>Today needs a little extra care</b><p>Air quality is elevated around your school. A few thoughtful changes can make a real difference.</p></div><Link href="/tomorrow-plan" className="notice-link">View school plan <span>→</span></Link></div>
//     <div className="metrics-grid">
//       <article className="metric-card aqi-card"><div className="metric-top"><span>Current AQI</span><span className="mini-icon">◉</span></div><div className="aqi-number">142 <Pill tone="amber">Moderate</Pill></div><p className="muted">Air quality index <span className="trend-up">↗ 8</span> vs yesterday</p><div className="scale"><i/></div><div className="scale-labels"><span>Good</span><span>Moderate</span><span>Poor</span><span>Severe</span></div></article>
//       <article className="metric-card"><div className="metric-top"><span>PM2.5</span><span className="metric-symbol teal">◌</span></div><div className="metric-reading">64 <small>µg/m³</small></div><p className="muted">Fine particles <span className="descriptor">Elevated</span></p><div className="tiny-track"><i style={{width:'68%'}}/></div><p className="reference">WHO guideline · 15 µg/m³</p></article>
//       <article className="metric-card"><div className="metric-top"><span>PM10</span><span className="metric-symbol gold">◌</span></div><div className="metric-reading">108 <small>µg/m³</small></div><p className="muted">Coarse particles <span className="descriptor">Moderate</span></p><div className="tiny-track gold-track"><i style={{width:'52%'}}/></div><p className="reference">WHO guideline · 45 µg/m³</p></article>
//       <article className="metric-card location-card"><div className="metric-top"><span>School location</span><span className="metric-symbol">⌖</span></div><div className="location-name">Greenfield<br/>Public School</div><p className="muted">Bengaluru, Karnataka</p><div className="location-foot"><span>⌖ &nbsp; Indiranagar, 560038</span><span>Change →</span></div></article>
//     </div>
//     <div className="content-grid"><article className="panel chart-panel"><div className="panel-heading"><div><h2>Air quality trend</h2><p>Daily AQI · last 7 days <span className="demo-label">DEMO</span></p></div><button className="select-like">This week⌄</button></div><TrendChart/><div className="chart-foot"><span><i className="legend-dot"/> AQI</span><span>Source: Sample data · Updated 8:30 am</span></div></article>
//       <article className="panel outlook"><div className="panel-heading"><div><h2>Tomorrow’s outlook</h2><p>Tuesday, 13 October <span className="demo-label">DEMO FORECAST</span></p></div><span className="sun-cloud">☁</span></div><div className="outlook-aqi"><span>Expected AQI</span><b>156</b><Pill tone="amber">Moderate</Pill></div><div className="outlook-rule"/><div className="outlook-advice"><span className="advice-icon">↗</span><div><b>Move morning assembly indoors</b><p>Outdoor exposure may be uncomfortable for sensitive children.</p></div></div><Link href="/tomorrow-plan" className="text-link">See all recommendations <span>→</span></Link></article></div>
//     <div className="section-heading"><div><h2>Today’s school actions</h2><p>Simple steps for a safer school day</p></div><Link href="/tomorrow-plan" className="text-link">Full action plan →</Link></div>
//     <div className="actions-grid"><Action title="Morning assembly" status="Move indoors" tone="amber" icon="⌂" detail="Choose a well-ventilated hall and keep the assembly brief."/><Action title="Outdoor PT" status="Modify activity" tone="blue" icon="↗" detail="Keep exertion light. Offer an indoor alternative for students."/><Action title="Children with asthma" status="Extra care" tone="rose" icon="♡" detail="Remind families to follow their existing care plans."/></div>
//     <p className="disclaimer">SaansSchool uses sample data for demonstration. Recommendations are general guidance, not medical advice.</p>
//   </>;
// }

// function Action({ title, status, tone, icon, detail }: { title: string; status: string; tone: string; icon: string; detail: string }) { const [open, setOpen] = useState(false); return <article className="action-card"><div className={`action-icon ${tone}`}>{icon}</div><div className="action-content"><div className="action-title"><b>{title}</b><Pill tone={tone}>{status}</Pill></div><p>{detail}</p><button onClick={() => setOpen(!open)} className="detail-toggle">{open ? 'Hide reason −' : 'Why this action? +'}</button>{open && <div className="action-reason">Based on the demo AQI outlook and SaansSchool sample decision rules. Recheck local conditions before making school decisions.</div>}</div></article>; }

// function AirQuality() { return <><PageIntro title="Air quality, made understandable" text="A clear view of the air around your school, with context that helps you decide what to do."/><div className="notice"><span className="notice-icon">◉</span><div><b>Moderate air quality <Pill tone="amber">AQI 142 · DEMO</Pill></b><p>Some children who are unusually sensitive may experience discomfort with prolonged outdoor activity.</p></div></div><div className="content-grid"><article className="panel chart-panel"><div className="panel-heading"><div><h2>Weekly AQI history</h2><p>Sample readings · 5–12 October 2026</p></div><Pill>DEMO DATA</Pill></div><TrendChart/><div className="chart-foot"><span>Source: SaansSchool sample dataset</span><span>Last refreshed 8:30 am</span></div></article><article className="panel pollutant-panel"><h2>What’s in the air?</h2><p className="subtext">Pollutant levels near your school</p><Pollutant name="PM2.5" desc="Fine particles" value="64" unit="µg/m³" tag="Elevated" tone="amber"/><Pollutant name="PM10" desc="Coarse particles" value="108" unit="µg/m³" tag="Moderate" tone="blue"/><Pollutant name="NO₂" desc="Nitrogen dioxide" value="28" unit="µg/m³" tag="Low" tone="green"/><div className="source-box">ⓘ &nbsp;Sample values for prototype only. No live sensor or official data source is connected.</div></article></div><div className="section-heading"><div><h2>Reading the AQI</h2><p>Higher numbers mean more caution may be needed.</p></div></div><div className="aqi-bands">{[['0–50','Good','green'],['51–100','Satisfactory','teal'],['101–200','Moderate','amber'],['201–300','Poor','orange'],['301+','Very poor','rose']].map(([range,label,tone])=><div className="band" key={label}><span className={`band-dot ${tone}`}/><b>{range}</b><span>{label}</span></div>)}</div></>; }
// function Pollutant({name,desc,value,unit,tag,tone}:{name:string;desc:string;value:string;unit:string;tag:string;tone:string}) {return <div className="pollutant-row"><div><b>{name}</b><small>{desc}</small></div><strong>{value} <small>{unit}</small></strong><Pill tone={tone}>{tag}</Pill></div>;}
// function Plan() { const plans=[['Morning assembly','Move indoors','Elevated AQI can make extended outdoor exposure uncomfortable for sensitive students.','AQI 156 · Demo outlook','amber','⌂'],['Physical training','Modify intensity','Keep outdoor exertion light and offer an indoor activity option.','PM2.5 68 µg/m³ · Demo','blue','↗'],['Outdoor sports','Use indoor alternative','Consider rescheduling strenuous outdoor sports until conditions improve.','AQI 156 · Demo outlook','rose','⚑'],['Break-time activities','Encourage indoor play','Provide a comfortable, ventilated indoor space during break.','Moderate category · Demo','amber','◷'],['Respiratory sensitivities','Share a gentle reminder','Families can follow each child’s existing care plan and contact their clinician with concerns.','General precaution · Not medical advice','green','♡']]; return <><PageIntro title="Plan for a safer school day" text="A practical, sample-data guide to help your team prepare for Tuesday, 13 October."/><div className="plan-callout"><div className="plan-date">TUE<b>13</b>OCT</div><div><Pill tone="amber">DEMO FORECAST · AQI 156</Pill><h2>Small changes, thoughtful care.</h2><p>These sample recommendations are based on demo readings, not a confirmed forecast or official advisory.</p></div><button className="outline-btn" onClick={()=>window.print()}>Print plan</button></div><div className="plan-list">{plans.map(([title,status,reason,data,tone,icon])=><article className="plan-row" key={title}><div className={`action-icon ${tone}`}>{icon}</div><div className="plan-main"><div className="plan-title"><h2>{title}</h2><Pill tone={tone}>{status}</Pill></div><p>{reason}</p><span className="plan-data">◉ &nbsp;{data}</span></div><button className="circle-arrow" aria-label={`More about ${title}`}>↗</button></article>)}</div><p className="disclaimer">General school planning guidance only. This is not medical advice. Confirm local conditions with appropriate authorities before acting.</p></>; }

// function Alerts() { const [lang,setLang]=useState<'en'|'hi'>('en'); const hi=lang==='hi'; return <><PageIntro title="Keep families in the know" text="A clear, calm update parents can understand at a glance."/><div className="alert-toolbar"><span className="demo-label">SAMPLE ALERT PREVIEW · NOT SENT</span><div className="language-control"><button className={lang==='en'?'selected':''} onClick={()=>setLang('en')}>English</button><button className={hi?'selected':''} onClick={()=>setLang('hi')}>हिन्दी</button></div></div><div className="parent-alert"><div className="alert-top"><div className="brand-mark small-mark">s.</div><span>GREENFIELD PUBLIC SCHOOL</span><Pill tone="amber">AQI 156 · DEMO</Pill></div><div className="alert-message"><div className="alert-art">☁<span>!</span></div><div><div className="eyebrow">AIR QUALITY UPDATE · 7:30 AM</div><h2>{hi?'आज वायु गुणवत्ता मध्यम है':'A little extra care today'}</h2><p>{hi?'आज हवा की गुणवत्ता मध्यम श्रेणी में है। सुबह की सभा घर के अंदर होगी और पीटी गतिविधियों में बदलाव किया जाएगा।':'Air quality is moderate today. Morning assembly will be held indoors, and outdoor PT will be adjusted.'}</p></div></div><div className="alert-tips"><b>{hi?'आप क्या कर सकते हैं':'A few helpful reminders'}</b><ul>{(hi?['बच्चे को पानी की बोतल दें।','यदि आपके बच्चे को सांस की समस्या है, तो उसकी नियमित देखभाल योजना का पालन करें।','लक्षण होने पर स्कूल से संपर्क करें।']:['Send your child with a water bottle.','If your child has a respiratory condition, follow their existing care plan.','Please contact the school if you have any concerns.']).map(t=><li key={t}><span>✓</span>{t}</li>)}</ul></div><div className="alert-bottom"><span>Prepared with care by Greenfield Public School</span><span>Sample preview · Not a live alert</span></div></div><div className="preview-caption">PREVIEW CARD <span>Parents would see a message like this in their usual school communication channel.</span></div><div className="note-box">ⓘ &nbsp;This is sample frontend content. SaansSchool does not send SMS, email, or push notifications.</div></>; }

// function Settings() { const [location,setLocation]=useState('Bengaluru, Karnataka');const [language,setLanguage]=useState('English');const [saved,setSaved]=useState(false);const [toggles,setToggles]=useState([true,true,false,true]);const names=['AQI alert reminders','Weekly air quality summary','Parent alert previews','Extra care for sensitive students'];return <><PageIntro title="Make SaansSchool yours" text="Set the school details and preferences that guide your planning experience."/><div className="settings-grid"><section className="panel settings-panel"><div className="settings-head"><span className="settings-icon">⌖</span><div><h2>School profile</h2><p>Basic details for your school community</p></div></div><label className="field-label">School name<input defaultValue="Greenfield Public School"/></label><label className="field-label">School location<select value={location} onChange={e=>setLocation(e.target.value)}>{['Bengaluru, Karnataka','New Delhi, Delhi','Mumbai, Maharashtra','Pune, Maharashtra','Chennai, Tamil Nadu','Kolkata, West Bengal'].map(l=><option key={l}>{l}</option>)}</select></label><label className="field-label">Preferred language<select value={language} onChange={e=>setLanguage(e.target.value)}><option>English</option><option>हिन्दी</option></select></label></section><section className="panel settings-panel"><div className="settings-head"><span className="settings-icon">◷</span><div><h2>School timings</h2><p>Used for activity planning context</p></div></div><div className="time-fields"><label className="field-label">School starts<input type="time" defaultValue="08:00"/></label><label className="field-label">School ends<input type="time" defaultValue="14:30"/></label></div><label className="field-label">Morning assembly<input type="time" defaultValue="08:15"/></label></section><section className="panel settings-panel preferences"><div className="settings-head"><span className="settings-icon">♧</span><div><h2>Safety preferences</h2><p>Choose what your school wants to keep in view</p></div></div>{names.map((n,i)=><div className="toggle-row" key={n}><span>{n}</span><button role="switch" aria-checked={toggles[i]} onClick={()=>setToggles(toggles.map((v,j)=>i===j?!v:v))} className={`switch ${toggles[i]?'on':''}`}><i/></button></div>)}</section><div className="settings-save"><span>{saved?'✓ Preferences saved for this session':'Prototype settings stay in this browser session.'}</span><button className="primary-btn" onClick={()=>setSaved(true)}>{saved?'Saved':'Save preferences'}</button></div></div></>; }

// function About() {return <><PageIntro title="Every breath matters at school" text="SaansSchool helps school communities turn air quality information into thoughtful, practical action."/><div className="about-hero"><div><Pill>BUILT FOR SCHOOL COMMUNITIES</Pill><h2>From air quality numbers<br/>to a plan everyone can use.</h2><p>Air quality dashboards often stop at a number. Schools need a clearer next step: what might this mean for assembly, sports, and the children in their care?</p></div><div className="about-illustration"><div className="air-ring ring-one"/><div className="air-ring ring-two"/><span>☘</span></div></div><div className="about-cards"><article className="panel"><span className="about-icon">♧</span><h2>Who it’s for</h2><p>Principals, teachers, and parents who need a calm, clear way to understand air quality at school.</p></article><article className="panel"><span className="about-icon">↗</span><h2>What it helps solve</h2><p>Making everyday choices easier when air quality may affect outdoor activity and student comfort.</p></article><article className="panel"><span className="about-icon">✳</span><h2>Why actions matter</h2><p>SaansSchool connects readings to practical options and simple explanations families can understand.</p></article></div><div className="note-box">All readings and forecasts in this prototype are demo data. SaansSchool is not a medical service or an official air-quality authority.</div></>;}

// function PageIntro({title,text}:{title:string;text:string}){return <section className="page-intro"><div className="eyebrow">SAANSSCHOOL <span className="live-dot"/> DEMO MODE</div><h1>{title}</h1><p>{text}</p></section>;}

// export default function AppShell() {
//  const path=usePathname(); const [mobile,setMobile]=useState(false); const [search,setSearch]=useState('');
//  const content:Record<string,React.ReactNode>={'/dashboard':<Dashboard/>,'/air-quality':<AirQuality/>,'/tomorrow-plan':<Plan/>,'/parent-alerts':<Alerts/>,'/settings':<Settings/>,'/about':<About/>};
//  return <div className="app-frame"><aside className={`sidebar ${mobile?'mobile-open':''}`}><Link href="/dashboard" className="brand"><span className="brand-mark">s.</span><span>saans<span className="brand-light">school</span></span></Link><div className="school-switch"><span className="school-avatar">G</span><span><b>Greenfield Public</b><small>School workspace</small></span><span className="chevron">⌄</span></div><div className="nav-caption">WORKSPACE</div><nav>{nav.map(n=><Link onClick={()=>setMobile(false)} href={n.href} key={n.href} className={`nav-link ${path===n.href?'active':''}`}><span className="nav-icon">{n.icon}</span>{n.label}{n.href==='/tomorrow-plan'&&<span className="nav-badge">1</span>}</Link>)}</nav><div className="nav-caption manage-caption">MANAGE</div><nav><Link onClick={()=>setMobile(false)} href="/settings" className={`nav-link ${path==='/settings'?'active':''}`}><span className="nav-icon">⚙</span>School settings</Link><Link onClick={()=>setMobile(false)} href="/about" className={`nav-link ${path==='/about'?'active':''}`}><span className="nav-icon">ⓘ</span>About SaansSchool</Link></nav><div className="sidebar-bottom"><div className="help-card"><div className="help-spark">✳</div><b>Here to help you breathe easier.</b><p>Thoughtful guidance for every school day.</p><Link href="/about">How it works →</Link></div><div className="user-profile"><span className="user-avatar">AR</span><span><b>Abhinav Ruhela</b><small>School administrator</small></span><span className="more">···</span></div></div></aside><main className="main-area"><header className="topbar"><div className="mobile-brand"><button className="menu-btn" onClick={()=>setMobile(!mobile)}>☰</button><Link href="/dashboard" className="brand"><span className="brand-mark">s.</span><span>saans<span className="brand-light">school</span></span></Link></div><div className="breadcrumb">Workspace <span>/</span> <b>{titleByPath[path]||'Overview'}</b></div><div className="top-actions"><label className="search-box"><span>⌕</span><input aria-label="Search" placeholder="Search anything..." value={search} onChange={e=>setSearch(e.target.value)}/><kbd>⌘ K</kbd></label><button className="icon-button" aria-label="Help">?</button><button className="notification-button" aria-label="Notifications">♧<i/></button><span className="top-avatar">AR</span></div></header><div className="page-content">{content[path]||<Dashboard/>}<footer className="footer"><span>© 2026 SaansSchool <i/> Made with care for school communities in India</span><span>DEMO PROTOTYPE · SAMPLE DATA</span></footer></div></main>{mobile&&<button aria-label="Close navigation" className="mobile-backdrop" onClick={()=>setMobile(false)}/>}</div>;
// }






'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const workspace = [
  { href: '/dashboard', icon: '⌂', label: 'Overview' },
  { href: '/air-quality', icon: '◉', label: 'Air quality' },
  { href: '/tomorrow-plan', icon: '✳', label: 'Tomorrow’s plan' },
  { href: '/parent-alerts', icon: '♡', label: 'Parent alerts' },
];
const manage = [
  { href: '/settings', icon: '⚙', label: 'School settings' },
  { href: '/about', icon: 'ⓘ', label: 'About SaansSchool' },
];
const allPages = [...workspace, ...manage];

const titleByPath: Record<string, string> = {
  '/dashboard': 'Overview',
  '/air-quality': 'Air quality',
  '/tomorrow-plan': 'Tomorrow’s plan',
  '/parent-alerts': 'Parent alerts',
  '/settings': 'School settings',
  '/about': 'About SaansSchool',
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState<{name:string; role:string; schoolName?:string} | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [publicDemo, setPublicDemo] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const q = search.trim().toLowerCase();
  const results = q ? allPages.filter((p) => p.label.toLowerCase().includes(q)) : [];

  const go = (href: string) => {
    router.push(href);
    setSearch('');
    setSearchOpen(false);
    inputRef.current?.blur();
  };

  useEffect(() => {
    let active=true;
    fetch('/api/auth/me').then(async response => {
      const data = await response.json();
      if (data?.demoMode === true) { if (active) setPublicDemo(true); return; }
      if (!response.ok || !data?.user) return;
      if (active) setUser(data.user);
    }).catch(()=>{}).finally(()=>{if(active)setAuthReady(true);});
    return () => { active=false; };
  }, [path, router]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setMobile(false);
        setSearchOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!authReady) return <div className="loading-state">Loading your school workspace…</div>;
  if (!user && !publicDemo) return <div className="loading-state">This workspace requires an authenticated school account.</div>;
  const logout = async () => { await fetch('/api/auth/logout',{method:'POST'}); router.replace('/dashboard'); };

  const renderLink = (n: { href: string; icon: string; label: string }) => (
    <Link
      key={n.href}
      href={n.href}
      onClick={() => setMobile(false)}
      className={`nav-link ${path === n.href ? 'active' : ''}`}
      aria-current={path === n.href ? 'page' : undefined}
    >
      <span className="nav-icon" aria-hidden>{n.icon}</span>
      {n.label}
      {n.href === '/tomorrow-plan' && <span className="nav-badge">1</span>}
    </Link>
  );

  return (
    <div className="app-frame">
      <a href="#main" className="skip-link">Skip to content</a>

      <aside className={`sidebar ${mobile ? 'mobile-open' : ''}`}>
        <Link href="/dashboard" className="brand" onClick={() => setMobile(false)}>
          <span className="brand-mark">s.</span>
          <span>saans<span className="brand-light">school</span></span>
        </Link>

        <div className="school-switch">
          <span className="school-avatar">G</span>
          <span><b>Greenfield Public</b><small>{user ? `${user.role} workspace` : 'public demo'}</small></span>
          <span className="chevron">⌄</span>
        </div>

        <div className="nav-caption">WORKSPACE</div>
        <nav aria-label="Workspace">{workspace.map(renderLink)}</nav>

        <div className="nav-caption manage-caption">MANAGE</div>
        <nav aria-label="Manage">{manage.map(renderLink)}</nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-spark">✳</div>
            <b>Here to help you breathe easier.</b>
            <p>Thoughtful guidance for every school day.</p>
            <Link href="/about" onClick={() => setMobile(false)}>How it works →</Link>
          </div>
          <div className="user-profile">
            <span className="user-avatar">{user ? user.name.split(' ').map(part=>part[0]).slice(0,2).join('') : 'D'}</span>
            <span><b>{user?.name ?? 'Public demo'}</b><small>{user?.role ?? 'Read-only access'}</small></span>
            {user && <button className="more" onClick={logout} aria-label="Sign out">↪</button>}
          </div>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div className="mobile-brand">
            <button className="menu-btn" aria-label="Open navigation" onClick={() => setMobile(!mobile)}>☰</button>
            <Link href="/dashboard" className="brand">
              <span className="brand-mark">s.</span>
              <span>saans<span className="brand-light">school</span></span>
            </Link>
          </div>

          <div className="breadcrumb">
            Workspace <span>/</span> <b>{titleByPath[path] ?? 'Overview'}</b>
          </div>

          <div className="top-actions">
            <div className="search-box">
              <span aria-hidden>⌕</span>
              <input
                ref={inputRef}
                aria-label="Search pages"
                placeholder="Jump to a page..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setSearchOpen(true); }}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setSearchOpen(false)}
                onKeyDown={(e) => { if (e.key === 'Enter' && results[0]) go(results[0].href); }}
              />
              <kbd>Ctrl K</kbd>
              {searchOpen && q && (
                <div className="search-results">
                  {results.length ? results.map((r) => (
                    <button key={r.href} onMouseDown={(e) => { e.preventDefault(); go(r.href); }}>
                      <span aria-hidden>{r.icon}</span>{r.label}
                    </button>
                  )) : <p className="search-empty">No pages match “{search}”</p>}
                </div>
              )}
            </div>
            <button className="icon-button" aria-label="Help" onClick={() => go('/about')}>?</button>
            <button className="notification-button" aria-label="Notifications">♧<i /></button>
            {user ? <button className="top-avatar" onClick={logout} aria-label="Sign out">{user.name.split(' ').map(part=>part[0]).slice(0,2).join('')}</button> : <span className="top-avatar" aria-label="Public demo">D</span>}
          </div>
        </header>

        <main id="main" className="page-content">
          {children}
          <footer className="footer">
            <span>© 2026 SaansSchool <i /> Made with care for school communities in India</span>
            <span>DEMO PROTOTYPE · SAMPLE DATA</span>
          </footer>
        </main>
      </div>

      {mobile && <button aria-label="Close navigation" className="mobile-backdrop" onClick={() => setMobile(false)} />}
    </div>
  );
}
