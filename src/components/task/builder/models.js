import { List, Record } from 'immutable';

export const Point = Record({ x: 0, y: 0 }, 'Point');

export const Tree = Record({ nodes: List(), connectors: List() }, 'Tree');

export const Node = Record({ id: null, name: '', position: Point() }, 'Node');

export const Connector = Record(
  {
    id: null,
    headId: null,
    headPosition: Point(),
    tailId: null,
    tailPosition: Point(),
    label: '',
    dragging: null,
  },
  'Connector',
);

export const TreeBuilderState = Record(
  {
    undoStack: List(),
    tree: Tree({
      nodes: List([
        Node({ name: 'Start', id: 0, position: Point({ x: 150, y: 150 }) }),
      ]),
    }),
    redoStack: List(),
  },
  'TreeBuilderState',
);
