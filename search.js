import { GeocodingControl } from "@maptiler/geocoding-control/openlayers";
import "@maptiler/geocoding-control/style.css";

export const searchControl = new GeocodingControl({
  placeholder: "Search for a suburb or LGA",
  apiKey: import.meta.env.VITE_MAPTILER_API_KEY,
  bbox: [
    115.69122472080639, -32.20096184271112, 116.09518539210681,
    -31.866613555669637,
  ],
  filter: (feature) =>
    feature.place_type.includes("municipality") ||
    feature.place_type.includes("county") ||
    feature.place_type.includes("place"),
});
