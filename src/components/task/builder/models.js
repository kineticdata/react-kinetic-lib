import { List, OrderedMap, Record } from 'immutable';

export const Point = Record({ x: 0, y: 0 }, 'Point');

export const Tree = Record(
  {
    connectors: OrderedMap(),
    nextNodeId: 0,
    nextConnectorId: 0,
    nodes: OrderedMap(),
  },
  'Tree',
);

export const Node = Record({ id: null, name: '', position: Point() }, 'Node');

export const Connector = Record(
  {
    condition: '',
    dragging: null,
    headId: null,
    headPosition: Point(),
    id: null,
    label: '',
    tailId: null,
    tailPosition: Point(),
    type: 'Complete',
  },
  'Connector',
);

export const TreeBuilderState = Record(
  {
    undoStack: List(),
    tree: Tree({
      nextNodeId: 1,
      nodes: OrderedMap([
        [
          0,
          Node({ name: 'Start', id: 0, position: Point({ x: 150, y: 150 }) }),
        ],
      ]),
    }),
    redoStack: List(),
  },
  'TreeBuilderState',
);
