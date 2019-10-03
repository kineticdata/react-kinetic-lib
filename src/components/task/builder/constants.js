export const CONNECTOR_HEAD_RADIUS = 4;
export const CONNECTOR_LABEL_WIDTH = 130;
export const CONNECTOR_LABEL_HEIGHT = 18;
export const CONNECTOR_TAIL_TRIANGLE_SIZE = 3;

export const NODE_RADIUS = 3;
export const NODE_HEIGHT = 60;
export const NODE_PADDING = 8;
export const NODE_WIDTH = 180;
export const NODE_STROKE_WIDTH = 2;

// Derived constants
// Note that half of the stroke is drawn within the rect, so instead of adding
// 2x stroke width to the node height we just add it 1x
export const NODE_SVG_HEIGHT =
  NODE_HEIGHT + NODE_STROKE_WIDTH + NODE_PADDING * 2;
export const NODE_SVG_WIDTH = NODE_WIDTH + NODE_STROKE_WIDTH + NODE_PADDING * 2;
export const NODE_RECT_OFFSET_X = NODE_STROKE_WIDTH / 2 + NODE_PADDING;
export const NODE_RECT_OFFSET_Y = NODE_STROKE_WIDTH / 2 + NODE_PADDING;
export const NODE_CENTER_X = NODE_SVG_WIDTH / 2;
export const NODE_CENTER_Y = NODE_SVG_HEIGHT / 2;
export const NODE_SLOPE = NODE_SVG_HEIGHT / NODE_SVG_WIDTH;
