export interface NormalizedIndicators {
  travelTime: number;
  poverty: number;
  populationPressure: number;
  facilityDensity: number;
}

export interface ZScoreParams {
  mean: number;
  sd: number;
}

const ABSOLUTE_MAX: Record<string, number> = {
  travel_time_to_facility_proxy: 100,
  poverty_proxy: 100,
  population: 5_000_000,
  facility_density_proxy: 1,
};

function clamp(v: number, max: number) {
  return Math.max(0, Math.min(1, v / max));
}

/** Absolute-threshold normalization (time-stable). */
export function normalizeCounty(
  raw: {
    travel_time_to_facility_proxy: number;
    poverty_proxy: number;
    population: number;
    facility_density_proxy: number;
  },
): NormalizedIndicators {
  return {
    travelTime: clamp(raw.travel_time_to_facility_proxy, ABSOLUTE_MAX.travel_time_to_facility_proxy),
    poverty: clamp(raw.poverty_proxy, ABSOLUTE_MAX.poverty_proxy),
    populationPressure: clamp(raw.population, ABSOLUTE_MAX.population),
    facilityDensity: 1 - clamp(raw.facility_density_proxy, ABSOLUTE_MAX.facility_density_proxy),
  };
}

/** Z-score normalization (statistically robust, shifts with national mean). */
export function normalizeCountyZScore(
  raw: {
    travel_time_to_facility_proxy: number;
    poverty_proxy: number;
    population: number;
    facility_density_proxy: number;
  },
  stats: {
    travelTime: ZScoreParams;
    poverty: ZScoreParams;
    population: ZScoreParams;
    facilityDensity: ZScoreParams;
  },
): NormalizedIndicators {
  const z = (val: number, mean: number, sd: number) => (sd === 0 ? 0 : (val - mean) / sd);
  const scaleTo01 = (z: number) => Math.max(0, Math.min(1, (z * 15 + 50) / 100));

  return {
    travelTime: scaleTo01(z(raw.travel_time_to_facility_proxy, stats.travelTime.mean, stats.travelTime.sd)),
    poverty: scaleTo01(z(raw.poverty_proxy, stats.poverty.mean, stats.poverty.sd)),
    populationPressure: scaleTo01(z(raw.population, stats.population.mean, stats.population.sd)),
    facilityDensity: 1 - scaleTo01(z(raw.facility_density_proxy, stats.facilityDensity.mean, stats.facilityDensity.sd)),
  };
}

/** Compute z-score params (mean, sd) across an array of values. */
export function computeZScoreParams(values: number[]): ZScoreParams {
  const n = values.length;
  if (n === 0) return { mean: 0, sd: 0 };
  const mean = values.reduce((s, v) => s + v, 0) / n;
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / n;
  return { mean, sd: Math.sqrt(variance) };
}
