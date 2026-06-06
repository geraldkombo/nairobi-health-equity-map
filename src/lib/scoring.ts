export interface PGSWeights {
  accessibility: number;
  populationPressure: number;
  vulnerability: number;
}

export const DEFAULT_WEIGHTS: PGSWeights = {
  accessibility: 0.4,
  populationPressure: 0.3,
  vulnerability: 0.3,
};

export interface CountyScore {
  countyCode: string;
  pgs: number;
  components: {
    travelTime: number;
    poverty: number;
    populationPressure: number;
    facilityDensity: number;
  };
  drivers: string[];
}

export function computePGS(
  countyCode: string,
  norm: {
    travelTime: number;
    poverty: number;
    populationPressure: number;
    facilityDensity: number;
  },
  weights: PGSWeights = DEFAULT_WEIGHTS,
): CountyScore {
  const accessibility = norm.travelTime * 0.6 + norm.facilityDensity * 0.4;
  const vulnerability = norm.poverty;
  const popPressure = norm.populationPressure;

  const rawPgs =
    accessibility * weights.accessibility +
    vulnerability * weights.vulnerability +
    popPressure * weights.populationPressure;

  const pgs = Math.round(rawPgs * 100);

  const drivers: string[] = [];
  if (norm.travelTime > 0.7) {
    drivers.push("Long travel time proxy is in the top 30% of counties");
  }
  if (norm.facilityDensity > 0.7) {
    drivers.push("Facility density proxy is below national median");
  }
  if (norm.poverty > 0.7) {
    drivers.push("Poverty proxy is in the top 30% of counties");
  }
  if (norm.populationPressure > 0.7) {
    drivers.push("Population pressure is in the top 30% of counties");
  }
  if (norm.travelTime <= 0.7 && norm.facilityDensity <= 0.7 && norm.poverty <= 0.7 && norm.populationPressure <= 0.7) {
    drivers.push("All indicator proxies are within typical county range");
  }

  return {
    countyCode,
    pgs,
    components: norm,
    drivers,
  };
}
