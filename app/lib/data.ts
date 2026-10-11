// Shared data + helper functions (no React hooks here)

/* ---------- date helpers (real dates, India time) ---------- */
export const TZ = 'Asia/Kolkata';

export const fmt = (d: Date, o: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('en-GB', { timeZone: TZ, ...o }).format(d);

export const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 864e5);

export const longDate = (d: Date) =>
  `${fmt(d, { weekday: 'long' })}, ${fmt(d, { day: 'numeric', month: 'long', year: 'numeric' })}`;

export function dateKey(d: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(d);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? '';
  return `${part('year')}-${part('month')}-${part('day')}`;
}

export function greeting(now: Date | null) {
  if (!now) return { text: 'Hello', icon: '☀' };
  const h = Number(fmt(now, { hour: 'numeric', hour12: false })) % 24;
  if (h < 12) return { text: 'Good morning', icon: '☀' };
  if (h < 17) return { text: 'Good afternoon', icon: '☀' };
  return { text: 'Good evening', icon: '☾' };
}

/* ---------- AQI helpers (India CPCB bands) ---------- */
export function band(aqi: number) {
  if (aqi <= 50) return { label: 'Good', tone: 'green' };
  if (aqi <= 100) return { label: 'Satisfactory', tone: 'teal' };
  if (aqi <= 200) return { label: 'Moderate', tone: 'amber' };
  if (aqi <= 300) return { label: 'Poor', tone: 'orange' };
  if (aqi <= 400) return { label: 'Very poor', tone: 'rose' };
  return { label: 'Severe', tone: 'maroon' };
}

/* ---------- demo data ---------- */
export const series = [121, 148, 137, 159, 128, 151, 142]; // last 7 days, today is last
export const TODAY_AQI = series[series.length - 1];
export const TOMORROW_AQI = 156;
