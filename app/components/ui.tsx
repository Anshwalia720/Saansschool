// Small UI pieces shared by more than one page
import { addDays, fmt, series } from '../lib/data';

export function Pill({ children, tone = 'green' }: { children: React.ReactNode; tone?: string }) {
  return <span className={`pill ${tone}`}>{children}</span>;
}

export function PageIntro({ title, text }: { title: string; text: string }) {
  return (
    <section className="page-intro">
      <div className="eyebrow">SAANSSCHOOL <span className="live-dot" /> DEMO MODE</div>
      <h1>{title}</h1>
      <p>{text}</p>
    </section>
  );
}

function smooth(pts: [number, number][]) {
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x} ${c1y} ${c2x} ${c2y} ${p2[0]} ${p2[1]}`;
  }
  return d;
}

// Used on Dashboard and Air quality pages
export function TrendChart({ now, values = series, rangeDays = 7 }: { now: Date | null; values?: number[]; rangeDays?: number }) {
  if (values.length < 2) {
    return <div className="chart-empty" role="status">There isn’t enough air quality history to draw this chart yet.</div>;
  }
  const W = 700, H = 200;
  const safeValues = values;
  const minValue = Math.min(...safeValues) - 20;
  const maxValue = Math.max(...safeValues) + 20;
  const pts = safeValues.map((v, i) => [(i / (safeValues.length - 1)) * W, ((maxValue - v) / (maxValue - minValue)) * H] as [number, number]);
  const line = smooth(pts);
  const lastTop = ((maxValue - safeValues[safeValues.length - 1]) / (maxValue - minValue)) * 100;
  return (
    <div className="chart-wrap">
      <div className="chart-labels"><span>200</span><span>150</span><span>100</span><span>50</span></div>
      <div className="chart-area">
        <div className="plot">
          <div className="chart-grid"><i /><i /><i /><i /></div>
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label="Demo AQI trend over seven days">
            <defs>
              <linearGradient id="trend-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#4a52c9" stopOpacity=".28" />
                <stop offset="1" stopColor="#4a52c9" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={`${line} L${W} ${H} L0 ${H}Z`} fill="url(#trend-fill)" />
            <path d={line} fill="none" stroke="#2b2f77" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>
          <span className="plot-dot" style={{ left: '100%', top: `${lastTop}%` }} />
        </div>
        <div className="chart-days">
          {safeValues.map((_, i) => {
            const labelStep = Math.max(1, Math.ceil((safeValues.length - 1) / 6));
            const showLabel = safeValues.length <= 8 || i === 0 || i === safeValues.length - 1 || i % labelStep === 0;
            const dateOffset = -rangeDays + Math.round((i / (safeValues.length - 1)) * rangeDays);
            return <span key={i}>{!showLabel ? '' : i === safeValues.length - 1 ? 'Today' : now ? fmt(addDays(now, dateOffset), rangeDays === 7 ? { weekday: 'short' } : { day: 'numeric', month: 'short' }) : ''}</span>;
          })}
        </div>
      </div>
    </div>
  );
}
