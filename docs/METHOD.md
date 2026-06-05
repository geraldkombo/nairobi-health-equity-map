# Priority Gap Score (PGS) Methodology

## Overview

The Priority Gap Score (PGS) is a composite index that quantifies relative health-access inequity across Nairobi wards. It combines three dimensions into a single transparent score between 0 (lower priority) and 1 (higher priority).

## Dimensions and default weights

| Dimension | Default weight | Indicators used |
|---|---|---|
| Accessibility | 40% | Travel time proxy (60%), Facility density inverted (40%) |
| Population pressure | 30% | Total population |
| Vulnerability | 30% | Poverty proxy |

## Normalisation

Each raw indicator is min-max normalised across all wards in the county:

```
normalised = (value - min) / (max - min)
```

Where a higher value should indicate greater priority (e.g., travel time), the normalised value is used directly. Where a higher value should indicate lower priority (e.g., facility density), the value is inverted (`1 - normalised`).

## Aggregation

```
PGS = (accessibility Ã- 0.4) + (vulnerability Ã- 0.3) + (population_pressure Ã- 0.3)
```

Where:
- `accessibility = travel_time_normalised Ã- 0.6 + facility_density_inverted Ã- 0.4`
- `vulnerability = poverty_normalised`
- `population_pressure = population_normalised`

Weights can be adjusted interactively in Research mode.

## Interpretation

| PGS range | Interpretation |
|---|---|
| 0.00â€“0.25 | Low relative priority |
| 0.25â€“0.50 | Moderate relative priority |
| 0.50â€“0.75 | High relative priority |
| 0.75â€“1.00 | Very high relative priority |

## Limitations

- Proxy indicators only â€” not clinical outcome measures
- Synthetic/demo data used currently
- Ward centroids rather than population-weighted means
- Does not capture quality of care or facility capacity
- Default weights unvalidated for local context
