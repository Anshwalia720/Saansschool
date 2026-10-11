// import AppShell from '../app-shell';
// export default function TomorrowPlanPage() { return <AppShell />; }



// import { Plan } from '../views';

// export default function TomorrowPlanPage() {
//   return <Plan />;
// }



'use client';

import { useEffect, useState } from 'react';
import { addDays, band, dateKey, fmt, longDate } from '../lib/data';
import { avg24h, dailyAqi, indiaAqi } from '../lib/aqi';
import { useNow } from '../lib/use-now';
import { useAir } from '../lib/use-air';
import { useCity } from '../lib/use-city';
import { PageIntro, Pill } from '../components/ui';

type SchoolSettings = {
  name: string;
  city: string;
  startsAt: string;
  endsAt: string;
  assemblyAt: string;
  preferences: boolean[];
};

const preferenceLabels = [
  'AQI alert reminders',
  'Weekly air quality summary',
  'Parent alert previews',
  'Extra care for sensitive students',
];

export default function TomorrowPlanPage() {
  const now = useNow();
  const t = now ? addDays(now, 1) : null;
  const [city] = useCity();
  const air = useAir(city.lat, city.lon);
  const [school, setSchool] = useState<SchoolSettings | null>(null);
  const [publicDemo, setPublicDemo] = useState(false);
  const [emailBusy, setEmailBusy] = useState(false);
  const [emailResult, setEmailResult] = useState('');
  const [emailError, setEmailError] = useState('');
  useEffect(() => {
    fetch('/api/auth/me').then((response) => response.json()).then((data) => setPublicDemo(data.demoMode === true)).catch(() => {});
  }, []);
  useEffect(() => {
    let active = true;
    fetch('/api/school/settings')
      .then(async (response) => {
        if (!response.ok) throw new Error('Could not load school profile.');
        return response.json();
      })
      .then((data: SchoolSettings) => { if (active) setSchool(data); })
      .catch(() => { if (active) setSchool(null); });
    return () => { active = false; };
  }, []);
  const tomorrowKey = t ? dateKey(t) : '';
  const tomorrowAqi = air.data ? dailyAqi(air.data.hourly.time, air.data.hourly).find((point) => point.date === tomorrowKey)?.aqi ?? null : null;
  const currentAverage = air.data ? avg24h(air.data.hourly, air.data.nowIndex) : null;
  const currentAqi = currentAverage ? indiaAqi(currentAverage.pm25, currentAverage.pm10).aqi : null;
  const planningAqi = currentAqi ?? tomorrowAqi;
  const planBand = planningAqi === null ? null : band(planningAqi);
  const planTone = planningAqi === null ? 'blue' : planningAqi <= 100 ? 'green' : planningAqi <= 200 ? 'amber' : 'rose';
  const risk = planningAqi === null ? 'unknown' : planningAqi <= 50 ? 'good' : planningAqi <= 100 ? 'satisfactory' : planningAqi <= 200 ? 'moderate' : planningAqi <= 300 ? 'poor' : planningAqi <= 400 ? 'veryPoor' : 'severe';
  const planGuidance = risk === 'good' ? 'Outdoor activities as planned' : risk === 'satisfactory' ? 'Usual plan; monitor sensitive students' : risk === 'moderate' ? 'Modify prolonged outdoor activity' : risk === 'poor' ? 'Move activities indoors' : risk === 'veryPoor' || risk === 'severe' ? 'Keep students indoors' : 'Check local conditions';
  const conditionDetail = currentAqi === null ? 'Current AQI unavailable; using tomorrow model outlook where available.' : `Plan based on the latest AQI estimate from recent 24-hour readings: ${currentAqi} (${planBand?.label}). It refreshes as new air-quality data arrives.`;
  const planData = planningAqi === null ? 'No usable AQI reading available' : `${currentAqi === null ? 'Model estimate' : 'Current AQI'} ${planningAqi} · ${planBand?.label}`;

  const plans = [
    {
      title: 'Morning assembly',
      status: risk === 'good' || risk === 'satisfactory' ? 'Outdoor as planned' : risk === 'moderate' ? 'Consider indoor assembly' : risk === 'unknown' ? 'Check local conditions' : 'Hold indoors',
      reason: risk === 'good' ? 'Air quality is good. Hold assembly outdoors as scheduled and follow usual school precautions.' : risk === 'satisfactory' ? 'Proceed as usual; keep an eye on students who are sensitive to air pollution.' : risk === 'moderate' ? 'Consider an indoor venue, especially for students sensitive to air pollution.' : risk === 'unknown' ? 'Check local conditions before deciding where to hold assembly.' : 'Keep assembly indoors and limit student exposure to outdoor air.',
      data: planData, tone: planTone, icon: '⌂',
    },
    {
      title: 'Physical training',
      status: risk === 'good' ? 'As planned' : risk === 'satisfactory' ? 'Usual activity' : risk === 'moderate' ? 'Reduce intensity' : risk === 'unknown' ? 'Check conditions' : 'Indoor activity only',
      reason: risk === 'good' ? 'Normal outdoor physical training can continue; encourage water breaks.' : risk === 'satisfactory' ? 'Continue the usual session and observe student comfort.' : risk === 'moderate' ? 'Shorten strenuous outdoor exercise and offer a lighter or indoor option.' : risk === 'unknown' ? 'Check local conditions before strenuous exercise.' : 'Use a low-exertion indoor alternative and avoid strenuous outdoor activity.',
      data: planData, tone: planTone, icon: '↗',
    },
    {
      title: 'Outdoor sports',
      status: risk === 'good' || risk === 'satisfactory' ? 'As scheduled' : risk === 'moderate' ? 'Use caution' : risk === 'unknown' ? 'Recheck AQI first' : 'Postpone outdoor sports',
      reason: risk === 'good' ? 'Outdoor sports can continue as scheduled; follow normal supervision and hydration practices.' : risk === 'satisfactory' ? 'Sports may continue; monitor sensitive students and shorten activity if anyone feels unwell.' : risk === 'moderate' ? 'Limit prolonged or strenuous play and keep an indoor option available.' : risk === 'unknown' ? 'Recheck air quality before deciding whether to play outdoors.' : 'Postpone outdoor sports and choose an indoor alternative.',
      data: planData, tone: planTone, icon: '⚑',
    },
    {
      title: 'Break-time activities',
      status: risk === 'good' || risk === 'satisfactory' ? 'Outdoor play available' : risk === 'moderate' ? 'Offer indoor play' : risk === 'unknown' ? 'Offer both options' : 'Indoor play',
      reason: risk === 'good' || risk === 'satisfactory' ? 'Outdoor play can remain available, with a comfortable indoor space as an option.' : risk === 'moderate' ? 'Make a comfortable indoor space available, particularly for sensitive students.' : risk === 'unknown' ? 'Provide an indoor option until local conditions are checked.' : 'Keep break-time activities indoors.',
      data: planData, tone: planTone, icon: '◷',
    },
    {
      title: 'Respiratory sensitivities',
      status: risk === 'good' || risk === 'satisfactory' ? 'Usual care' : 'Extra care',
      reason: risk === 'good' || risk === 'satisfactory' ? 'Continue each student’s usual care plan and respond to any discomfort.' : 'Reduce exposure where possible. Families can follow each child’s existing care plan and contact their clinician with concerns.',
      data: 'General precaution · Not medical advice', tone: risk === 'poor' || risk === 'veryPoor' || risk === 'severe' ? 'rose' : 'green', icon: '♡',
    },
  ];

  const sendPlan = async () => {
    if (publicDemo) return;
    if (!t) return;
    setEmailBusy(true);
    setEmailResult('');
    setEmailError('');
    const settingsLines = school
      ? [
          `School: ${school.name}`,
          `Location: ${school.city}`,
          `School hours: ${school.startsAt}–${school.endsAt}`,
          `Morning assembly: ${school.assemblyAt}`,
          'Safety preferences:',
          ...preferenceLabels.map((label, index) => `- ${label}: ${school.preferences?.[index] ? 'enabled' : 'disabled'}`),
        ]
      : [`School: SaansSchool`, `Location: ${city.name}`];
    const activityLines = plans.flatMap((plan) => [
      `${plan.title} — ${plan.status}`,
      `  Recommendation: ${plan.reason}`,
      `  Forecast detail: ${plan.data}`,
    ]);
    const message = [
      `TOMORROW'S SCHOOL PLAN`,
      longDate(t),
      '',
      ...settingsLines,
      '',
      'CURRENT AIR QUALITY USED FOR ACTIVITY RECOMMENDATIONS',
      `Current AQI: ${currentAqi === null ? 'Unavailable' : `${currentAqi} (${band(currentAqi).label})`}`,
      `Recommendation guidance: ${planGuidance}`,
      `Tomorrow model forecast: ${tomorrowAqi === null ? 'Unavailable' : `${tomorrowAqi} (${band(tomorrowAqi).label})`}`,
      conditionDetail,
      'Source: Open-Meteo / Copernicus CAMS regional model estimate; not an official advisory.',
      '',
      'COMPLETE ACTIVITY PLAN',
      ...activityLines,
      '',
      'Please review local conditions before making school decisions. This is general planning information, not medical advice.',
      'SaansSchool',
    ].join('\n');
    try {
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: `Tomorrow’s school plan · ${longDate(t)}`,
          message,
          language: 'en',
          tomorrowPlan: {
            schoolName: school?.name || 'SaansSchool',
            city: school?.city || city.name,
            date: longDate(t),
            weekday: fmt(t, { weekday: 'short' }).toUpperCase(),
            day: fmt(t, { day: 'numeric' }),
            month: fmt(t, { month: 'short' }).toUpperCase(),
            startsAt: school?.startsAt || '08:00',
            endsAt: school?.endsAt || '14:30',
            assemblyAt: school?.assemblyAt || '08:15',
            preferences: preferenceLabels.map((label, index) => ({ label, enabled: Boolean(school?.preferences?.[index]) })),
            aqi: planningAqi,
            tomorrowAqi,
            category: planBand?.label || 'Unavailable',
            guidance: planGuidance,
            activities: plans.map((plan) => ({ title: plan.title, status: plan.status, reason: plan.reason, detail: plan.data, icon: plan.icon })),
          },
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || result.error || 'Unable to email tomorrow’s plan.');
      setEmailResult(result.message || `Full plan sent to ${result.recipients} parent account(s).`);
    } catch (error) {
      setEmailError(error instanceof Error ? error.message : 'Unable to email tomorrow’s plan.');
    } finally {
      setEmailBusy(false);
    }
  };

  return (
    <>
      <PageIntro title="Plan for a safer school day" text={`A practical planning guide for ${t ? longDate(t) : 'tomorrow'} based on a regional air quality model.`} />

      <div className="plan-callout">
        <div className="plan-date">
          {t ? fmt(t, { weekday: 'short' }).toUpperCase() : ''}
          <b>{t ? fmt(t, { day: 'numeric' }) : ''}</b>
          {t ? fmt(t, { month: 'short' }).toUpperCase() : ''}
        </div>
        <div>
          <Pill tone={planTone}>{air.status === 'loading' ? 'LOADING CURRENT AQI' : currentAqi === null ? 'CURRENT AQI UNAVAILABLE' : `CURRENT AQI · ${currentAqi} · ${planBand?.label?.toUpperCase()}`}</Pill>
          <h2>Small changes, thoughtful care.</h2>
          <p>{air.status === 'error' ? air.error : `${conditionDetail} ${tomorrowAqi === null ? '' : `Tomorrow forecast AQI: ${tomorrowAqi}.`} Model estimates are not official advisories.`}</p>
        </div>
        <div className="plan-actions">
          <button className="outline-btn" onClick={() => window.print()}>Print plan</button>
          <button className="primary-btn" onClick={sendPlan} disabled={publicDemo || emailBusy || air.status === 'loading'}>{publicDemo ? 'Email disabled in public demo' : emailBusy ? 'Sending full plan…' : 'Email full plan to parents'}</button>
        </div>
      </div>
      {publicDemo && <div className="note-box" role="status">Email sending is disabled in the public demo. The complete plan is available on this page.</div>}
      {(emailResult || emailError) && <p className={`plan-email-status${emailError ? ' error' : ''}`} role={emailError ? 'alert' : 'status'}>{emailError || emailResult}</p>}

      <div className="plan-list">
        {plans.map((p) => (
          <article className="plan-row" key={p.title}>
            <div className={`action-icon ${p.tone}`}>{p.icon}</div>
            <div className="plan-main">
              <div className="plan-title"><h2>{p.title}</h2><Pill tone={p.tone}>{p.status}</Pill></div>
              <p>{p.reason}</p>
              <span className="plan-data">◉ &nbsp;{p.data}</span>
            </div>
            <button className="circle-arrow" aria-label={`More about ${p.title}`}>↗</button>
          </article>
        ))}
      </div>
      <p className="disclaimer">Forecast source: <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a> and <a href="https://ads.atmosphere.copernicus.eu/" target="_blank" rel="noreferrer">Copernicus CAMS</a>. Regional model estimates only, not an official advisory. Confirm local conditions before acting; this is not medical advice.</p>
    </>
  );
}
