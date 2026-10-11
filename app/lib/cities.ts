export interface City {
  name: string;
  lat: number;
  lon: number;
  demoPm25: number;
  demoPm10: number;
}

export const CITIES: City[] = [
  { name: 'Bengaluru, Karnataka', lat: 12.97, lon: 77.59, demoPm25: 64, demoPm10: 108 },
  { name: 'New Delhi, Delhi', lat: 28.61, lon: 77.21, demoPm25: 91, demoPm10: 184 },
  { name: 'Mumbai, Maharashtra', lat: 19.08, lon: 72.88, demoPm25: 38, demoPm10: 76 },
  { name: 'Pune, Maharashtra', lat: 18.52, lon: 73.86, demoPm25: 31, demoPm10: 68 },
  { name: 'Chennai, Tamil Nadu', lat: 13.08, lon: 80.27, demoPm25: 27, demoPm10: 57 },
  { name: 'Kolkata, West Bengal', lat: 22.57, lon: 88.36, demoPm25: 72, demoPm10: 139 },
];

export const DEFAULT_CITY = CITIES[0];
export const CITY_STORAGE_KEY = 'saansschool-city';
