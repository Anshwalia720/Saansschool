'use client';

import { useCallback, useEffect, useState } from 'react';
import type { HourlyPollutants } from './aqi';

interface AirQualityResponse {
  error?: boolean;
  reason?: string;
  hourly?: {
    time?: string[];
    pm2_5?: (number | null)[];
    pm10?: (number | null)[];
  };
}

export interface AirData {
  hourly: HourlyPollutants & { time: string[] };
  nowIndex: number;
  fetchedAt: number;
}

type AirState = {
  lat: number;
  lon: number;
  requestId: number;
  status: 'ready' | 'error';
  data: AirData | null;
  error: string | null;
};

async function requestAirQuality(lat: number, lon: number, signal: AbortSignal): Promise<AirData> {
  const response = await fetch(`/api/air-quality?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`, { signal, cache: 'no-store' });
  if (!response.ok) throw new Error(`Air quality request failed (${response.status}).`);

  const payload = await response.json() as AirQualityResponse;
  if (payload.error) throw new Error(payload.reason || 'Open-Meteo returned an error.');

  const time = payload.hourly?.time;
  const pm25Raw = payload.hourly?.pm2_5;
  const pm10Raw = payload.hourly?.pm10;
  if (!time?.length || !pm25Raw?.length || !pm10Raw?.length) {
    throw new Error('The air quality response did not include hourly PM2.5 and PM10 values.');
  }

  // Keep each timestamp aligned with its pair of pollutant values.
  const rows = time.flatMap((hour, index) => {
    const pm25 = pm25Raw[index];
    const pm10 = pm10Raw[index];
    return typeof pm25 === 'number' && Number.isFinite(pm25) && typeof pm10 === 'number' && Number.isFinite(pm10)
      ? [{ hour, pm25, pm10 }]
      : [];
  });
  if (!rows.length) throw new Error('Open-Meteo returned no usable pollutant readings.');

  const now = Date.now();
  let nowIndex = 0;
  for (let index = 0; index < rows.length; index += 1) {
    if (new Date(rows[index].hour).getTime() <= now) nowIndex = index;
    else break;
  }

  return {
    hourly: {
      time: rows.map((row) => row.hour),
      pm25: rows.map((row) => row.pm25),
      pm10: rows.map((row) => row.pm10),
    },
    nowIndex,
    fetchedAt: now,
  };
}

export function useAir(lat: number, lon: number) {
  const [refreshCount, setRefreshCount] = useState(0);
  const [state, setState] = useState<AirState | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    requestAirQuality(lat, lon, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setState({ lat, lon, requestId: refreshCount, status: 'ready', data, error: null });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setState({
          lat,
          lon,
          requestId: refreshCount,
          status: 'error',
          data: null,
          error: error instanceof Error ? error.message : 'Unable to load air quality data.',
        });
      });
    return () => controller.abort();
  }, [lat, lon, refreshCount]);

  useEffect(() => {
    const timer = window.setInterval(() => setRefreshCount((count) => count + 1), 15 * 60 * 1000);
    return () => window.clearInterval(timer);
  }, []);

  const refetch = useCallback(() => setRefreshCount((count) => count + 1), []);
  const sameLocation = state?.lat === lat && state.lon === lon;
  if (!sameLocation || state.requestId !== refreshCount) {
    const oldData = sameLocation ? state.data : null;
    return { status: 'loading' as const, data: oldData, error: null, refetch };
  }
  return { status: state.status, data: state.data, error: state.error, refetch };
}
