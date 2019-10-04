import * as constants from './constants';

export const isIE11 = document.documentMode === 11;

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
export const getArrowPoints = ([{ x: x1, y: y1 }, { x: x2, y: y2 }]) => {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const angleDegrees = (angle * 180) / Math.PI;
  return `\
    ${getPointOnCircle(x2, y2, angleDegrees, 0)} \
    ${getPointOnCircle(x2, y2, angleDegrees, 120)} \
    ${getPointOnCircle(x2, y2, angleDegrees, -120)} \
  `;
};

export const getRectIntersections = ({
  headPoint,
  headRect,
  tailPoint,
  tailRect,
}) => {
  // get the center of the `from` and `to` rectangles
  const x1 = tailPoint ? tailPoint.x : tailRect.x + constants.NODE_CENTER_X;
  const y1 = tailPoint ? tailPoint.y : tailRect.y + constants.NODE_CENTER_Y;
  const x2 = headPoint ? headPoint.x : headRect.x + constants.NODE_CENTER_X;
  const y2 = headPoint ? headPoint.y : headRect.y + constants.NODE_CENTER_Y;

  const dx = constants.NODE_CENTER_X + constants.NODE_PADDING;
  const dy = constants.NODE_CENTER_Y + constants.NODE_PADDING;

  // compute the slope of the line between `from` and `to`
  const slope = (y2 - y1) / (x2 - x1);

  if (Math.abs(slope) > constants.NODE_SLOPE) {
    if (y2 > y1) {
      return [
        tailPoint || { x: x1 + dy / slope, y: y1 + dy },
        headPoint || { x: x2 - dy / slope, y: y2 - dy },
      ];
    } else {
      return [
        tailPoint || { x: x1 - dy / slope, y: y1 - dy },
        headPoint || { x: x2 + dy / slope, y: y2 + dy },
      ];
    }
  } else {
    if (x2 > x1) {
      return [
        tailPoint || { x: x1 + dx, y: y1 + slope * dx },
        headPoint || { x: x2 - dx, y: y2 - slope * dx },
      ];
    } else {
      return [
        tailPoint || { x: x1 - dx, y: y1 - slope * dx },
        headPoint || { x: x2 + dx, y: y2 + slope * dx },
      ];
    }
  }
};

export const isPointInNode = point => node =>
  point &&
  node &&
  point.x >= node.x &&
  point.x <= node.x + constants.NODE_WIDTH &&
  point.y >= node.y &&
  point.y <= node.y + constants.NODE_HEIGHT;
