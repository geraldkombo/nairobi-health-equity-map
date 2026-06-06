import { z } from "zod";

export const KmhfrFacilitySchema = z.object({
  id: z.string(),
  code: z.number().or(z.string()).transform(String),
  name: z.string(),
  official_name: z.string().nullable().catch(null),
  county_name: z.string().transform((v) => v.trim().toUpperCase()),
  sub_county_name: z.string().nullable().catch(null),
  ward_name: z.string().nullable().catch(null),
  keph_level_name: z.string().nullable().catch(null),
  facility_type_name: z.string().nullable().catch(null),
  owner_name: z.string(),
  operation_status_name: z.string(),
  lat: z.coerce.number().nullable().catch(null),
  long: z.coerce.number().nullable().catch(null),
});

export const KmhfrResponseSchema = z.object({
  count: z.number().optional(),
  next: z.string().nullable().optional(),
  previous: z.string().nullable().optional(),
  results: z.array(KmhfrFacilitySchema),
});

export type ValidatedFacility = z.infer<typeof KmhfrFacilitySchema>;

export const FacilitySchema = z.object({
  county_name: z.string(),
}).passthrough();

export const KnbsRowSchema = z.object({
  county_name: z.string(),
  population: z.coerce.number().nonnegative(),
  poverty_rate: z.coerce.number().min(0).max(100),
});

export type KnbsRow = z.infer<typeof KnbsRowSchema>;

export const TravelTimeRowSchema = z.object({
  county_name: z.string(),
  mean_travel_time: z.coerce.number().nonnegative(),
});

export type TravelTimeRow = z.infer<typeof TravelTimeRowSchema>;

export const CountySnapshotSchema = z.object({
  county_code: z.string(),
  county_name: z.string(),
  population: z.number(),
  facility_count: z.number(),
  facility_density_proxy: z.number(),
  poverty_proxy: z.number(),
  travel_time_to_facility_proxy: z.number(),
  immunization_coverage: z.number(),
  skilled_birth_attendance: z.number(),
  updated_at: z.string(),
});

export type CountySnapshot = z.infer<typeof CountySnapshotSchema>;

export const CountySnapshotArraySchema = z.array(CountySnapshotSchema);
