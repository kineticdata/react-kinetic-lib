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
  schemaVersion: '',
  sourceGroup: '',
  sourceName: '',
  taskDefinition: null,
  versionId: '0',
});

export const Node = Record({
  configured: true,
  deferrable: false,
  defers: false,
  definitionId: '',
  id: null,
  messages: List(),
  name: '',
  parameters: List(),
  position: Point(),
  version: 1,
  visible: true,
});

export const NodeParameter = Record({
  dependsOnId: '',
  dependsOnValue: '',
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
  headId: null,
  id: null,
  label: '',
  tailId: null,
  type: 'Complete',
});

export const TreeBuilderState = Record({
  categories: OrderedMap(),
  error: null,
  lastSave: null,
  loading: true,
  redoStack: List(),
  saving: false,
  tasks: OrderedMap(),
  tree: Tree(),
  undoStack: List(),
});

export const NodeResultDependency = Record({
  // where the dependency was found, one of:
  // connector id | node id message type | node id parameter id
  context: List(),
  // name of the node being referenced
  name: '',
  // position of the node name in the value
  index: 0,
});

/*******************************************************************************
 * Serialization functions                                                     *
 * Should take native objects that are returned from the API endpoints and     *
 * convert them to immutable records used by the builder implementation        *
 ******************************************************************************/

const deserializeNodeId = id => {
  const match = id.match(/_(\d+)$/);
  // the start node will not match the pattern above so we give that an id of 0
  return match ? parseInt(match[1]) : 0;
};

const serializeNodeId = node =>
  node.id === 0 ? 'start' : `${node.definitionId}_${node.id}`;

export const deserializeNode = ({
  id,
  messages,
  parameters,
  position,
  ...props
}) => {
  return Node({
    ...props,
    id: deserializeNodeId(id),
    messages: List(messages.map(NodeMessage)),
    parameters: List(parameters.map(NodeParameter)),
    position: Point(position),
  });
};

export const serializeNode = node =>
  node.set('id', serializeNodeId(node)).toJS();

export const deserializeConnector = ({ from, label, to, type, value }, id) => {
  const headId = deserializeNodeId(to);
  const tailId = deserializeNodeId(from);
  return Connector({
    condition: value,
    headId,
    id,
    label,
    tailId,
    type,
  });
};

export const serializeConnector = nodes => ({
  condition,
  headId,
  label,
  tailId,
  type,
}) => ({
  from: serializeNodeId(nodes.get(tailId)),
  label,
  to: serializeNodeId(nodes.get(headId)),
  type,
  value: condition,
});

export const deserializeTree = ({
  bindings,
  name,
  sourceGroup,
  sourceName,
  treeJson,
  versionId,
}) =>
  Tree({
    bindings,
    connectors: OrderedMap(
      treeJson.connectors.map(deserializeConnector).map(c => [c.id, c]),
    ),
    name,
    nextNodeId: treeJson.lastId + 1,
    nextConnectorId: treeJson.connectors.length,
    nodes: OrderedMap(treeJson.nodes.map(deserializeNode).map(n => [n.id, n])),
    schemaVersion: treeJson.schemaVersion,
    sourceGroup,
    sourceName,
    taskDefinition: treeJson.taskDefinition,
    versionId,
  });

export const serializeTree = (
  { connectors, nextNodeId, nodes, schemaVersion, taskDefinition, versionId },
  overwrite = false,
) => ({
  treeJson: {
    connectors: connectors
      .toList()
      .map(serializeConnector(nodes))
      .toJS(),
    lastId: nextNodeId - 1,
    nodes: nodes
      .toList()
      .map(serializeNode)
      .toJS(),
    schemaVersion,
    ...(taskDefinition ? { taskDefinition } : {}),
  },
  versionId: overwrite ? null : versionId,
});
