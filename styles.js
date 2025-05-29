import { Style, Fill, Stroke } from "ol/style"; // Add this import

//Styles
export default {
  //all dog parks - light purple with thick border and drop shadow
  dogPark: new Style({
    fill: new Fill({
      color: "rgba(196, 111, 247, 0.76)",
    }),
    stroke: new Stroke({
      color: "#8a0fd5c2",
      width: 1,
    }),
  }),

  // Search results
  filtered: new Style({
    fill: new Fill({
      color: "rgba(255, 20, 147, 0.4)", // Pink
    }),
    stroke: new Stroke({
      color: "#FF1493",
      width: 2,
    }),
  }),

  // Style for clicked features
  hovered: new Style({
    fill: new Fill({
      color: "rgba(255, 0, 255, 0.7)", // Fuschia
    }),
    stroke: new Stroke({
      color: "rgb(255, 0, 255)",
      width: 1,
    }),
  }),
};
