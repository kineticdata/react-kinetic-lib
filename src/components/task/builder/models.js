import { List, Record } from 'immutable';

export const Tree = Record({ nodes: List(), connectors: List() }, 'Tree');

export const Node = Record({ id: null, name: '', x: 0, y: 0 }, 'Node');

export const Connector = Record(
  {
    id: null,
    headId: null,
    tailId: null,
    label: '',
  },
  'Connector',
);

export const TreeBuilderState = Record(
  {
    undoStack: List(),
    tree: Tree({
      nodes: List([Node({ name: 'Start', x: 150, y: 150 })]),
    }),
    redoStack: List(),
  },
  'TreeBuilderState',
);
