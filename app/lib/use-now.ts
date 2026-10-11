'use client';

import { useSyncExternalStore } from 'react';

// null on the server / first render, real Date after hydration (avoids mismatch errors)
let cachedNow: Date | null = null;
const getNow = () => (cachedNow ??= new Date());
const subscribe = () => () => {};

export function useNow() {
  return useSyncExternalStore(subscribe, getNow, () => null);
}