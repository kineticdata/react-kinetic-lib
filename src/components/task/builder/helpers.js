import * as constants from './constants';

export const isIE11 = document.documentMode === 11;

// given the <g> element that does the transform, returns the float value of the
// current scale, depending on the browser we look at the transform / style
// attribute then use regex to extract it from the attribute value
export const getScale = transformerEl => {
  const property =
    transformerEl.getAttribute('transform') ||
    transformerEl.getAttribute('style');
  const scaleString = property.match(/scale\((\d*\.?\d*)\)/)[1];
  return parseFloat(scaleString);
};

// getPointOnCircle comes from the following blog post
// https://www.varvet.com/blog/svg-arrows-with-hover/
export const getPointOnCircle = (x, y, a, d) => {
  const newAngle = ((a + d) * Math.PI) / 180;
  const x2 = x + Math.cos(newAngle) * constants.CONNECTOR_TAIL_TRIANGLE_SIZE;
  const y2 = y + Math.sin(newAngle) * constants.CONNECTOR_TAIL_TRIANGLE_SIZE;
  return `${x2},${y2}`;
};

// getArrowPoints comes from the following blog post
// https://www.varvet.com/blog/svg-arrows-with-hover/
export const getArrowPoints = ([[x1, y1], [x2, y2]]) => {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const angleDegrees = (angle * 180) / Math.PI;
  return `\
    ${getPointOnCircle(x2, y2, angleDegrees, 0)} \
    ${getPointOnCircle(x2, y2, angleDegrees, 120)} \
    ${getPointOnCircle(x2, y2, angleDegrees, -120)} \
  `;
};

export const getRectIntersections = (from, to) => {
  const dx = constants.NODE_SVG_WIDTH / 2;
  const dy = constants.NODE_SVG_HEIGHT / 2;

  // get the center of the `from` and `to` rectangles
  const x1 = from.x + dx;
  const y1 = from.y + dy;
  const x2 = to.x + dx;
  const y2 = to.y + dy;

  // compute the slope of the line between `from` and `to`
  const slope = (y2 - y1) / (x2 - x1);

  if (Math.abs(slope) > constants.NODE_SLOPE) {
    if (y2 > y1) {
      return [[x1 + dy / slope, y1 + dy], [x2 - dy / slope, y2 - dy]];
    } else {
      return [[x1 - dy / slope, y1 - dy], [x2 + dy / slope, y2 + dy]];
    }
  } else {
    if (x2 > x1) {
      return [[x1 + dx, y1 + slope * dx], [x2 - dx, y2 - slope * dx]];
    } else {
      return [[x1 - dx, y1 - slope * dx], [x2 + dx, y2 + slope * dx]];
    }
  }
};
