import { Style, Fill, Stroke } from "ol/style"; // Add this import

//Styles
export default {
  //all dog parks - green with thick border and drop shadow
  dogPark: new Style({
    fill: new Fill({
      color: "rgba(0, 255, 0, 0.4)",
    }),
    stroke: new Stroke({
      color: "#00AA00",
      width: 3,
    }),
  }),

  // Filtered results - pink with thickest border
  filtered: new Style({
    fill: new Fill({
      color: "rgba(255, 20, 147, 0.4)", // DeepPink
    }),
    stroke: new Stroke({
      color: "#FF1493",
      width: 4,
    }),
  }),

  // Non-dog parks or hidden - thin border
  hidden: new Style({
    fill: new Fill({
      color: "rgba(128, 128, 128, 0.2)",
    }),
    stroke: new Stroke({
      color: "#808080",
      width: 1,
    }),
  }),
  // Create a style for hovered features
  hovered: new Style({
    fill: new Fill({
      color: "rgba(255, 255, 0, 0.6)", // Yellow highlight
    }),
    stroke: new Stroke({
      color: "#FFFF00",
      width: 3,
    }),
  }),
};
