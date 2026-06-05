import json, urllib.request
from collections import Counter

d = json.loads(urllib.request.urlopen('https://uhcke-247.netlify.app/data/boundaries/counties.geojson').read())
geo_types = Counter(f['geometry']['type'] for f in d['features'])
print('Geometry types:', dict(geo_types))
null_geo = [f for f in d['features'] if f['geometry'] is None or f['geometry']['coordinates'] is None]
print('Null geometries:', len(null_geo))
# Check coordinate structure
for f in d['features'][:2]:
    g = f['geometry']
    coords = g['coordinates']
    print(f'Feature {f["properties"]["county_name"]}: type={g["type"]}, coords nesting={len(coords)}')
    if g['type'] == 'MultiPolygon':
        print(f'  Num polygons: {len(coords)}')
        print(f'  First polygon first ring: {len(coords[0][0])} coords')
    elif g['type'] == 'Polygon':
        print(f'  First ring: {len(coords[0])} coords')
