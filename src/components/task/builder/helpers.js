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
  // Compute the points that make up the full path of the connector before
  // accounting for intersections. This will either be between the center of two
  // rects or from a dragging point to the center of a rect.
  const x1 = tailPoint ? tailPoint.x : tailRect.x + constants.NODE_CENTER_X;
  const y1 = tailPoint ? tailPoint.y : tailRect.y + constants.NODE_CENTER_Y;
  const x2 = headPoint ? headPoint.x : headRect.x + constants.NODE_CENTER_X;
  const y2 = headPoint ? headPoint.y : headRect.y + constants.NODE_CENTER_Y;

  // To compute the intersection points we will be adding/subtracting values
  // from the points above  using the slope computed below. The maximum distance
  // from the center of the rectangle is the height and width computed below.
  // If the intersection is exactly in the corner for example, its point is
  // (x - dxMax, y - dyMax). Its more likely that it will not intersect exactly
  // in the corner in which one of the max deltas will be applied and the other
  // will be multiplied or divided by the slope.
  const dxMax = constants.NODE_CENTER_X + constants.NODE_PADDING;
  const dyMax = constants.NODE_CENTER_Y + constants.NODE_PADDING;

  // Compute the slope of the connector to be drawn.
  const slope = Math.abs((y2 - y1) / (x2 - x1));

  // If the connector's slope is steeper than the node's slope, the line will
  // be intersecting with the top of the node so the entire dy value will be
  // applied but we will need to compute the appropriate dx.
  // => slope = dy / dx.
  // => dx * slope = dy.
  // => dx = dy / slope.
  const dx = slope > constants.NODE_SLOPE ? dyMax / slope : dxMax;

  // If the connector's slope is shallower than the node's slope, it will be
  // intersecting along the height of the node so the entire dx value will be
  // applied but we will need to compute the appropriate dy.
  // => slope = dy / dx.
  // => dy = dx * slope.
  const dy = slope < constants.NODE_SLOPE ? dxMax * slope : dyMax;

  // If the connector is moving in the positive direction on either access we
  // will be subtracting the `dx` and `dy` values above from the `head`
  // rectangle centers and adding the `dx` and `dy` values to the `tail`
  // rectangle.
  const dxMultiplier = x2 > x1 ? -1 : 1;
  const dyMultiplier = y2 > y1 ? -1 : 1;

  // Finally we return either the tail / head points if we are dragging one of
  // them or we compute the intersection point(s) by applying the deltas
  // computed above.
  return [
    tailPoint || { x: x1 - dx * dxMultiplier, y: y1 - dy * dyMultiplier },
    headPoint || { x: x2 + dx * dxMultiplier, y: y2 + dy * dyMultiplier },
  ];
};

export const isPointInNode = point => node =>
  point &&
  node &&
  point.x >= node.x &&
  point.x <= node.x + constants.NODE_WIDTH &&
  point.y >= node.y &&
  point.y <= node.y + constants.NODE_HEIGHT;
