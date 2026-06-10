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

const PGS_COLORS = {
  low: "#FFF7BC",
  medium: "#FEC44F",
  high: "#D95F0E",
  critical: "#8C2D04",
} as const;

export function getPGSColor(pgs: number): string {
  if (pgs >= 70) return PGS_COLORS.critical;
  if (pgs >= 50) return PGS_COLORS.high;
  if (pgs >= 30) return PGS_COLORS.medium;
  return PGS_COLORS.low;
}

export function getPGSBadgeClass(pgs: number): string {
  if (pgs >= 70) return "text-stone-50 bg-[#8C2D04]";
  if (pgs >= 50) return "text-white bg-[#D95F0E]";
  if (pgs >= 30) return "text-stone-800 bg-[#FEC44F]";
  return "text-stone-800 bg-[#FFF7BC]";
}

export { PGS_COLORS };

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
    drivers.push("Longer travel time to clinics than 70% of counties.");
  }
  if (norm.facilityDensity > 0.7) {
    drivers.push("Fewer health facilities per person compared to other counties");
  }
  if (norm.poverty > 0.7) {
    drivers.push("Poverty rate is higher than 70% of counties - harder for families to afford care");
  }
  if (norm.populationPressure > 0.7) {
    drivers.push("More people sharing each health facility than 70% of counties");
  }
  if (norm.travelTime <= 0.7 && norm.facilityDensity <= 0.7 && norm.poverty <= 0.7 && norm.populationPressure <= 0.7) {
    drivers.push("All measures are within typical range compared to other counties.");
  }

  return {
    countyCode,
    pgs,
    components: norm,
    drivers,
  };
}
