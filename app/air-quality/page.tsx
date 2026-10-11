// import AppShell from '../app-shell';
// export default function AirQualityPage() { return <AppShell />; }


// import { AirQuality } from '../views';

// export default function AirQualityPage() {
//   return <AirQuality />;
// }


'use client';

import { band, dateKey, fmt } from '../lib/data';
import { avg24h, dailyAqi, indiaAqi } from '../lib/aqi';
import { useNow } from '../lib/use-now';
import { useAir } from '../lib/use-air';
import { useCity } from '../lib/use-city';
import { PageIntro, Pill, TrendChart } from '../components/ui';

function Pollutant({ name, desc, value, unit, tag, tone }: { name: string; desc: string; value: string; unit: string; tag: string; tone: string }) {
  return (
    <div className="pollutant-row">
      <div><b>{name}</b><small>{desc}</small></div>
      <strong>{value} <small>{unit}</small></strong>
      <Pill tone={tone}>{tag}</Pill>
    </div>
  );
}

export default function AirQualityPage() {
  const now = useNow();
  const [city] = useCity();
  const air = useAir(city.lat, city.lon);
  const avg = air.data ? avg24h(air.data.hourly, air.data.nowIndex) : null;
  const readings = avg ? indiaAqi(avg.pm25, avg.pm10) : null;
  const aqiBand = readings ? band(readings.aqi) : null;
  const todayKey = now ? dateKey(now) : '';
  const chartValues = air.data ? dailyAqi(air.data.hourly.time, air.data.hourly).filter((point) => point.date <= todayKey).slice(-7).map((point) => point.aqi) : [];
  const updated = air.data ? fmt(new Date(air.data.fetchedAt), { hour: '2-digit', minute: '2-digit', hour12: true }) : '—';
  const bands = [
    ['0–50', 'Good', 'green'], ['51–100', 'Satisfactory', 'teal'], ['101–200', 'Moderate', 'amber'],
    ['201–300', 'Poor', 'orange'], ['301–400', 'Very poor', 'rose'], ['401+', 'Severe', 'maroon'],
  ];

  return (
    <>
      <PageIntro title="Air quality, made understandable" text={`Air quality model estimates for ${city.name}, with context that helps you plan.`} />
      {air.status === 'loading' && <div className="notice" role="status"><span className="notice-icon">◷</span><div><b>Loading Open-Meteo data</b><p>Fetching hourly PM2.5 and PM10 estimates.</p></div></div>}
      {air.status === 'error' && <div className="notice error" role="alert"><span className="notice-icon">!</span><div><b>Could not load air quality data</b><p>{air.error}</p></div><button className="outline-btn" style={{ marginLeft: 'auto' }} onClick={air.refetch}>Try again</button></div>}
      <div className="notice">
        <span className="notice-icon">◉</span>
        <div>
          <b>{aqiBand ? `${aqiBand.label} air quality estimate` : 'AQI unavailable'} {aqiBand && <Pill tone={aqiBand.tone}>AQI {readings?.aqi}</Pill>}</b>
          <p>{readings ? `24-hour average using ${readings.dominant} as the dominant pollutant.` : 'A 24-hour PM2.5/PM10 reading is not available yet.'}</p>
        </div>
      </div>

      <div className="content-grid">
        <article className="panel chart-panel">
          <div className="panel-heading">
            <div><h2>Weekly AQI history</h2><p>Daily model estimates · {city.name}</p></div>
            <Pill>MODEL DATA</Pill>
          </div>
          <TrendChart now={now} values={chartValues} rangeDays={7} />
          <div className="chart-foot"><span>Source: Open-Meteo Air Quality API</span><span>Updated {updated}</span></div>
        </article>

        <article className="panel pollutant-panel">
          <h2>What’s in the air?</h2>
          <p className="subtext">Pollutant levels near your school</p>
          <Pollutant name="PM2.5" desc="24-hour fine-particle estimate" value={avg ? String(Math.round(avg.pm25)) : '—'} unit="µg/m³" tag={readings ? band(readings.pm25Index).label : 'Unavailable'} tone={readings ? band(readings.pm25Index).tone : 'blue'} />
          <Pollutant name="PM10" desc="24-hour coarse-particle estimate" value={avg ? String(Math.round(avg.pm10)) : '—'} unit="µg/m³" tag={readings ? band(readings.pm10Index).label : 'Unavailable'} tone={readings ? band(readings.pm10Index).tone : 'blue'} />
          <div className="source-box">ⓘ &nbsp;Source: <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a> and <a href="https://ads.atmosphere.copernicus.eu/" target="_blank" rel="noreferrer">Copernicus CAMS</a>. These model estimates are not readings from a school-site sensor.</div>
        </article>
      </div>

      <div className="section-heading"><div><h2>Reading the AQI</h2><p>Higher numbers mean more caution may be needed.</p></div></div>
      <div className="aqi-bands">
        {bands.map(([r, label, tone]) => (
          <div className={`band ${tone}`} key={label}><span className="band-dot" /><b>{r}</b><span>{label}</span></div>
        ))}
      </div>
    </>
  );
}
