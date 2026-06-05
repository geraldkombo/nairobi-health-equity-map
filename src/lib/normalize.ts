export function minMaxNormalize(values: number[]): number[] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (max - min === 0) return values.map(() => 0.5);
  return values.map((v) => (v - min) / (max - min));
}

export function invertNormalized(values: number[]): number[] {
  return values.map((v) => 1 - v);
}

export interface NormalizedIndicators {
  travelTime: number;
  poverty: number;
  populationPressure: number;
  facilityDensity: number;
}

export function normalizeCounty(
  raw: {
    travel_time_to_facility_proxy: number;
    poverty_proxy: number;
    population: number;
    facility_density_proxy: number;
  },
  countyStats: {
    travelTimeRange: [number, number];
    povertyRange: [number, number];
    populationRange: [number, number];
    facilityDensityRange: [number, number];
  },
): NormalizedIndicators {
  const clamp = (v: number, lo: number, hi: number) => Math.max(0, Math.min(1, (v - lo) / (hi - lo || 1)));

  return {
    travelTime: clamp(raw.travel_time_to_facility_proxy, countyStats.travelTimeRange[0], countyStats.travelTimeRange[1]),
    poverty: clamp(raw.poverty_proxy, countyStats.povertyRange[0], countyStats.povertyRange[1]),
    populationPressure: clamp(raw.population, countyStats.populationRange[0], countyStats.populationRange[1]),
    facilityDensity: 1 - clamp(raw.facility_density_proxy, countyStats.facilityDensityRange[0], countyStats.facilityDensityRange[1]),
  };
}
