export interface CountyRecord {
  id: string;
  name: string;
}

export interface IndicatorRecord {
  county_code: string;
  county_name: string;
  population: number;
  poverty_proxy: number;
  facility_count: number;
  facility_density_proxy: number;
  travel_time_to_facility_proxy: number;
  immunization_coverage: number;
  skilled_birth_attendance: number;
  updated_at: string;
}

export interface FacilityFeature {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: { name: string | null; amenity?: string | null; type?: string; owner?: string; services?: string };
}

export interface FacilitiesGeoJSON {
  type: "FeatureCollection";
  features: FacilityFeature[];
}

export const REAL_SOURCES = {
  counties: [
    { name: "IEBC Official Boundaries", url: "https://github.com/tigawanna/kenya_wards_geojson_data", license: "CC-BY-4.0", note: "County boundaries from Kenya wards GeoJSON data repository." },
  ],
  facilities: [
    { name: "ICPAC/KEMRI Kenya Health Facilities", url: "https://geoportal.icpac.net", license: "CC-BY-4.0", note: "Health facilities dataset compiled by KEMRI/Wellcome Trust." },
  ],
  indicators: [
    { name: "KNBS 2019 Census + KIHBS", url: "https://www.knbs.or.ke", license: "Open Data", note: "County populations from 2019 census. Poverty rates from KIHBS 2015/16." },
  ],
};
