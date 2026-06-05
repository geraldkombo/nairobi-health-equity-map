"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import maplibregl from "maplibre-gl";

interface MapViewProps {
  boundaries: GeoJSON.FeatureCollection;
  countyScores: Record<string, number>;
  countyNames: Record<string, string>;
  onCountyClick: (countyCode: string) => void;
  selectedCountyCode: string | null;
}

function getPGSColor(pgs: number): string {
  if (pgs >= 0.7) return "#dc2626";
  if (pgs >= 0.5) return "#f97316";
  if (pgs >= 0.3) return "#eab308";
  return "#22c55e";
}

function buildMatchExpression(countyScores: Record<string, number>): any[] {
  const entries = Object.entries(countyScores).flatMap(([k, v]) => [Number(k), getPGSColor(v)]);
  return ["match", ["get", "county_code"], ...entries, "#e7e5e4"];
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
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const [ready, setReady] = useState(false);
  const [hasError, setError] = useState(false);

  const formatScore = useCallback((pgs: number) => `${(pgs * 100).toFixed(0)}`, []);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let map: maplibregl.Map | null = null;
    try {
      map = new maplibregl.Map({
        container: containerRef.current,
        style: {
          version: 8,
          sources: {
            "osm-tiles": {
              type: "raster",
              tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              attribution: "&copy; OpenStreetMap contributors",
            },
          },
          layers: [
            {
              id: "osm-tiles-layer",
              type: "raster",
              source: "osm-tiles",
              minzoom: 0,
              maxzoom: 19,
            },
          ],
        },
        center: [37.9, 0.5],
        zoom: 6,
        maxBounds: [[33, -5], [42, 5]],
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
              "#a3e635",
              buildMatchExpression(countyScores),
            ] as any,
            "fill-opacity": 0.65,
            "fill-outline-color": "#78716c",
          },
        });

        map.addLayer({
          id: "counties-outline",
          type: "line",
          source: "counties",
          paint: {
            "line-color": "#44403c",
            "line-width": 1.5,
            "line-opacity": 0.8,
          },
        });

        map.on("click", "counties-fill", (e) => {
          if (e.features && e.features[0]?.properties) {
            const code = String(e.features[0].properties.county_code);
            onCountyClick(code);
          }
        });

        map.on("mouseenter", "counties-fill", (e) => {
          map.getCanvas().style.cursor = "pointer";
          if (e.features && e.features[0]?.properties) {
            const props = e.features[0].properties;
            const code = String(props.county_code);
            const name = props.county_name || "Unknown";
            const score = countyScores[code];
            const scoreLabel = score !== undefined ? `PGS: ${formatScore(score)}` : "No data";
            const color = score !== undefined ? getPGSColor(score) : "#e7e5e4";
            const html = `
              <div style="font-family:system-ui;min-width:120px">
                <div style="font-weight:600;font-size:14px;color:#1c1917">${name}</div>
                <div style="display:flex;align-items:center;gap:8px;margin-top:4px">
                  <span style="display:inline-block;width:12px;height:12px;border-radius:2px;background:${color}"></span>
                  <span style="font-size:13px;color:#57534e">${scoreLabel}</span>
                </div>
              </div>
            `;
            if (popupRef.current) popupRef.current.remove();
            popupRef.current = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 10 })
              .setLngLat(e.lngLat)
              .setHTML(html)
              .addTo(map);
          }
        });

        map.on("mouseleave", "counties-fill", () => {
          map.getCanvas().style.cursor = "";
          if (popupRef.current) {
            popupRef.current.remove();
            popupRef.current = null;
          }
        });

        map.addControl(new maplibregl.NavigationControl(), "bottom-right");

        map.fitBounds(
          [[33.5, -5], [42.5, 5]],
          { padding: 40, duration: 0 }
        );

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
        "#a3e635",
        buildMatchExpression(countyScores),
      ] as any);
    } catch (e) {
      console.error("Map update error:", e);
    }
  }, [countyScores, selectedCountyCode, boundaries]);

  return (
    <div className="relative min-h-[400px] w-full overflow-hidden rounded-xl border border-neutral-200 shadow-sm">
      <div ref={containerRef} className="h-[500px] w-full md:h-[600px]" aria-label="Map of Kenya counties with health equity data" role="application" />
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-50 text-sm text-neutral-500">
          Map render error. Check console for details.
        </div>
      ) : !ready ? (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-50 text-sm text-neutral-500">
          Loading map...
        </div>
      ) : null}
    </div>
  );
}
