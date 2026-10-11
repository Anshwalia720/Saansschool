// import AppShell from '../app-shell';
// export default function DashboardPage() { return <AppShell />; }

// import { Dashboard } from '../views';

// export default function DashboardPage() {
//   return <Dashboard />;
// }


// 'use client';

// import Link from 'next/link';
// import { useState } from 'react';
// import { addDays, band, greeting, longDate, TODAY_AQI, TOMORROW_AQI } from '../lib/data';
// import { useNow } from '../lib/use-now';
// import { Pill, TrendChart } from '../components/ui';

// function Action({ title, status, tone, icon, detail }: { title: string; status: string; tone: string; icon: string; detail: string }) {
//   const [open, setOpen] = useState(false);
//   return (
//     <article className="action-card">
//       <div className={`action-icon ${tone}`}>{icon}</div>
//       <div className="action-content">
//         <div className="action-title"><b>{title}</b><Pill tone={tone}>{status}</Pill></div>
//         <p>{detail}</p>
//         <button onClick={() => setOpen(!open)} className="detail-toggle" aria-expanded={open}>
//           {open ? 'Hide reason −' : 'Why this action? +'}
//         </button>
//         {open && (
//           <div className="action-reason">
//             Based on the demo AQI outlook and SaansSchool sample decision rules. Recheck local conditions before making school decisions.
//           </div>
//         )}
//       </div>
//     </article>
//   );
// }

// export default function DashboardPage() {
//   const now = useNow();
//   const g = greeting(now);
//   const tomorrow = now ? addDays(now, 1) : null;
//   const todayBand = band(TODAY_AQI);
//   const tomorrowBand = band(TOMORROW_AQI);
//   const markerPct = Math.min(TODAY_AQI, 500) / 5;

//   return (
//     <>
//       <section className="welcome-row">
//         <div>
//           <div className="eyebrow">{now ? longDate(now).toUpperCase() : ''} <span className="live-dot" /> DEMO DATA</div>
//           <h1>{g.text}, Abhinav Ruhela <span className="wave">{g.icon}</span></h1>
//           <p>Here’s the air quality outlook for your school community.</p>
//         </div>
//         <button className="outline-btn" onClick={() => window.print()}>↗ Export summary</button>
//       </section>

//       <div className="notice">
//         <span className="notice-icon">✳</span>
//         <div>
//           <b>Today needs a little extra care</b>
//           <p>Air quality is elevated around your school. A few thoughtful changes can make a real difference.</p>
//         </div>
//         <Link href="/tomorrow-plan" className="notice-link">View school plan <span>→</span></Link>
//       </div>

//       <div className="metrics-grid">
//         <article className="metric-card aqi-card">
//           <div className="metric-top"><span>Current AQI</span><span className="mini-icon">◉</span></div>
//           <div className="aqi-number">{TODAY_AQI} <Pill tone={todayBand.tone}>{todayBand.label}</Pill></div>
//           <p className="muted">Air quality index <span className="trend-up">↗ 8</span> vs yesterday</p>
//           <div className="scale"><i style={{ left: `${markerPct}%` }} /></div>
//           <div className="scale-labels"><span>0</span><span>100</span><span>200</span><span>300</span><span>400</span><span>500</span></div>
//         </article>

//         <article className="metric-card">
//           <div className="metric-top"><span>PM2.5</span><span className="metric-symbol teal">◌</span></div>
//           <div className="metric-reading">64 <small>µg/m³</small></div>
//           <p className="muted">Fine particles <span className="descriptor">Elevated</span></p>
//           <div className="tiny-track"><i style={{ width: '64%' }} /></div>
//           <p className="reference">WHO guideline · 15 µg/m³</p>
//         </article>

//         <article className="metric-card">
//           <div className="metric-top"><span>PM10</span><span className="metric-symbol gold">◌</span></div>
//           <div className="metric-reading">108 <small>µg/m³</small></div>
//           <p className="muted">Coarse particles <span className="descriptor">Moderate</span></p>
//           <div className="tiny-track gold-track"><i style={{ width: '54%' }} /></div>
//           <p className="reference">WHO guideline · 45 µg/m³</p>
//         </article>

//         <article className="metric-card location-card">
//           <div className="metric-top"><span>School location</span><span className="metric-symbol">⌖</span></div>
//           <div className="location-name">Greenfield<br />Public School</div>
//           <p className="muted">Bengaluru, Karnataka</p>
//           <div className="location-foot"><span>⌖ &nbsp;Indiranagar, 560038</span><Link href="/settings">Change →</Link></div>
//         </article>
//       </div>

//       <div className="content-grid">
//         <article className="panel chart-panel">
//           <div className="panel-heading">
//             <div><h2>Air quality trend</h2><p>Daily AQI · last 7 days <span className="demo-label">DEMO</span></p></div>
//             <span className="select-like">Last 7 days</span>
//           </div>
//           <TrendChart now={now} />
//           <div className="chart-foot">
//             <span><i className="legend-dot" /> AQI</span>
//             <span>Source: Sample data · Updated 8:30 am</span>
//           </div>
//         </article>

//         <article className="panel outlook">
//           <div className="panel-heading">
//             <div>
//               <h2>Tomorrow’s outlook</h2>
//               <p>{tomorrow ? longDate(tomorrow) : ''} <span className="demo-label">DEMO FORECAST</span></p>
//             </div>
//             <span className="sun-cloud">☁</span>
//           </div>
//           <div className="outlook-aqi"><span>Expected AQI</span><b>{TOMORROW_AQI}</b><Pill tone={tomorrowBand.tone}>{tomorrowBand.label}</Pill></div>
//           <div className="outlook-rule" />
//           <div className="outlook-advice">
//             <span className="advice-icon">↗</span>
//             <div><b>Move morning assembly indoors</b><p>Outdoor exposure may be uncomfortable for sensitive children.</p></div>
//           </div>
//           <Link href="/tomorrow-plan" className="text-link">See all recommendations <span>→</span></Link>
//         </article>
//       </div>

//       <div className="section-heading">
//         <div><h2>Today’s school actions</h2><p>Simple steps for a safer school day</p></div>
//         <Link href="/tomorrow-plan" className="text-link">Full action plan →</Link>
//       </div>
//       <div className="actions-grid">
//         <Action title="Morning assembly" status="Move indoors" tone="amber" icon="⌂" detail="Choose a well-ventilated hall and keep the assembly brief." />
//         <Action title="Outdoor PT" status="Modify activity" tone="blue" icon="↗" detail="Keep exertion light. Offer an indoor alternative for students." />
//         <Action title="Children with asthma" status="Extra care" tone="rose" icon="♡" detail="Remind families to follow their existing care plans." />
//       </div>
//       <p className="disclaimer">SaansSchool uses sample data for demonstration. Recommendations are general guidance, not medical advice.</p>
//     </>
//   );
// }







'use client';

import Link from 'next/link';
import { useState } from 'react';
import { addDays, band, dateKey, fmt, greeting, longDate } from '../lib/data';
import { avg24h, dailyAqi, indiaAqi } from '../lib/aqi';
import { useNow } from '../lib/use-now';
import { useAir } from '../lib/use-air';
import { useCity } from '../lib/use-city';
import { Pill, TrendChart } from '../components/ui';

function Action({ title, status, tone, icon, detail }: { title: string; status: string; tone: string; icon: string; detail: string }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="action-card">
      <div className={`action-icon ${tone}`}>{icon}</div>
      <div className="action-content">
        <div className="action-title"><b>{title}</b><Pill tone={tone}>{status}</Pill></div>
        <p>{detail}</p>
        <button onClick={() => setOpen(!open)} className="detail-toggle" aria-expanded={open}>
          {open ? 'Hide reason −' : 'Why this action? +'}
        </button>
        {open && (
          <div className="action-reason">
            Based on the demo AQI outlook and SaansSchool sample decision rules. Recheck local conditions before making school decisions.
          </div>
        )}
      </div>
    </article>
  );
}

export default function DashboardPage() {
  const now = useNow();
  const [chartRange, setChartRange] = useState(7);
  const g = greeting(now);
  const tomorrow = now ? addDays(now, 1) : null;

  // Fetch modelled air quality for the location selected in Settings.
  const [city] = useCity();
  const air = useAir(city.lat, city.lon);
  const avg = air.data ? avg24h(air.data.hourly, air.data.nowIndex) : null;
  const result = avg ? indiaAqi(avg.pm25, avg.pm10) : null;

  const aqi = result?.aqi ?? null;
  const aqiBand = aqi !== null ? band(aqi) : null;
  const markerPct = aqi !== null ? Math.min(aqi, 500) / 5 : 0;

  const pm25 = avg?.pm25 ?? null;
  const pm10 = avg?.pm10 ?? null;
  const pm25Label = result?.pm25Index != null ? band(result.pm25Index).label : '';
  const pm10Label = result?.pm10Index != null ? band(result.pm10Index).label : '';
  const pm25Width = pm25 !== null ? Math.min(100, (pm25 / 120) * 100) : 0;
  const pm10Width = pm10 !== null ? Math.min(100, (pm10 / 350) * 100) : 0;

  const statusLabel = air.status === 'ready' ? 'MODEL ESTIMATE' : air.status === 'loading' ? 'LOADING…' : 'DATA UNAVAILABLE';
  const updated = air.data ? fmt(new Date(air.data.fetchedAt), { hour: '2-digit', minute: '2-digit', hour12: true }) : '';
  const todayKey = now ? dateKey(now) : '';
  const tomorrowKey = tomorrow ? dateKey(tomorrow) : '';
  const dailyReadings = air.data ? dailyAqi(air.data.hourly.time, air.data.hourly) : [];
  const chartValues = dailyReadings.filter((point) => point.date <= todayKey).slice(-chartRange).map((point) => point.aqi);
  const tomorrowAqi = dailyReadings.find((point) => point.date === tomorrowKey)?.aqi ?? null;
  const tomorrowBand = tomorrowAqi === null ? null : band(tomorrowAqi);
  const recommendation = aqi !== null && aqi > 200
    ? { title: 'Keep outdoor activities indoors', detail: 'The sample AQI is high. Review local conditions before outdoor activities.' }
    : { title: 'Move morning assembly indoors', detail: 'Outdoor exposure may be uncomfortable for sensitive children.' };
  const assemblyAction = aqi === null
    ? { status: 'Check conditions', tone: 'blue', detail: 'Review local air quality before deciding on an outdoor assembly.' }
    : aqi > 100
      ? { status: 'Move indoors', tone: 'amber', detail: 'Consider a well-ventilated hall based on the model estimate.' }
      : { status: 'As planned', tone: 'green', detail: 'Keep the usual plan and check local conditions before assembly.' };
  const ptAction = aqi === null
    ? { status: 'Check conditions', tone: 'blue', detail: 'Review local air quality before deciding on outdoor PT.' }
    : aqi > 200
    ? { status: 'Indoor activity', tone: 'rose', detail: 'Use an indoor alternative based on the current model estimate.' }
    : aqi > 100
      ? { status: 'Modify activity', tone: 'blue', detail: 'Keep exertion light and offer an indoor option for students.' }
      : { status: 'As planned', tone: 'green', detail: 'Continue as planned and remain attentive to student comfort.' };

  return (
    <>
      <section className="welcome-row">
        <div>
          <div className="eyebrow">{now ? longDate(now).toUpperCase() : ''} <span className="live-dot" /> {statusLabel}</div>
          <h1>{g.text}, Abhinav Ruhela <span className="wave">{g.icon}</span></h1>
          <p>Here’s the air quality outlook for your school community.</p>
        </div>
        <div className="dashboard-controls">
          <button className="outline-btn" onClick={air.refetch} aria-label="Refresh air quality data">↻ Refresh data</button>
          <button className="outline-btn" onClick={() => window.print()}>↗ Export summary</button>
        </div>
      </section>

      {air.status === 'loading' && (
        <div className="notice" role="status"><span className="notice-icon">◷</span><div><b>Loading air quality model data</b><p>Fetching hourly PM2.5 and PM10 estimates for {city.name}.</p></div></div>
      )}
      {air.status === 'error' && (
        <div className="notice error" role="alert"><span className="notice-icon">!</span><div><b>Could not load air quality data</b><p>{air.error}</p></div><button className="outline-btn" style={{ marginLeft: 'auto' }} onClick={air.refetch}>Try again</button></div>
      )}

      <div className="notice">
        <span className="notice-icon">✳</span>
        <div>
          <b>{aqiBand ? `${aqiBand.label} air quality estimate at your school` : 'Air quality summary is unavailable'}</b>
          <p>{aqi !== null && aqi > 200 ? 'Consider indoor alternatives and check local conditions before outdoor activities.' : 'Use this model estimate as planning context, and check local conditions before making changes.'}</p>
        </div>
        <Link href="/tomorrow-plan" className="notice-link">View school plan <span>→</span></Link>
      </div>

      <div className="metrics-grid">
        <article className="metric-card aqi-card">
          <div className="metric-top"><span>Current AQI</span><span className="mini-icon">◉</span></div>
          <div className="aqi-number">
            {aqi ?? '—'} {aqiBand && <Pill tone={aqiBand.tone}>{aqiBand.label}</Pill>}
          </div>
          <p className="muted">{result ? `24-hour average · main pollutant ${result.dominant}` : 'No reading available'}</p>
          <div className="scale"><i style={{ left: `${markerPct}%` }} /></div>
          <div className="scale-labels"><span>0</span><span>100</span><span>200</span><span>300</span><span>400</span><span>500</span></div>
        </article>

        <article className="metric-card">
          <div className="metric-top"><span>PM2.5</span><span className="metric-symbol teal">◌</span></div>
          <div className="metric-reading">{pm25 !== null ? Math.round(pm25) : '—'} <small>µg/m³</small></div>
          <p className="muted">Fine particles <span className="descriptor">{pm25Label}</span></p>
          <div className="tiny-track"><i style={{ width: `${pm25Width}%` }} /></div>
          <p className="reference">WHO guideline · 15 µg/m³</p>
        </article>

        <article className="metric-card">
          <div className="metric-top"><span>PM10</span><span className="metric-symbol gold">◌</span></div>
          <div className="metric-reading">{pm10 !== null ? Math.round(pm10) : '—'} <small>µg/m³</small></div>
          <p className="muted">Coarse particles <span className="descriptor">{pm10Label}</span></p>
          <div className="tiny-track gold-track"><i style={{ width: `${pm10Width}%` }} /></div>
          <p className="reference">WHO guideline · 45 µg/m³</p>
        </article>

        <article className="metric-card location-card">
          <div className="metric-top"><span>School location</span><span className="metric-symbol">⌖</span></div>
          <div className="location-name">Greenfield<br />Public School</div>
          <p className="muted">{city.name}</p>
          <div className="location-foot">
            <span>⌖ &nbsp;{city.lat.toFixed(2)}°N, {city.lon.toFixed(2)}°E{updated && ` · ${updated}`}</span>
            <Link href="/settings">Change →</Link>
          </div>
        </article>
      </div>

      <div className="content-grid">
        <article className="panel chart-panel">
          <div className="panel-heading">
            <div><h2>Air quality trend</h2><p>Daily estimated AQI · last {chartRange} days</p></div>
            <select className="select-like" aria-label="Chart date range" value={chartRange} onChange={(event) => setChartRange(Number(event.target.value))}>
              <option value={7}>Last 7 days</option><option value={30}>Last 30 days</option>
            </select>
          </div>
          <TrendChart now={now} values={chartValues} rangeDays={chartRange} />
          <div className="chart-foot">
            <span><i className="legend-dot" /> AQI</span>
            <span>Open-Meteo · CAMS model · Updated {updated || '—'}</span>
          </div>
        </article>

        <article className="panel outlook">
          <div className="panel-heading">
            <div>
              <h2>Tomorrow’s outlook</h2>
              <p>{tomorrow ? longDate(tomorrow) : ''} <span className="demo-label">DEMO FORECAST</span></p>
            </div>
            <span className="sun-cloud">☁</span>
          </div>
          <div className="outlook-aqi"><span>Estimated AQI</span><b>{tomorrowAqi ?? '—'}</b>{tomorrowBand && <Pill tone={tomorrowBand.tone}>{tomorrowBand.label}</Pill>}</div>
          <div className="outlook-rule" />
          <div className="outlook-advice">
            <span className="advice-icon">↗</span>
            <div><b>{recommendation.title}</b><p>{recommendation.detail}</p></div>
          </div>
          <Link href="/tomorrow-plan" className="text-link">See all recommendations <span>→</span></Link>
        </article>
      </div>

      <div className="section-heading">
        <div><h2>Today’s school actions</h2><p>Simple steps for a safer school day</p></div>
        <Link href="/tomorrow-plan" className="text-link">Full action plan →</Link>
      </div>
      <div className="actions-grid">
        <Action title="Morning assembly" status={assemblyAction.status} tone={assemblyAction.tone} icon="⌂" detail={assemblyAction.detail} />
        <Action title="Outdoor PT" status={ptAction.status} tone={ptAction.tone} icon="↗" detail={ptAction.detail} />
        <Action title="Children with asthma" status="Extra care" tone="rose" icon="♡" detail="Remind families to follow their existing care plans." />
      </div>
      <p className="disclaimer">Source: <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a> and <a href="https://ads.atmosphere.copernicus.eu/" target="_blank" rel="noreferrer">Copernicus Atmosphere Monitoring Service (CAMS)</a>. These are regional model estimates, not school-site sensor measurements. AQI is calculated from PM2.5/PM10 with CPCB breakpoints. Check official local advisories before acting; guidance is not medical advice.</p>
    </>
  );
}
