import { List } from 'immutable';

export const CANVAS_SCALE_OPTIONS = List.of(0.1, 0.25, 0.5, 0.75, 1, 1.33);
export const CANVAS_ZOOM_DURATION = 200;
export const CANVAS_ZOOM_MODIFIER = 2000;
export const THROTTLE_DRAG = 16;
export const THROTTLE_ZOOM = 16;

export const CONNECTOR_HEAD_POINTS = '-6,0 3,-6 3,6';
export const CONNECTOR_TAIL_RADIUS = 5;
export const CONNECTOR_LABEL_WIDTH = 130;
export const CONNECTOR_LABEL_HEIGHT = 18;
export const CONNECTOR_LABEL_PADDING = 5;
export const CONNECTOR_LABEL_RADIUS = 3;
export const CONNECTOR_STROKE_WIDTH = 4;

export const ICON_SIZE = 18;

export const NEW_TASK_DX = 0;
export const NEW_TASK_DY = 200;

export const NODE_BADGE_OFFSET = 6;
export const NODE_RADIUS = 3;
export const NODE_HEIGHT = 45;
export const NODE_PADDING = 9;
export const NODE_NAME_PADDING = 7.5;
export const NODE_WIDTH = 135;

// Derived constants
export const NODE_CENTER_X = NODE_WIDTH / 2;
export const NODE_CENTER_Y = NODE_HEIGHT / 2;
export const NODE_SLOPE =
  (NODE_HEIGHT + 2 * NODE_PADDING) / (NODE_WIDTH + 2 * NODE_PADDING);
export const ICON_CENTER = ICON_SIZE / 2;
export const CONNECTOR_LABEL_CENTER_X = CONNECTOR_LABEL_WIDTH / 2;
export const CONNECTOR_LABEL_CENTER_Y = CONNECTOR_LABEL_HEIGHT / 2;
