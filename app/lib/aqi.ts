export interface HourlyPollutants {
  pm25: number[];
  pm10: number[];
}

export interface DailyAqiPoint {
  date: string;
  aqi: number;
}

export function avg24h(hourly: HourlyPollutants, nowIndex: number) {
  const start = Math.max(0, nowIndex - 23);
  const pm25 = hourly.pm25.slice(start, nowIndex + 1);
  const pm10 = hourly.pm10.slice(start, nowIndex + 1);
  if (!pm25.length || !pm10.length) return null;
  return {
    pm25: pm25.reduce((sum, value) => sum + value, 0) / pm25.length,
    pm10: pm10.reduce((sum, value) => sum + value, 0) / pm10.length,
  };
}

function pollutantAqi(value: number, ranges: [number, number, number, number][]) {
  const range = ranges.find(([, high]) => value <= high) ?? ranges[ranges.length - 1];
  const [low, high, aqiLow, aqiHigh] = range;
  return Math.round(((aqiHigh - aqiLow) / (high - low)) * (value - low) + aqiLow);
}

export function indiaAqi(pm25: number, pm10: number) {
  const pm25Index = pollutantAqi(pm25, [
    [0, 30, 0, 50], [30, 60, 51, 100], [60, 90, 101, 200],
    [90, 120, 201, 300], [120, 250, 301, 400],
  ]);
  const pm10Index = pollutantAqi(pm10, [
    [0, 50, 0, 50], [50, 100, 51, 100], [100, 250, 101, 200],
    [250, 350, 201, 300], [350, 430, 301, 400],
  ]);
  return { aqi: Math.max(pm25Index, pm10Index), pm25Index, pm10Index, dominant: pm25Index >= pm10Index ? 'PM2.5' : 'PM10' };
}

export function dailyAqi(time: string[], hourly: HourlyPollutants): DailyAqiPoint[] {
  const groups = new Map<string, { pm25: number[]; pm10: number[] }>();
  time.forEach((timestamp, index) => {
    const date = timestamp.slice(0, 10);
    const values = groups.get(date) ?? { pm25: [], pm10: [] };
    if (Number.isFinite(hourly.pm25[index]) && Number.isFinite(hourly.pm10[index])) {
      values.pm25.push(hourly.pm25[index]);
      values.pm10.push(hourly.pm10[index]);
    }
    groups.set(date, values);
  });

  return Array.from(groups, ([date, values]) => {
    const pm25 = values.pm25.reduce((sum, value) => sum + value, 0) / values.pm25.length;
    const pm10 = values.pm10.reduce((sum, value) => sum + value, 0) / values.pm10.length;
    return { date, aqi: indiaAqi(pm25, pm10).aqi };
  }).filter((point) => Number.isFinite(point.aqi));
}
