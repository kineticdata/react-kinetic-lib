import * as constants from './constants';
import { List, Map, OrderedMap } from 'immutable';
import { isObject } from 'lodash-es';
import { dispatch } from '../../../store';
import {
  processErbTemplate,
  processRuby,
} from '../../common/code_input/languageHelpers';
import { Node, Connector, NodeParameter, NodeResultDependency } from './models';
import { NEW_TASK_DX, NEW_TASK_DY } from './constants';

export const isIE11 = document.documentMode === 11;

export const getRectIntersections = ({ dragging, head, tail }) => {
  // Compute the points that make up the full path of the connector before
  // accounting for intersections. This will either be between the center of two
  // rects or from a dragging point to the center of a rect.
  const x1 = dragging === 'tail' ? tail.x : tail.x + constants.NODE_CENTER_X;
  const y1 = dragging === 'tail' ? tail.y : tail.y + constants.NODE_CENTER_Y;
  const x2 = dragging === 'head' ? head.x : head.x + constants.NODE_CENTER_X;
  const y2 = dragging === 'head' ? head.y : head.y + constants.NODE_CENTER_Y;

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
    dragging === 'tail'
      ? tail
      : { x: x1 - dx * dxMultiplier, y: y1 - dy * dyMultiplier },
    dragging === 'head'
      ? head
      : { x: x2 + dx * dxMultiplier, y: y2 + dy * dyMultiplier },
  ];
};

export const isPointInNode = point => node =>
  point &&
  node &&
  point.x >= node.position.x &&
  point.x <= node.position.x + constants.NODE_WIDTH &&
  point.y >= node.position.y &&
  point.y <= node.position.y + constants.NODE_HEIGHT;

const concatMap = (map1, map2) =>
  map2.reduce((reduction, value, key) => reduction.set(key, value), map1);

// gets the parents for the given node by searching through the tree's
// connectors by `headId` then retrieving the parent nodes from the tree's node
// map
const getParents = (tree, node) =>
  tree.connectors
    .toList()
    .filter(connector => connector.headId === node.id)
    .map(connector => tree.nodes.get(connector.tailId));

// gets the ancestors for the given node by recursively traversing the parent
// nodes, as a map, the result should not contain duplicates and this processes
// in depth-first order
export const getAncestors = (tree, node, result = Map()) =>
  // get the direct parents of the node, adding them to the result and making
  // recursive call from the parent if necessary
  getParents(tree, node).reduce(
    (reduction, parent) =>
      // if the parent is already inside the result we do not want to re-add and
      // definitely do not want to make a recursive call
      reduction.has(parent.id)
        ? reduction
        : // make the recursive call for ancestors from the parent node (making
          // sure to add it to the result map passed forward), then concat the
          // result of the recursive call with the our current reduction value (so
          // sibling recursive calls will not reprocess nodes already present)
          concatMap(
            reduction,
            getAncestors(tree, parent, reduction.set(parent.id, parent)),
          ),
    result,
  );

// recursive helper that calls bindify if the current raw value is an object
// or returns the leaf value object if not (removing the erb tags at the same
// time)
const bindify = raw =>
  Map(raw).map(value =>
    isObject(value)
      ? Map({ children: bindify(value) })
      : Map({ value: value.replace(/^<%=(.*)%>$/, '$1') }),
  );

export const buildBindings = (tree, tasks, node) => {
  const ancestorResultBindings = Map({
    children: getAncestors(tree, node)
      // convert the node map to use the name as the key
      .mapKeys((_, node) => node.name)
      // normalize the outputs / results property (routine / handler
      // respectively)
      .map(node => {
        const task = tasks.get(node.definitionId);
        return (task && (task.results || task.outputs)) || [];
      })
      // filter out any nodes that have no outputs / results
      .filter(results => results.length > 0)
      // convert the results list to the bindings map using the name property
      // of each result object
      .map((results, nodeNode) =>
        Map({
          children: OrderedMap(
            results.map(result => [
              result.name,
              Map({
                value: `@results['${nodeNode}']['${result.name}']`,
              }),
            ]),
          ),
        }),
      ),
  });
  const otherBindings = bindify(tree.bindings);
  return ancestorResultBindings.get('children').isEmpty()
    ? otherBindings
    : otherBindings.set('Results', ancestorResultBindings);
};

// implements the process of adding a new task node and connector to the tree,
// it curries some parameters that should be applied by the click event in the
// parent node, then returns a function called selectTaskDefinition which the
// should be called with a task definition, then it stubs out a node and
// connector and passes a complete function which should be called with the
// fully configured node and connector
export const addNewTask = (treeKey, tree, parent) => ({
  tree: tree,
  selectCloneNode: cloneNode =>
    addNewTaskNext({ cloneNode, parent, tree, treeKey }),
  selectTaskDefinition: task => addNewTaskNext({ parent, task, tree, treeKey }),
});

const addNewTaskNext = ({ cloneNode, parent, task, tree, treeKey }) => {
  const { connectors, nextConnectorId, nextNodeId, nodes } = tree;
  const position = parent.position
    .update('x', x => x + NEW_TASK_DX)
    .update('y', y => y + NEW_TASK_DY);
  const definitionId = task ? task.definitionId : cloneNode.definitionId;
  // stub out the new connector and node, these will be provided via return and
  // are meant to be passed to <ConnectorForm> and <NodeForm> respectively to be
  // further configured by the consumer of the <TreeBuilder>
  const connector = Connector({
    id: nextConnectorId,
    headId: nextNodeId,
    headPosition: position,
    tailId: parent.id,
    tailPosition: parent.position,
  });
  const node = Node({
    id: nextNodeId,
    position,
    deferrable: task ? task.deferrable : cloneNode.deferrable,
    defers: task ? task.deferrable : cloneNode.defers,
    definitionId,
    visible: task ? task.visible : cloneNode.visible,
    parameters: cloneNode
      ? cloneNode.parameters
      : List(task.parameters || task.inputs || [])
          .map(normalizeParameter)
          .map(NodeParameter),
  });
  // add the stubbed connector and node to the current tree, this is done to
  // accommodate the <CodeInput> bindings helper in <ConnectorForm> and
  // <NodeForm>
  const stagedTree = tree.merge({
    connectors: connectors.set(connector.id, connector),
    nextConnectorId: nextConnectorId + 1,
    nextNodeId: nextNodeId + 1,
    nodes: nodes.set(node.id, node),
  });
  // return the pieces of data that will be passed to <ConnectorForm> and
  // <NodeForm> instances and also pass a `complete` function that should be
  // called with the final connector and node records that are to be added to
  // the tree and persisted
  return {
    connector,
    node,
    stagedTree,
    complete: ({ connector, node }) => {
      return dispatch('TREE_UPDATE', {
        treeKey,
        tree: stagedTree
          .setIn(['connectors', connector.id], connector)
          .setIn(['nodes', node.id], node),
      });
    },
  };
};

// regular expression that extracts the content from a string token which will
// be wrapped with the various delimiters
const STRING_CONTENT_REGEX = /((?:%[qQiIwWxs]?)?.)(.*)(.)/;

// takes a erb / ruby strings and checks for references to @results['Node name']
// using the language helpers,
export const parseNodeResultDependencies = (context, value, erb) =>
  (erb ? processErbTemplate : processRuby)(value).reduce(
    ([reduction, index, last1, last2], token) => {
      const [content, type] = token;
      // if the current token is just whitespace we do not want to
      // change the last1, last2 values, just increment the index
      if ((type === undefined || type === 'erb') && content.match(/\s+/)) {
        return [reduction, index + content.length, last1, last2];
      }
      // check to see if this token represents a node name dependency,
      // if it is a string preceded by the [ punctuation preceded by the
      // @results variable
      const match =
        type === 'string' &&
        last1 &&
        last1[0] === '[' &&
        last1[1] === 'punctuation' &&
        last2 &&
        last2[0] === '@results' &&
        last2[1] === 'variable'
          ? content.match(STRING_CONTENT_REGEX)
          : null;
      // if it matched then we add the string's contents to the reduction along
      // with the index of the contents (using the first part of the match to
      // because there are different lengths of delimiters ", %^, %Q(, etc.)
      const newReduction = match
        ? reduction.push(
            NodeResultDependency({
              context: List(context),
              name: match[2],
              index: index + match[1].length,
            }),
          )
        : reduction;
      return [newReduction, index + content.length, token, last1];
    },
    [List(), 0, null, null],
  )[0];

export const getConnectorDependencies = ({ condition, id }) =>
  parseNodeResultDependencies(['connectors', id, 'condition'], condition);

export const getNodeDependencies = ({ id, messages, parameters }) =>
  List().concat(
    messages.flatMap(({ value }, i) =>
      parseNodeResultDependencies(
        ['nodes', id, 'messages', i, 'value'],
        value,
        true,
      ),
    ),
    parameters.flatMap(({ value }, i) =>
      parseNodeResultDependencies(
        ['nodes', id, 'parameters', i, 'value'],
        value,
        true,
      ),
    ),
  );

export const searchNodeResultDependencies = (tree, nodeName) =>
  List()
    .concat(
      tree.connectors.toList().flatMap(getConnectorDependencies),
      tree.nodes.toList().flatMap(getNodeDependencies),
    )
    .filter(dependency => dependency.name === nodeName);

// helper function that curries the dependency record and the new node name and
// then it takes the value and it splices the new node name into the value at
// the index defined in the dependency record also using the length of the old
// name in the dependency record
export const replace = (dependency, newName) => value =>
  value.slice(0, dependency.index) +
  newName +
  value.slice(dependency.index + dependency.name.length);

export const renameDependencies = (dependencies = List(), newName) => tree =>
  dependencies
    // sort the dependencies by index and reverse so that replacements made in
    // the same value will not affect each other (renaming Fooo to Foo would
    // change the index of following dependencies)
    .sortBy(dep => dep.index)
    .reverse()
    .reduce(
      (tree, dependency) =>
        tree.updateIn(dependency.context, replace(dependency, newName)),
      tree,
    );

// routines have `inputs` and handlers have `parameters` with slightly different
// properties so this is a helper function to take one or the other and return
// a consistent object
export const normalizeParameter = ({ name, id, ...rest }) => ({
  id: id || name,
  label: name,
  ...rest,
});
