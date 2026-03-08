export function snapValue(value: number, stepIn: number, enabled: boolean): number {
  if (!enabled) return value;
  return Math.round(value / stepIn) * stepIn;
}

export function snapRect(
  rect: { xIn: number; yIn: number; widthIn: number; heightIn: number },
  stepIn: number,
  enabled: boolean
) {
  if (!enabled) return rect;
  return {
    xIn: snapValue(rect.xIn, stepIn, true),
    yIn: snapValue(rect.yIn, stepIn, true),
    widthIn: Math.max(stepIn / 2, snapValue(rect.widthIn, stepIn, true)),
    heightIn: Math.max(stepIn / 2, snapValue(rect.heightIn, stepIn, true)),
  };
}
