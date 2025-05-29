/*
 Interactive map displaying dog parks in Perth, Western Australia.
 Features:
  Search by area with polygon intersection
  Click parks for detailed information
  Responsive design with collapsible controls that mostly work.... :)
 */

import "./style.css";

import { Map, View, Overlay } from "ol";
import { Zoom } from "ol/control";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import GeoJSON from "ol/format/GeoJSON";
import ScaleLine from "ol/control/ScaleLine.js";
import Attribution from "ol/control/Attribution.js";
import { fromLonLat } from "ol/proj";
import {
  intersect,
  multiPolygon,
  polygon,
  featureCollection,
} from "@turf/turf";
import styles from "./styles";
import { getPopupHtml } from "./helpers";
import { searchControl } from "./search";

//Map controls
const scaleLine = new ScaleLine({
  units: "metric",
});

const attribution = new Attribution({
  collapsible: false,
});

//Popup overlay setup
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

// Vector layer for dog parks GeoJSON data.
const format = new GeoJSON();
const dogParksLayer = new VectorLayer({
  source: new VectorSource({
    url: "./dog_parks_poly.json",
    format,
  }),
  style: styles.dogPark,
});

const parkListContainer = document.getElementById("parklist");

// Handle park list clicks; highlight selected park from search results
let clickedFilteredFeature = null;
parkListContainer.addEventListener("click", (e) => {
  // Reset previously clicked feature to filtered style
  if (clickedFilteredFeature) clickedFilteredFeature.setStyle(styles.filtered);
  if (e.target.parentElement.classList.contains("parklist-item")) {
    const id = e.target.parentElement.dataset.featureId;
    const features = dogParksLayer.getSource().getFeatures();

    const feature = features.find((f) => f.getId() === parseInt(id));

    if (feature) {
      clickedFilteredFeature = feature;
      feature.setStyle(styles.hovered);
    }
  }
});

let selectedFeatures = [];

/* Spatial intersection workflow:*
1. Convert search polygon from EPSG:3857 (web mercator) to EPSG:4326 (lat/lon)*
2. Convert each dog park polygon to same projection*
3. Use Turf.js intersection to find overlapping areas*
4. Style and list all intersecting parks*/

// Handle search area selection - find intersecting dog parks
searchControl.on("pick", ({ feature }) => {
  if (!feature) return;
  const geom = feature.geometry;
  if (geom.type !== "Polygon") return;

  // Convert search area to Turf-compatible format
  const searchFormat = new GeoJSON();
  const searchFeature = searchFormat.readFeatures(JSON.stringify(geom));
  if (searchFeature.length === 0) return;

  // Create Turf polygon from search area
  const turfSearchPoly = searchFormat.writeFeatureObject(searchFeature[0]); //this exports the search result so turf can read it
  const searchPoly = polygon(turfSearchPoly.geometry.coordinates); //read it with turf

  const features = dogParksLayer.getSource().getFeatures();

  // Check each dog park for intersection with search area
  features.forEach((dogpark) => {
    // Convert dog park to EPSG:4326 for Turf compatibility
    const turfFeature = format.writeFeatureObject(dogpark, {
      featureProjection: "EPSG:3857",
      dataProjection: "EPSG:4326",
    });

    // Create Turf multipolygon and check for intersection
    const featPoly = multiPolygon(turfFeature.geometry.coordinates); //read it with turf
    const bothPolys = featureCollection([searchPoly, featPoly]);
    const intersections = intersect(bothPolys); // intersect is a turf function to... do an intersect between the dog park polygon and search polygon
    // Add intersecting parks to results
    if (intersections) {
      parkListContainer.setAttribute("class", "active");
      selectedFeatures.push(dogpark);
      dogpark.setStyle(styles.filtered);
    }
  });
  // Populate results list with park details
  const parkListContent = selectedFeatures
    .map((park) => {
      const parkProps = park.getProperties();
      return `<div class="parklist-item" data-feature-id="${park.getId()}"><span class="park-name">${
        parkProps["Park_Name"]
      }</span><span class="park-address">${parkProps["Address"]}</div>`;
    })
    .join("");
  parkListContainer.innerHTML = parkListContent;
});

// Reset search results when query changes
searchControl.on("querychange", () => {
  selectedFeatures.forEach((feat) => {
    feat.setStyle(null);
  });
  parkListContainer.setAttribute("class", "");
  parkListContainer.innerHTML = "";
  selectedFeatures = [];
});

const zoom = new Zoom({ className: "ol-zoom-ph" });

// Initialise map with OSM basemap and dog parks layer
const map = new Map({
  target: "map",
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    dogParksLayer,
  ],
  overlays: [overlay],
  target: "map",
  view: new View({
    center: fromLonLat([115.79967133671343, -32.00025]), // Perth, Western Australia
    zoom: 12,
  }),
  controls: [searchControl, scaleLine, attribution, zoom],
});

// Toggle attribution collapse on small screens
function checkSize() {
  const small = map.getSize()[0] < 600;
  attribution.setCollapsible(small);
  attribution.setCollapsed(small);
}

map.on("change:size", checkSize);
checkSize();

// Handle map clicks; show popup for clicked dog park
let clickedFeature = null;
map.on("singleclick", (event) => {
  if (clickedFeature) {
    if (selectedFeatures.includes(clickedFeature))
      clickedFeature.setStyle(styles.filtered);
    else clickedFeature.setStyle(null); // Reset to default style
  }
  if (clickedFilteredFeature) clickedFilteredFeature.setStyle(styles.filtered);

  // Check for features at click location
  const features = dogParksLayer
    .getSource()
    .getFeaturesAtCoordinate(event.coordinate);

  if (features.length > 0) {
    const feature = features[0];

    const p = feature.getProperties();
    // build and display the popup
    content.innerHTML = getPopupHtml(
      p["Park_Name"],
      p.Address,
      p.Description,
      p["LGA_type"],
      p["LGA_name"],
      p.Telephone,
      p.Email,
      p.Website,
      p.Enclosed,
      p["Coordinates_(x,y)"]
    );
    overlay.setPosition(event.coordinate);
    overlay.setProperties({});

    //Highlight clicked feature
    clickedFeature = feature;
    feature.setStyle(styles.hovered);
  } else {
    // hide the popup when clicking elsewhere
    overlay.setPosition(undefined);
    content.innerHTML = "";
  }
});
