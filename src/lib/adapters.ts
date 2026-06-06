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

export interface SourceEntry {
  name: string;
  url: string;
  license: string;
  licenseUrl?: string;
  note: string;
  type: "api" | "download" | "website" | "research";
}

export const REAL_SOURCES: Record<string, SourceEntry[]> = {
  counties: [
    {
      name: "IEBC Official County Boundaries",
      url: "https://github.com/tigawanna/kenya_wards_geojson_data",
      license: "CC-BY-4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      note: "County boundary polygons derived from the Independent Electoral and Boundaries Commission (IEBC) official map, converted to GeoJSON by the Kenya Wards open-data project.",
      type: "download",
    },
    {
      name: "KNBS GIS Boundary Files",
      url: "https://www.knbs.or.ke/gis-boundary-files/",
      license: "Open Data",
      licenseUrl: "https://www.knbs.or.ke/terms-of-use/",
      note: "KNBS publishes official administrative boundary shapefiles for counties, sub-counties, and wards. These are the authoritative source for spatial joins and aggregation.",
      type: "download",
    },
  ],
  facilities: [
    {
      name: "KMHFR, Kenya Master Health Facility List",
      url: "https://kmhfr.health.go.ke/",
      license: "Open Data",
      note: "The official Ministry of Health registry of all health facilities in Kenya. Export to CSV from the Facilities tab for ~16,000+ facilities with GPS coordinates, KEPH level, ownership, and operational status.",
      type: "download",
    },
    {
      name: "KMHFR FHIR R4 API",
      url: "https://fhirapi.nphl.go.ke/api/",
      license: "Restricted",
      note: "FHIR R4 API requiring OAuth Bearer Token or x-api-key. Request credentials from NPHL ICT at helpdesk@nphl.go.ke.",
      type: "api",
    },
    {
      name: "ICPAC GeoPortal, Kenya Health Facilities",
      url: "https://geoportal.icpac.net/layers/geonode:kenya_health_facilities",
      license: "CC-BY-4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      note: "Point dataset of 200+ health facilities compiled by ICPAC and KEMRI/Wellcome Trust. Includes hospitals, health centres, and dispensaries with location coordinates, ownership, and service type.",
      type: "download",
    },
    {
      name: "KEMRI/Wellcome Trust, Geographic Access Research",
      url: "https://kemri-wellcome.org/programmes/geographic-access/",
      license: "Research",
      note: "Research programme producing travel-time accessibility surfaces using cost-distance modelling. Raw friction GeoTIFFs available upon request accompanying published papers.",
      type: "research",
    },
  ],
  indicators: [
    {
      name: "OCHA HDX, Kenya Population Statistics (KNBS-derived)",
      url: "https://data.humdata.org/dataset/kenya-population-statistics",
      license: "CC-BY-4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      note: "UN OCHA Humanitarian Data Exchange hosts KNBS-derived ward-level population statistics. Columns: ADM3_EN (Ward Name), ADM3_PCODE (Ward Code), T_TL (Total Population). Readily downloadable as CSV without authentication.",
      type: "download",
    },
    {
      name: "KNBS Microdata Portal",
      url: "https://statistics.knbs.or.ke/",
      license: "Restricted",
      note: "Official KNBS microdata repository. Ward-level census data requires a data access request. Alternative to HDX when official microdata is needed.",
      type: "api",
    },
    {
      name: "KDHS 2022, Kenya Demographic and Health Survey",
      url: "https://dhsprogram.com/data/dataset/Kenya_Standard-DHS_2022.cfm",
      license: "Restricted",
      note: "Current gold standard for health and wealth indicators. Wealth quintile data downloadable as .dta or .csv after registering a project on the DHS Program portal. Replaces the dated KIHBS 2015/16.",
      type: "download",
    },
    {
      name: "World Bank, Kenya Poverty and Equity Data",
      url: "https://databank.worldbank.org/source/kenya-poverty-and-equity",
      license: "CC-BY-4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      note: "Cross-validated poverty estimates for Kenya counties. Used as a reference check against KDHS wealth quintile data.",
      type: "website",
    },
  ],
  methods: [
    {
      name: "WHO AccessMod, Geographic Accessibility Modelling",
      url: "https://www.accessmod.org",
      license: "Open Source (GPL-3.0)",
      licenseUrl: "https://www.gnu.org/licenses/gpl-3.0.html",
      note: "The World Health Organization's open-source tool for modelling physical accessibility to health services. Implements least-cost path algorithms over combined transport networks (walking, motorized, and non-motorized).",
      type: "research",
    },
    {
      name: "KEMRI-Wellcome Trust, Health Access Research",
      url: "https://kemri-wellcome.org/programmes/health-systems/",
      license: "Research",
      note: "Kenya's leading health research institute. Their geographic access group produces the travel-time friction surfaces and cost-distance models that underpin this platform's accessibility metric.",
      type: "research",
    },
    {
      name: "Geofabrik, OSM Kenya Extract",
      url: "https://download.geofabrik.de/africa/kenya.html",
      license: "ODbL-1.0",
      licenseUrl: "https://opendatacommons.org/licenses/odbl/",
      note: "Daily OSM extracts for Kenya in .osm.pbf format. Used as the road network input for AccessMod cost-distance modelling and Protomaps vector tile generation.",
      type: "download",
    },
    {
      name: "ESA WorldCover, Land Cover Friction Surface",
      url: "https://worldcover.esa.int/",
      license: "CC-BY-4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      note: "10 m resolution satellite-derived land-cover map from the European Space Agency. Used to assign off-road walking speeds (bare land, grassland, shrub, forest, water) in the cost-distance model.",
      type: "download",
    },
  ],
};
