import * as constants from './constants';
import { List, Map, OrderedMap } from 'immutable';
import { Tree, Node, Connector } from './models';
import { isObject } from 'lodash-es';

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
  const ancestors = getAncestors(tree, node);
  return ancestors.isEmpty()
    ? bindify(tree.bindings)
    : bindify(tree.bindings).set(
        'Results',
        Map({
          children: ancestors
            // convert the node map to use the name as the key
            .mapKeys((_, node) => node.name)
            // normalize the outputs / results property (routine / handler
            // respectively)
            .map(node => {
              const task = tasks.get(node.definitionId);
              return (task && task.results) || task.outputs || [];
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
        }),
      );
};
