export const CONNECTOR_HEAD_RADIUS = 5;
export const CONNECTOR_LABEL_WIDTH = 130;
export const CONNECTOR_LABEL_HEIGHT = 18;
export const CONNECTOR_PADDING = 10;
export const CONNECTOR_TAIL_TRIANGLE_SIZE = 6;

export const NODE_RADIUS = 3;
export const NODE_HEIGHT = 60;
export const NODE_WIDTH = 180;
export const NODE_STROKE_WIDTH = 2;

// Derived constants
export const NODE_SVG_HEIGHT = NODE_HEIGHT + NODE_STROKE_WIDTH * 2;
export const NODE_SVG_WIDTH = NODE_WIDTH + NODE_STROKE_WIDTH * 2;
export const NODE_CENTER_X = NODE_SVG_WIDTH / 2;
export const NODE_CENTER_Y = NODE_SVG_HEIGHT / 2;
export const NODE_SLOPE = NODE_SVG_HEIGHT / NODE_SVG_WIDTH;
