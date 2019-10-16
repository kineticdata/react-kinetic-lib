import { all, call, put, takeEvery } from 'redux-saga/effects';
import { action, dispatch, regHandlers, regSaga } from '../../../store';
import {
  deserializeTree,
  Connector,
  Node,
  Point,
  TreeBuilderState,
} from './models';
import { fetchTaskCategories, fetchTree2 } from '../../../apis/task';

export const mountTreeBuilder = treeKey => dispatch('TREE_MOUNT', { treeKey });
export const unmountTreeBuilder = treeKey =>
  dispatch('TREE_UNMOUNT', { treeKey });
export const configureTreeBuilder = props => dispatch('TREE_CONFIGURE', props);

// Helper that adds the present state to the past stack and clears the future
// stack. This should be called by reducer cases that will be undo/redo able.
const remember = (state, treeKey) =>
  state
    .updateIn(['trees', treeKey, 'undoStack'], stack =>
      stack.push(state.getIn(['trees', treeKey, 'tree'])),
    )
    .deleteIn(['trees', treeKey, 'redoStack']);

regSaga(
  takeEvery('TREE_CONFIGURE', function*({ payload }) {
    const { name, source, sourceGroup, treeKey } = payload;
    const [{ tree }, { categories }] = yield all([
      call(fetchTree2, {
        source,
        sourceGroup,
        name,
        include: 'bindings,details,treeJson',
      }),
      call(fetchTaskCategories, {
        include:
          'handlers.results,handlers.parameters,trees.parameters,trees.inputs,trees.outputs',
      }),
    ]);
    yield put(
      action('TREE_LOADED', {
        categories,
        treeKey,
        tree: deserializeTree(tree),
      }),
    );
  }),
);

regHandlers({
  TREE_SET_TASKS: (state, { payload: { categories } }) =>
    state.setIn(['taskCategories'], categories),
  // the TreeBuilder component does nothing while the tree state is undefined,
  // on mount we set it to null to signal to the component to dispatch the
  // configure action with its configuration props
  TREE_MOUNT: (state, { payload: { treeKey } }) =>
    state.setIn(['trees', treeKey], null),
  // the primary purpose of the configure action is to trigger the fetches in a
  // saga but to prevent extra calls we set the tree state to false (instead of
  // null) so the component doesn't keep dispatching configure actions
  TREE_CONFIGURE: (state, { payload: { treeKey } }) =>
    state.setIn(['trees', treeKey], false),
  TREE_UNMOUNT: (state, { payload: { treeKey } }) =>
    state.deleteIn(['trees', treeKey]),
  TREE_LOADED: (state, { payload: { categories, treeKey, tree } }) =>
    state.setIn(['trees', treeKey], TreeBuilderState({ categories, tree })),
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
  TREE_ADD_NODE_WITH_CONNECTOR: (state, { payload: { treeKey, parentId } }) => {
    const { connectors, nextConnectorId, nextNodeId, nodes } = state.getIn([
      'trees',
      treeKey,
      'tree',
    ]);
    const parentPosition = nodes.get(parentId).position;
    const position = Point({
      x: parentPosition.x + 300,
      y: parentPosition.y + 300,
    });
    const node = Node({
      id: `node_v0_${nextNodeId}`,
      name: `Node ${nextNodeId}`,
      position,
    });
    const connector = Connector({
      id: nextConnectorId,
      headId: node.id,
      headPosition: position,
      tailId: parentId,
      tailPosition: parentPosition,
    });
    return remember(state, treeKey).mergeIn(['trees', treeKey, 'tree'], {
      connectors: connectors.set(nextConnectorId, connector),
      nextConnectorId: nextConnectorId + 1,
      nextNodeId: nextNodeId + 1,
      nodes: nodes.set(node.id, node),
    });
  },
  TREE_UPDATE_NODE: (
    state,
    { payload: { treeKey, id, name, defers, visible } },
  ) =>
    remember(state, treeKey).updateIn(['trees', treeKey, 'tree'], tree =>
      tree.mergeIn(['nodes', id], { name, defers, visible }),
    ),
  TREE_UPDATE_NODE_POSITION: (state, { payload: { treeKey, id, position } }) =>
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
      .deleteIn(['trees', treeKey, 'tree', 'nodes', id])
      .updateIn(['trees', treeKey, 'tree', 'connectors'], connectors =>
        connectors.filter(
          connector => connector.headId !== id && connector.tailId !== id,
        ),
      ),
  TREE_ADD_CONNECTOR: (state, { payload: { treeKey, headId, tailId } }) =>
    remember(state, treeKey).updateIn(['trees', treeKey, 'tree'], tree => {
      const headPosition = tree.getIn(['nodes', headId, 'position']);
      const tailPosition = tree.getIn(['nodes', tailId, 'position']);
      return tree
        .update('connectors', connectors =>
          connectors.set(
            tree.nextConnectorId,
            Connector({
              id: tree.nextConnectorId,
              headId,
              headPosition,
              tailId,
              tailPosition,
            }),
          ),
        )
        .update('nextConnectorId', id => id + 1);
    }),
  TREE_UPDATE_CONNECTOR: (
    state,
    { payload: { treeKey, id, type, label, condition } },
  ) =>
    state.hasIn(['trees', treeKey, 'tree', 'connectors', id])
      ? remember(state, treeKey).mergeIn(
          ['trees', treeKey, 'tree', 'connectors', id],
          {
            type,
            label,
            condition,
          },
        )
      : state,
  TREE_REMOVE_CONNECTOR: (state, { payload: { treeKey, id } }) =>
    remember(state, treeKey).deleteIn([
      'trees',
      treeKey,
      'tree',
      'connectors',
      id,
    ]),
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
