import { List, OrderedMap, Record } from 'immutable';

/*******************************************************************************
 * Immutable records                                                           *
 ******************************************************************************/

export const Point = Record({ x: 0, y: 0 }, 'Point');

export const Tree = Record({
  bindings: OrderedMap(),
  connectors: OrderedMap(),
  name: '',
  nextNodeId: 0,
  nextConnectorId: 0,
  nodes: OrderedMap(),
  sourceGroup: '',
  sourceName: '',
  versionId: '0',
});

export const Node = Record({
  configured: true,
  deferrable: false,
  defers: false,
  definitionId: '',
  id: '',
  messages: List(),
  name: '',
  parameters: List(),
  position: Point(),
  version: 1,
  visible: true,
});

export const NodeParameter = Record({
  description: '',
  id: '',
  label: '',
  menu: '',
  required: false,
  value: '',
});

export const NodeMessage = Record({ type: '', value: '' });

export const Connector = Record({
  condition: '',
  dragging: null,
  headId: null,
  headPosition: Point(),
  id: null,
  label: '',
  tailId: null,
  tailPosition: Point(),
  type: 'Complete',
});

export const TreeBuilderState = Record({
  categories: OrderedMap(),
  error: null,
  loading: true,
  redoStack: List(),
  saving: false,
  tree: Tree(),
  undoStack: List(),
});

/*******************************************************************************
 * Serialization functions                                                     *
 * Should take native objects that are returned from the API endpoints and     *
 * convert them to immutable records used by the builder implementation        *
 ******************************************************************************/

export const deserializeNode = ({ messages, position, parameters, ...props }) =>
  Node({
    ...props,
    messages: List(messages.map(NodeMessage)),
    parameters: List(parameters.map(NodeParameter)),
    position: Point(position),
  });

export const serializeNode = node => node.toJS();

export const deserializeConnector = nodes => (
  { from, label, to, type, value },
  id,
) =>
  Connector({
    condition: value,
    headId: to,
    headPosition: nodes.getIn([to, 'position']),
    id,
    label,
    tailId: from,
    tailPosition: nodes.getIn([from, 'position']),
    type,
  });

export const serializeConnector = ({
  condition,
  headId,
  label,
  tailId,
  type,
}) => ({ from: tailId, label, to: headId, type, value: condition });

export const deserializeTree = ({
  bindings,
  name,
  sourceGroup,
  sourceName,
  treeJson,
  versionId,
}) => {
  const nodes = OrderedMap(
    treeJson.nodes.map(deserializeNode).map(n => [n.id, n]),
  );
  const connectors = OrderedMap(
    treeJson.connectors.map(deserializeConnector(nodes)).map(c => [c.id, c]),
  );
  return Tree({
    bindings,
    connectors,
    name,
    nextNodeId: treeJson.lastId + 1,
    nextConnectorId: connectors.size,
    nodes,
    sourceGroup,
    sourceName,
    versionId,
  });
};

export const serializeTree = (
  { connectors, nextNodeId, nodes, versionId },
  overwrite = false,
) => ({
  treeJson: {
    connectors: connectors
      .toList()
      .map(serializeConnector)
      .toJS(),
    lastId: nextNodeId - 1,
    nodes: nodes
      .toList()
      .map(serializeNode)
      .toJS(),
  },
  versionId: overwrite ? null : versionId,
});
