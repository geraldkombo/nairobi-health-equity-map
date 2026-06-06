export interface NormalizedIndicators {
  travelTime: number;
  poverty: number;
  populationPressure: number;
  facilityDensity: number;
}

/** Absolute-threshold normalization using population-per-facility and facilities-per-capita metrics. */
export function normalizeCounty(
  raw: {
    travel_time_to_facility_proxy: number;
    poverty_proxy: number;
    population: number;
    facility_count: number;
  },
): NormalizedIndicators {
  const travelTime = Math.min(raw.travel_time_to_facility_proxy / 100, 1);
  const poverty = Math.min(raw.poverty_proxy / 100, 1);

  const facilities = Math.max(raw.facility_count, 1);
  const popPerFacility = raw.population / facilities;
  const populationPressure = Math.min(popPerFacility / 10000, 1);

  const facilitiesPer10k = (facilities / raw.population) * 10000;
  const facilityDensity = Math.max(1 - facilitiesPer10k / 4, 0);

  return {
    travelTime,
    poverty,
    populationPressure,
    facilityDensity,
  };
}
