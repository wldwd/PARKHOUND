import "./style.css";

import { Map, View, Overlay } from "ol";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import GeoJSON from "ol/format/GeoJSON";
import { fromLonLat } from "ol/proj"; // https://openlayers.org/en/latest/apidoc/module-ol_proj.html
import {
  intersect,
  multiPolygon,
  polygon,
  featureCollection,
} from "@turf/turf";
import styles from "./styles";
import { getPopupHtml } from "./helpers";
import { searchControl } from "./search";

/**
 * Create an overlay to anchor the popup to the map.
 */
const content = document.getElementById("popup-content");
const overlayContainer = document.getElementById("popup");
export const overlay = new Overlay({
  element: overlayContainer,
  autoPan: {
    animation: {
      duration: 250,
    },
  },
});

// Create the vector layer for the dog parks
const format = new GeoJSON();
const dogParksLayer = new VectorLayer({
  source: new VectorSource({
    url: "./dog_parks_poly.json", //path to JSON file with dog parks layer
    format,
  }),
  style: styles.dogPark, // Use default dog park style
});

// Search feature
let selectedFeatures = [];
searchControl.on("pick", ({ feature }) => {
  if (!feature) return;
  const geom = feature.geometry;
  // if there is a feature, check the geometry is a polygon
  if (geom.type !== "Polygon") return;

  // this constructs the search result in such a way that turf can understand it (turf is being used for the geospatial analysis, which is intersect of search location polygon with dogpark polygons)
  const searchFormat = new GeoJSON();
  const searchFeature = searchFormat.readFeatures(JSON.stringify(geom));
  if (searchFeature.length === 0) return; // makes sure the array has at least one object in it (for no bugs)
  const turfSearchPoly = searchFormat.writeFeatureObject(searchFeature[0]); //this exports the search result so turf can read it
  const searchPoly = polygon(turfSearchPoly.geometry.coordinates); //read it with turf

  const features = dogParksLayer.getSource().getFeatures();

  features.forEach((dogpark) => {
    // this exports each dogpark so turf can read it
    const turfFeature = format.writeFeatureObject(dogpark, {
      featureProjection: "EPSG:3857",
      dataProjection: "EPSG:4326",
    });
    const featPoly = multiPolygon(turfFeature.geometry.coordinates); //read it with turf
    const bothPolys = featureCollection([searchPoly, featPoly]);
    const intersections = intersect(bothPolys); // intersect is a turf function to... do an intersect between the dog park polygon and search polygon
    if (intersections) {
      selectedFeatures.push(dogpark);
      dogpark.setStyle(styles.filtered);
    }
  });
});

searchControl.on("querychange", () => {
  selectedFeatures.forEach((feat) => {
    feat.setStyle(null);
  });
  selectedFeatures = [];
});

// this is the map
const map = new Map({
  target: "map",
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    dogParksLayer, //Add dog parks layer
  ],
  overlays: [overlay], //for popup
  target: "map",
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
  view: new View({
    center: fromLonLat([115.79967133671343, -32.00025]), // Perth, Western Australia
    zoom: 12,
  }),
  controls: [searchControl],
});

//Add a click handler to the map to render the popup.
let clickedFeature = null;
map.on("singleclick", (event) => {
  if (clickedFeature) {
    if (selectedFeatures.includes(clickedFeature))
      clickedFeature.setStyle(styles.filtered);
    else clickedFeature.setStyle(null); // Reset to default style
  }
  // find a feature at the click
  const features = dogParksLayer
    .getSource()
    .getFeaturesAtCoordinate(event.coordinate);
  if (features.length > 0) {
    const feature = features[0];
    // build & show the popup
    const p = feature.getProperties();
    content.innerHTML = getPopupHtml(
      p["Park Name"],
      p.Address,
      p.Description,
      p["LGA type"],
      p["LGA name"],
      p.Telephone,
      p.Email,
      p.Website,
      p.Enclosed
    );
    overlay.setPosition(event.coordinate);
    overlay.setProperties({});
    clickedFeature = feature;
    feature.setStyle(styles.hovered);
  } else {
    // hide the popup when clicking elsewhere
    overlay.setPosition(undefined);
    content.innerHTML = "";
  }
});

//Core Features to Implement:
//Search functionality - Location search with radius options
//Interactive map - Clickable polygons with popups ✅
//Filtering system - Filter by park features/amenities
//List view - Toggle between map and table view
//Visual styling - Different polygon styles for different states
//Navigation integration - Links to directions
// Scale bar
// Layers?
