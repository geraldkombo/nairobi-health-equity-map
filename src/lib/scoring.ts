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

export function pgsPlainLanguage(pgs: number): string {
  if (pgs >= 70) return `Severe gap - ${pgs} out of 100. Residents face extreme barriers: long travel times to the nearest clinic, high poverty rates, or too few facilities for the population.`;
  if (pgs >= 50) return `Serious gap - ${pgs} out of 100. Many residents face long travel times to clinics, poverty, or overcrowded facilities.`;
  if (pgs >= 30) return `Noticeable gap - ${pgs} out of 100. Some residents face moderate barriers to health care access.`;
  return `Reasonable access - ${pgs} out of 100. Most residents can reach a clinic without extreme difficulty.`;
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
    drivers.push("Residents travel farther to reach a clinic than in most counties. Long travel times mean delays in emergency care and fewer routine checkups.");
  }
  if (norm.facilityDensity > 0.7) {
    drivers.push("Very few clinics for the number of people living here compared to most counties. Each facility is stretched thin, making it harder for residents to get care.");
  }
  if (norm.poverty > 0.7) {
    drivers.push("More families live below the poverty line than in most counties. When every shilling counts, transport costs and clinic fees become barriers to seeking care.");
  }
  if (norm.populationPressure > 0.7) {
    drivers.push("Each health facility serves far more people than in most counties. More patients per clinic means longer queues and less time with each health worker.");
  }
  if (norm.travelTime <= 0.7 && norm.facilityDensity <= 0.7 && norm.poverty <= 0.7 && norm.populationPressure <= 0.7) {
    drivers.push("No single factor stands out as extreme. All measures are in line with typical conditions across Kenyan counties.");
  }

  return {
    countyCode,
    pgs,
    components: norm,
    drivers,
  };
}
