import { clampNumber } from "../../lib/validate";

export interface RectIn {
  xIn: number;
  yIn: number;
  widthIn: number;
  heightIn: number;
}

export function inchesToPx(inches: number, pxPerIn: number, zoom: number): number {
  return inches * pxPerIn * zoom;
}

export function pxToInches(px: number, pxPerIn: number, zoom: number): number {
  return px / (pxPerIn * zoom);
}

export function clampRectToBounds(rect: RectIn, boundsWidthIn: number, boundsHeightIn: number, minSizeIn: number): RectIn {
  const widthIn = clampNumber(rect.widthIn, minSizeIn, boundsWidthIn);
  const heightIn = clampNumber(rect.heightIn, minSizeIn, boundsHeightIn);
  const xMax = Math.max(0, boundsWidthIn - widthIn);
  const yMax = Math.max(0, boundsHeightIn - heightIn);
  const xIn = clampNumber(rect.xIn, 0, xMax);
  const yIn = clampNumber(rect.yIn, 0, yMax);
  return { xIn, yIn, widthIn, heightIn };
}
