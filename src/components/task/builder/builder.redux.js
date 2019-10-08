import { dispatch, regHandlers } from '../../../store';
import { Connector, Node, Point, TreeBuilderState } from './models';

export const mountTreeBuilder = treeKey => dispatch('TREE_MOUNT', { treeKey });
export const unmountTreeBuilder = treeKey =>
  dispatch('TREE_UNMOUNT', { treeKey });

// Helper that adds the present state to the past stack and clears the future
// stack. This should be called by reducer cases that will be undo/redo able.
const remember = (state, treeKey) =>
  state
    .updateIn(['trees', treeKey, 'undoStack'], stack =>
      stack.push(state.getIn(['trees', treeKey, 'tree'])),
    )
    .deleteIn(['trees', treeKey, 'redoStack']);

regHandlers({
  TREE_MOUNT: (state, { payload: { treeKey } }) =>
    state.setIn(['trees', treeKey], TreeBuilderState()),
  TREE_UNMOUNT: (state, { payload: { treeKey } }) =>
    state.deleteIn(['trees', treeKey]),
  TREE_UNDO: (state, { payload: { treeKey } }) =>
    state.getIn(['trees', treeKey, 'undoStack']).isEmpty()
      ? state
      : state.updateIn(['trees', treeKey], builderState =>
          builderState.merge({
            tree: builderState.undoStack.last(),
            redoStack: builderState.redoStack.push(builderState.tree),
            undoStack: builderState.undoStack.butLast(),
          }),
        ),
  TREE_REDO: (state, { payload: { treeKey } }) =>
    state.getIn(['trees', treeKey, 'redoStack']).isEmpty()
      ? state
      : state.updateIn(['trees', treeKey], builderState =>
          builderState.merge({
            tree: builderState.redoStack.last(),
            redoStack: builderState.redoStack.butLast(),
            undoStack: builderState.undoStack.push(builderState.tree),
          }),
        ),
  TREE_ADD_NODE: (state, { payload: { treeKey, name, x, y } }) =>
    remember(state, treeKey).updateIn(
      ['trees', treeKey, 'tree', 'nodes'],
      nodes => nodes.push(Node({ id: nodes.size, x: x + 50, y: y + 50, name })),
    ),
  TREE_ADD_NODE_WITH_CONNECTOR: (
    state,
    { payload: { treeKey, parentId, x, y, name, connectorLabel } },
  ) => {
    const parentPosition = state.getIn([
      'trees',
      treeKey,
      'tree',
      'nodes',
      parentId,
      'position',
    ]);
    const position = Point({
      x: parentPosition.x + 300,
      y: parentPosition.y + 300,
    });
    return remember(state, treeKey)
      .updateIn(['trees', treeKey, 'tree', 'nodes'], nodes =>
        nodes.push(Node({ id: nodes.size, name, position })),
      )
      .updateIn(['trees', treeKey, 'tree', 'connectors'], connectors =>
        connectors.push(
          Connector({
            id: connectors.size,
            headId: state.getIn(['trees', treeKey, 'tree', 'nodes']).size,
            headPosition: position,
            tailId: parentId,
            tailPosition: parentPosition,
            label: connectorLabel,
          }),
        ),
      );
  },
  TREE_UPDATE_NODE: (state, { payload: { treeKey, id, position } }) =>
    remember(state, treeKey).updateIn(['trees', treeKey, 'tree'], tree =>
      tree
        .mergeIn(['nodes', id], { position })
        .update('connectors', connectors =>
          connectors.map(connector =>
            connector.headId === id
              ? connector.set('headPosition', position)
              : connector.tailId === id
              ? connector.set('tailPosition', position)
              : connector,
          ),
        ),
    ),
  TREE_REMOVE_NODE: (state, { payload: { treeKey, id } }) =>
    remember(state, treeKey)
      .setIn(['trees', treeKey, 'tree', 'nodes', id], null)
      .updateIn(['trees', treeKey, 'tree', 'connectors'], connectors =>
        connectors.filter(
          connector => connector.headId !== id && connector.tailId !== id,
        ),
      ),
  TREE_ADD_CONNECTOR: (state, { payload: { treeKey, connector } }) => state,
  TREE_REMOVE_CONNECTOR: (state, { payload: { treeKey, connector } }) => state,
  TREE_UPDATE_CONNECTOR_HEAD: (state, { payload: { treeKey, id, nodeId } }) =>
    remember(state, treeKey).updateIn(['trees', treeKey, 'tree'], tree =>
      tree.mergeIn(['connectors', id], {
        headId: nodeId,
        headPosition: tree.getIn(['nodes', nodeId, 'position']),
      }),
    ),
  TREE_UPDATE_CONNECTOR_TAIL: (state, { payload: { treeKey, id, nodeId } }) =>
    remember(state, treeKey).updateIn(['trees', treeKey, 'tree'], tree =>
      tree.mergeIn(['connectors', id], {
        tailId: nodeId,
        tailPosition: tree.getIn(['nodes', nodeId, 'position']),
      }),
    ),
});
