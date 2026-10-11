'use client';

import { useCallback, useEffect, useState } from 'react';
import { PageIntro, Pill } from '../components/ui';
import { useCity } from '../lib/use-city';
import { useAir } from '../lib/use-air';
import { avg24h, indiaAqi } from '../lib/aqi';

type Feedback = { parentName: string; parentEmail: string; message: string; updatedAt: string };
type Alert = {
  id: number;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  recipients: number;
  feedback?: string | null;
  feedbackUpdatedAt?: string | null;
  feedbackItems?: Feedback[];
};
type User = { role: 'principal' | 'teacher' | 'parent' };

export default function ParentAlertsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [publicDemo, setPublicDemo] = useState(false);
  const [previewsEnabled, setPreviewsEnabled] = useState(false);
  const [city] = useCity();
  const air = useAir(city.lat, city.lon);
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [draftStatus, setDraftStatus] = useState('Waiting for current air quality data…');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');
  const [busy, setBusy] = useState(false);
  const [feedbackDrafts, setFeedbackDrafts] = useState<Record<number, string>>({});
  const [feedbackBusy, setFeedbackBusy] = useState<number | null>(null);
  const [feedbackNotice, setFeedbackNotice] = useState<Record<number, string>>({});

  const average = air.data ? avg24h(air.data.hourly, air.data.nowIndex) : null;
  const pm25 = average?.pm25 ?? null;
  const pm10 = average?.pm10 ?? null;
  const aqi = pm25 !== null && pm10 !== null ? indiaAqi(pm25, pm10).aqi : null;
  const isParent = user?.role === 'parent';

  const loadAlerts = useCallback(async () => {
    const response = await fetch('/api/alerts', { cache: 'no-store' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Could not load alerts.');
    setAlerts(Array.isArray(data.alerts) ? data.alerts : []);
    setPreviewsEnabled(data.previewsEnabled === true);
    setError('');
  }, []);

  useEffect(() => {
    let active = true;
    fetch('/api/auth/me')
      .then(async (response) => {
        const data = await response.json();
        if (data.demoMode === true) { if (active) setPublicDemo(true); return; }
        if (!response.ok || !data.user) throw new Error('Sign in required.');
        if (active) setUser(data.user);
      })
      .catch((loadError: unknown) => { if (active) setError(loadError instanceof Error ? loadError.message : 'Could not load your account.'); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!user || publicDemo) return;
    loadAlerts().catch((loadError: unknown) => setError(loadError instanceof Error ? loadError.message : 'Could not load alerts.'));
  }, [user, publicDemo, loadAlerts]);

  useEffect(() => {
    if ((!user && !publicDemo) || isParent || pm25 === null || pm10 === null) return;
    const controller = new AbortController();
    fetch('/api/alerts/draft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city: city.name, pm25, pm10, language: lang }),
      signal: controller.signal,
    }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not generate the alert.');
      setSubject(data.subject);
      setMessage(data.message);
      setDraftStatus(`Automatically updated from ${data.category} air quality · AQI ${data.aqi}.`);
    }).catch((draftError: unknown) => {
      if (!controller.signal.aborted) setDraftStatus(draftError instanceof Error ? draftError.message : 'Could not generate the alert.');
    });
    return () => controller.abort();
  }, [city.name, pm25, pm10, lang, user, isParent, publicDemo]);

  const send = async () => {
    setBusy(true);
    setError('');
    setResult('');
    try {
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, message, language: lang }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || 'Unable to send alert.');
      setResult(data.message);
      await loadAlerts();
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : 'Unable to send alert.');
    } finally {
      setBusy(false);
    }
  };

  const submitFeedback = async (alertId: number) => {
    setFeedbackBusy(alertId);
    setFeedbackNotice((current) => ({ ...current, [alertId]: '' }));
    try {
      const response = await fetch('/api/alerts/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertId, message: feedbackDrafts[alertId] ?? '' }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not submit feedback.');
      setFeedbackNotice((current) => ({ ...current, [alertId]: data.message }));
      await loadAlerts();
    } catch (feedbackError) {
      setFeedbackNotice((current) => ({ ...current, [alertId]: feedbackError instanceof Error ? feedbackError.message : 'Could not submit feedback.' }));
    } finally {
      setFeedbackBusy(null);
    }
  };

  if (publicDemo) return <>
    <PageIntro title="Parent alert preview" text="Preview the AQI-based message parents would receive. Public demo mode does not send email or store feedback." />
    <div className="alert-toolbar"><span className="demo-label">{aqi === null ? 'AQI loading' : `CURRENT MODEL AQI ${aqi}`} · DEMO PREVIEW</span><div className="language-control"><button className={lang === 'en' ? 'selected' : ''} onClick={() => setLang('en')}>English</button><button className={lang === 'hi' ? 'selected' : ''} onClick={() => setLang('hi')}>हिन्दी</button></div></div>
    <div className="note-box" role="status">{air.status === 'error' && !air.data ? `Air quality could not load: ${air.error}` : draftStatus}</div>
    <div className="parent-alert"><div className="alert-top"><div className="brand-mark small-mark">s.</div><span>SAANSSCHOOL · {city.name.toUpperCase()}</span><Pill tone="amber">{aqi === null ? 'AQI —' : `AQI ${aqi}`}</Pill></div><div className="alert-message"><div className="alert-art">☁<span>!</span></div><div><div className="eyebrow">AIR QUALITY UPDATE · PREVIEW</div><h2>{subject || 'Loading message…'}</h2><p style={{ whiteSpace: 'pre-wrap' }}>{message || 'The parent message will appear after current AQI data loads.'}</p></div></div><div className="alert-bottom"><span>Preview only · No parent records are loaded</span><span className="demo-label">EMAIL DISABLED</span></div></div>
    <div className="note-box">This deployment does not expose alerts, parent accounts, feedback, or email actions. AQI is an Open-Meteo/CAMS model estimate.</div>
  </>;

  if (!user) return <><PageIntro title="Parent alerts" text="Loading your account and school alerts…" />{error && <p role="alert">{error}</p>}</>;

  if (isParent) {
    return <>
      <PageIntro title="Parent alert previews" text="Read school air-quality updates and share your family’s point of view with the school." />
      {error && <p className="plan-email-status error" role="alert">{error}</p>}
      {!previewsEnabled ? (
        <section className="panel" role="status">Parent alert previews and feedback are turned off. Please ask your school principal to enable this in School settings → Safety preferences.</section>
      ) : alerts.length ? (
        <div className="parent-preview-list">{alerts.map((alert) => (
          <article className="parent-alert" key={alert.id}>
            <div className="alert-top"><div className="brand-mark small-mark">s.</div><span>SAANSSCHOOL · PARENT PREVIEW</span><Pill tone="green">SENT</Pill></div>
            <div className="alert-message"><div className="alert-art">☁<span>!</span></div><div><div className="eyebrow">AIR QUALITY UPDATE</div><h2>{alert.subject}</h2><p style={{ whiteSpace: 'pre-wrap' }}>{alert.message}</p></div></div>
            <div className="parent-feedback">
              <label className="field-label">Your point of view<textarea rows={4} maxLength={2000} value={feedbackDrafts[alert.id] ?? alert.feedback ?? ''} onChange={(event) => setFeedbackDrafts((current) => ({ ...current, [alert.id]: event.target.value }))} placeholder="Share a concern, question, or suggestion with your school…" /></label>
              <div className="alert-bottom"><span>{alert.feedback ? 'You can update your feedback anytime.' : 'Your feedback will be visible to school staff.'}</span><button className="primary-btn" onClick={() => submitFeedback(alert.id)} disabled={feedbackBusy === alert.id || (feedbackDrafts[alert.id] ?? alert.feedback ?? '').trim().length < 3}>{feedbackBusy === alert.id ? 'Sharing…' : alert.feedback ? 'Update feedback' : 'Share with school'}</button></div>
              {feedbackNotice[alert.id] && <p className="feedback-status" role="status">{feedbackNotice[alert.id]}</p>}
              {alert.feedbackUpdatedAt && <small className="feedback-updated">Last shared: {new Date(alert.feedbackUpdatedAt).toLocaleString()}</small>}
            </div>
          </article>
        ))}</div>
      ) : (
        <section className="panel">No parent alerts have been emailed to your account yet. New school alerts will appear here.</section>
      )}
    </>;
  }

  const visibleDraftStatus = air.status === 'error' && !air.data ? `Air quality could not load: ${air.error}` : draftStatus;
  return <>
    <PageIntro title="Keep families in the know" text="Review the message before sending it to the parent email addresses on file." />
    <div className="alert-toolbar"><span className="demo-label">{aqi === null ? 'AQI loading' : `CURRENT MODEL AQI ${aqi}`}</span><div className="language-control"><button className={lang === 'en' ? 'selected' : ''} onClick={() => setLang('en')}>English</button><button className={lang === 'hi' ? 'selected' : ''} onClick={() => setLang('hi')}>हिन्दी</button></div></div>
    <div className="note-box" role="status">{visibleDraftStatus}</div>
    <section className="panel" aria-live="polite" style={{ maxWidth: 760, margin: '0 auto 14px' }}><h2>Auto-generated parent message</h2><p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{message || 'Message will appear here after current AQI data loads.'}</p></section>
    <div className="parent-alert"><div className="alert-top"><div className="brand-mark small-mark">s.</div><span>SAANSSCHOOL · {city.name.toUpperCase()}</span><Pill tone="amber">{aqi === null ? 'AQI —' : `AQI ${aqi}`}</Pill></div><div className="alert-message"><div className="alert-art">☁<span>!</span></div><div><div className="eyebrow">AIR QUALITY UPDATE</div><h2>{subject}</h2><p>{message}</p></div></div><label className="field-label">Email subject<input value={subject} onChange={(event) => setSubject(event.target.value)} /></label><label className="field-label">Message<textarea rows={5} value={message} onChange={(event) => setMessage(event.target.value)} /></label><div className="alert-bottom"><span>Recipients: parent accounts in the school database</span><button className="primary-btn" onClick={send} disabled={busy || !subject.trim() || !message.trim()}>{busy ? 'Sending…' : 'Send parent email'}</button></div></div>
    <div className="note-box">The draft updates from modeled PM2.5 and PM10 conditions. Sending requires Gmail credentials and real parent email addresses. AQI is a model estimate, not a school sensor reading.</div>
    {(error || result) && <p role={error ? 'alert' : 'status'}>{error || result}</p>}
    <div className="section-heading"><div><h2>Alert history</h2><p>Delivery state and parent feedback for this school</p></div></div>
    {alerts.length ? <div className="panel">{alerts.map((alert) => <div key={alert.id} className="alert-history-item"><div className="toggle-row"><span><b>{alert.subject}</b><br /><small>{new Date(alert.createdAt).toLocaleString()} · {alert.recipients} parent(s)</small></span><Pill tone={alert.status === 'sent' ? 'green' : alert.status === 'failed' ? 'rose' : 'amber'}>{alert.status}</Pill></div>{alert.feedbackItems?.length ? <div className="feedback-list"><b>Parent feedback</b>{alert.feedbackItems.map((item) => <blockquote key={`${alert.id}-${item.parentEmail}`}><p>{item.message}</p><footer>{item.parentName} · {new Date(item.updatedAt).toLocaleString()}</footer></blockquote>)}</div> : null}</div>)}</div> : <div className="panel">No alerts have been queued yet.</div>}
  </>;
}
