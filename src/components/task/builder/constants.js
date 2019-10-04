export const CANVAS_SCALE_MAX = 1.0;
export const CANVAS_SCALE_MIN = 0.1;
export const CANVAS_ZOOM_MODIFIER = 2000;
export const THROTTLE_DRAG = 16;
export const THROTTLE_ZOOM = 33;

export const CONNECTOR_HEAD_RADIUS = 4;
export const CONNECTOR_LABEL_WIDTH = 130;
export const CONNECTOR_LABEL_HEIGHT = 18;
export const CONNECTOR_TAIL_TRIANGLE_SIZE = 3;

export const NODE_RADIUS = 3;
export const NODE_HEIGHT = 60;
export const NODE_PADDING = 16;
export const NODE_WIDTH = 180;

// Derived constants
export const NODE_CENTER_X = NODE_WIDTH / 2;
export const NODE_CENTER_Y = NODE_HEIGHT / 2;
export const NODE_SLOPE =
  (NODE_HEIGHT + 2 * NODE_PADDING) / (NODE_WIDTH + 2 * NODE_PADDING);
