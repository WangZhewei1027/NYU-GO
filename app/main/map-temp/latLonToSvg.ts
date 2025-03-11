export const mapBounds = {
  maxLat: 40.7716, // 地图的最北端
  minLon: -74.037059, // 地图的最东端
  minLat: 40.67444,
  maxLon: -73.92399,
};

export function latLonToSvg(
  lat: number,
  lon: number,
  svgWidth: number,
  svgHeight: number
) {
  const x =
    ((lon - mapBounds.minLon) / (mapBounds.maxLon - mapBounds.minLon)) *
    svgWidth;
  const y =
    (1 - (lat - mapBounds.minLat) / (mapBounds.maxLat - mapBounds.minLat)) *
    svgHeight;
  return { x, y };
}
