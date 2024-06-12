import { OverlayLayer, Pipe } from "@qatium/sdk";
import { Feature } from "geojson";

export const buildPipeLayer = (
  id: string,
  pipes: Pipe[],
  color: string
): OverlayLayer<"GeoJsonLayer"> => {
  return {
    type: "GeoJsonLayer",
    id,
    data: pipes.map(
      (pipe) =>
        ({
          type: "Feature",
          geometry: pipe.geometry,
          properties: {}
        }) as Feature
    ),
    opacity: 1,
    getLineColor: hexToRgb(color),
    getLineWidth: 2,
    lineWidthUnits: "pixels",
    stroked: true,
    lineJointRounded: true,
    lineCapRounded: true,
    visible: true
  };
};

const hexToRgb = (
  hex: string
): OverlayLayer<"GeoJsonLayer">["getLineColor"] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
      ]
    : [0, 0, 0];
};
