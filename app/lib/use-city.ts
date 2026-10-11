'use client';

import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { CITIES, CITY_STORAGE_KEY, DEFAULT_CITY, type City } from './cities';

const CITY_CHANGE_EVENT = 'saansschool-city-change';

function subscribe(onStoreChange: () => void) {
  window.addEventListener('storage', onStoreChange);
  window.addEventListener(CITY_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener('storage', onStoreChange);
    window.removeEventListener(CITY_CHANGE_EVENT, onStoreChange);
  };
}

function getSnapshot() {
  return window.localStorage.getItem(CITY_STORAGE_KEY) ?? DEFAULT_CITY.name;
}

function getServerSnapshot() {
  return DEFAULT_CITY.name;
}

export function useCity(): [City, (cityName: string) => void] {
  const savedName = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const city = CITIES.find((item) => item.name === savedName) ?? DEFAULT_CITY;
  const setCity = useCallback((cityName: string) => {
    if (!CITIES.some((item) => item.name === cityName)) return;
    window.localStorage.setItem(CITY_STORAGE_KEY, cityName);
    window.dispatchEvent(new Event(CITY_CHANGE_EVENT));
  }, []);

  useEffect(() => {
    let active=true;
    fetch('/api/school/settings').then(response=>response.ok?response.json():null).then(data=>{
      if(active&&typeof data?.city==='string') setCity(data.city);
    }).catch(()=>{});
    return ()=>{active=false;};
  },[setCity]);

  return [city, setCity];
}
