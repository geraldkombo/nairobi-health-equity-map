"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import maplibregl from "maplibre-gl";
import { getPGSColor, pgsPlainLanguage } from "@/lib/scoring";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

interface MapViewProps {
  boundaries: GeoJSON.FeatureCollection;
  countyScores: Record<string, number>;
  countyNames: Record<string, string>;
  onCountyClick: (countyCode: string) => void;
  selectedCountyCode: string | null;
}

function buildMatchExpression(countyScores: Record<string, number>): any[] {
  const entries = Object.entries(countyScores).flatMap(([k, v]) => [Number(k), getPGSColor(v)]);
  return ["match", ["get", "county_code"], ...entries, "#E7E5E4"];
}

interface HoverInfo {
  countyCode: string;
  countyName: string;
  pgs: number | undefined;
  x: number;
  y: number;
}

export default function MapView({
  boundaries,
  countyScores,
  countyNames,
  onCountyClick,
  selectedCountyCode,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [ready, setReady] = useState(false);
  const [hasError, setError] = useState(false);
  const [tileError, setTileError] = useState(false);
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let map: maplibregl.Map | null = null;
    try {
      map = new maplibregl.Map({
        container: containerRef.current,
        style: {
          version: 8,
          sources: {
            "carto-positron": {
              type: "raster",
              tiles: ["https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"],
              tileSize: 256,
              attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            },
          },
          layers: [
            {
              id: "base-map",
              type: "raster",
              source: "carto-positron",
              minzoom: 0,
              maxzoom: 19,
            },
          ],
        },
        center: [37.9, 0.5],
        zoom: 5.2,
        maxBounds: [
          [31.0, -5.5],
          [43.0, 6.0],
        ],
        cooperativeGestures: true,
      });
    } catch (e) {
      console.error("Map initialization error:", e);
      return;
    }
    if (!map) return;

    map.on("load", () => {
      try {
        mapRef.current = map;

        map.addSource("counties", {
          type: "geojson",
          data: boundaries as any,
        });

        map.addLayer({
          id: "counties-fill",
          type: "fill",
          source: "counties",
          paint: {
            "fill-color": [
              "case",
              ["boolean", ["==", ["get", "county_code"], Number(selectedCountyCode ?? "0")], false],
              "#16A34A",
              buildMatchExpression(countyScores),
            ] as any,
            "fill-opacity": 0.85,
            "fill-outline-color": "#FFFFFF",
          },
        });

        map.addLayer({
          id: "counties-outline",
          type: "line",
          source: "counties",
          paint: {
            "line-color": "#FFFFFF",
            "line-width": 1,
            "line-opacity": 1,
          },
        });



        map.on("click", "counties-fill", (e) => {
          if (e.features && e.features[0]?.properties) {
            const code = String(e.features[0].properties.county_code);
            onCountyClick(code);
          }
        });

        map.on("click", (e) => {
          const features = map.queryRenderedFeatures(e.point, { layers: ["counties-fill"] });
          if (!features.length) onCountyClick("");
        });

        map.on("mousemove", "counties-fill", (e) => {
          map.getCanvas().style.cursor = "pointer";
          if (e.features && e.features[0]?.properties) {
            const props = e.features[0].properties;
            const code = String(props.county_code);
            setHoverInfo({
              countyCode: code,
              countyName: props.county_name || "Unknown",
              pgs: countyScores[code],
              x: e.point.x,
              y: e.point.y,
            });
          }
        });

        map.on("mouseleave", "counties-fill", () => {
          map.getCanvas().style.cursor = "";
          setHoverInfo(null);
        });

        map.addControl(new maplibregl.NavigationControl(), "bottom-right");

        map.fitBounds([[33.5, -5], [42.5, 5]], { padding: 40, duration: 0 });

        map.on("error", (e) => {
          if (e.error && typeof e.error.status === "number" && e.error.status >= 400) {
            setTileError(true);
          }
        });

        setReady(true);
      } catch (e) {
        console.error("Map load handler error:", e);
        setError(true);
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    try {
      const source = map.getSource("counties") as maplibregl.GeoJSONSource;
      if (source) source.setData(boundaries as any);

      map.setPaintProperty("counties-fill", "fill-color", [
        "case",
        ["boolean", ["==", ["get", "county_code"], Number(selectedCountyCode ?? "0")], false],
        "#16A34A",
        buildMatchExpression(countyScores),
      ] as any);
    } catch (e) {
      console.error("Map update error:", e);
    }
  }, [countyScores, selectedCountyCode, boundaries]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const timer = setTimeout(() => {
      try { map.resize(); } catch (e) { console.error('Map resize error:', e); }
    }, 500);
    return () => clearTimeout(timer);
  }, [selectedCountyCode]);

  const pgsLabel = hoverInfo?.pgs !== undefined ? `${hoverInfo.pgs}` : null;
  const pgsColor = hoverInfo?.pgs !== undefined ? getPGSColor(hoverInfo.pgs) : null;

  return (
    <div className="relative min-h-[400px] w-full overflow-hidden rounded-xl border border-stone-200 shadow-sm">
      <div
        ref={containerRef}
        className="h-[50svh] w-full min-h-[350px] max-h-[800px] md:h-[60svh] lg:h-[70svh]"
        aria-label="Map of Kenya counties with health equity data"
        role="application"
        tabIndex={0}
      />
      {hoverInfo && (
        <div
          className="pointer-events-none absolute z-50 rounded-lg border border-stone-200 bg-white p-3 shadow-lg"
          style={{ left: Math.min(hoverInfo.x + 16, window.innerWidth - 200), top: hoverInfo.y + 16 }}
          role="tooltip"
          aria-live="polite"
        >
          <div className="flex items-center gap-2">
            {pgsColor && (
              <span
                className="inline-block h-3 w-3 flex-shrink-0 rounded-sm"
                style={{ backgroundColor: pgsColor }}
              />
            )}
            <span className="font-semibold text-stone-800">{hoverInfo.countyName}</span>
          </div>
          {pgsLabel && (
            <p className="mt-1 text-sm text-stone-500" title={hoverInfo?.pgs !== undefined ? pgsPlainLanguage(hoverInfo.pgs) : ""}>
              Priority Gap Score: <span className="font-medium text-stone-700">{pgsLabel}</span>
            </p>
          )}
        </div>
      )}
      <div aria-live="polite" className="sr-only">
        {selectedCountyCode && countyNames[selectedCountyCode]
          ? `${countyNames[selectedCountyCode]} selected. Priority Gap Score: ${countyScores[selectedCountyCode] ?? "unknown"}.`
          : "Map loaded. Tap a county to view its health equity data."}
      </div>
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-stone-50 text-sm text-stone-500">
          Map rendering error encountered. Review the system console for details.
        </div>
      ) : !ready ? (
        <div className="absolute inset-0 flex items-center justify-center bg-stone-50 text-sm text-stone-500">
          Loading geographic interface...
        </div>
      ) : null}
      {tileError && (
        <div className="absolute left-2 right-2 top-2 z-50 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-700 shadow-sm" role="alert">
          Map tiles unavailable offline. County outlines still visible.
        </div>
      )}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 py-1.5">
        <a
          href="https://statistics.knbs.or.ke/nada/index.php/catalog/116"
          target="_blank"
          rel="noreferrer"
          className="pointer-events-auto text-[9px] text-stone-400 hover:text-stone-600 underline underline-offset-2"
        >
          KNBS boundaries
        </a>
        <a
          href="https://geoportal.icpac.net/layers/geonode:kenya_health/metadata_detail"
          target="_blank"
          rel="noreferrer"
          className="pointer-events-auto text-[9px] text-stone-400 hover:text-stone-600 underline underline-offset-2"
        >
          Facilities: ICPAC/KEMRI
        </a>
      </div>
    </div>
  );
}
