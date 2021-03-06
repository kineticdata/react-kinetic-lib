import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import { List, OrderedMap } from 'immutable';
import { isFunction } from 'lodash-es';
import { action, dispatch, regHandlers, regSaga } from '../../../store';
import {
  deserializeTree,
  serializeTree,
  Connector,
  TreeBuilderState,
} from './models';
import {
  cloneTree,
  fetchTaskCategories,
  fetchTree,
  updateTree,
} from '../../../apis/task';
import { renameDependencies, treeReturnTask } from './helpers';

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
    try {
      const { name, sourceGroup, sourceName, treeKey } = payload;

      const [{ tree }, { categories }] = yield all([
        call(fetchTree, {
          name,
          sourceGroup,
          sourceName,
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
    } catch (e) {
      console.error('Caught error loading tree', e);
    }
  }),
);

regSaga(
  takeEvery('TREE_SAVE', function*({ payload }) {
    try {
      // because of the optimistic locking functionality newName / overwrite can
      // be passed as options to the builder's save function
      const { newName, onError, onSave, overwrite, treeKey } = payload;
      const { tree } = yield select(state => state.getIn(['trees', treeKey]));
      const { name, sourceGroup, sourceName } = tree;
      // if a newName was passed we will be creating a new tree with the builder
      // contents, otherwise just an update
      const { error, tree: newTree } = yield newName
        ? call(cloneTree, {
            name,
            sourceGroup,
            sourceName,
            tree: {
              name: newName,
              ...serializeTree(tree, true),
            },
          })
        : call(updateTree, {
            name,
            sourceGroup,
            sourceName,
            tree: serializeTree(tree, overwrite),
          });
      // dispatch the appropriate action based on the result of the call above
      yield put(
        error
          ? action('TREE_SAVE_ERROR', {
              treeKey,
              error: error.message || error,
              onError,
            })
          : action('TREE_SAVE_SUCCESS', { treeKey, tree: newTree, onSave }),
      );
    } catch (e) {
      console.error(e);
    }
  }),
);

regSaga(
  takeEvery('TREE_SAVE_ERROR', function*({ payload: { error, onError } }) {
    try {
      if (isFunction(onError)) {
        yield call(onError, error);
      }
    } catch (e) {
      console.error(e);
    }
  }),
);

regSaga(
  takeEvery('TREE_SAVE_SUCCESS', function*({ payload: { onSave, tree } }) {
    try {
      if (isFunction(onSave)) {
        yield call(onSave, tree);
      }
    } catch (e) {
      console.error(e);
    }
  }),
);

regHandlers({
  // the TreeBuilder component does nothing while the tree state is undefined,
  // on mount we set it to null to signal to the component to dispatch the
  // configure action with its configuration props
  TREE_MOUNT: (state, { payload: { treeKey } }) =>
    state.setIn(['trees', treeKey], null),
  TREE_CONFIGURE: (state, { payload: { treeKey } }) =>
    state.setIn(['trees', treeKey], TreeBuilderState()),
  TREE_UNMOUNT: (state, { payload: { treeKey } }) =>
    state.deleteIn(['trees', treeKey]),
  TREE_LOADED: (state, { payload: { categories, treeKey, tree } }) =>
    state.mergeIn(['trees', treeKey], {
      categories,
      lastSave: tree,
      loading: false,
      tasks: List(categories)
        .map(category =>
          category.name === 'System Controls'
            ? {
                ...category,
                handlers: [...category.handlers, treeReturnTask(tree)],
              }
            : category,
        )
        .flatMap(category => [...category.handlers, ...category.trees])
        .sortBy(task => task.name)
        .reduce(
          (reduction, task) => reduction.set(task.definitionId, task),
          OrderedMap(),
        ),
      tree,
    }),
  TREE_SAVE: (state, { payload: { treeKey } }) =>
    state.mergeIn(['trees', treeKey], {
      saving: true,
    }),
  TREE_SAVE_ERROR: (state, { payload: { treeKey, error } }) =>
    state.mergeIn(['trees', treeKey], {
      error,
      saving: false,
    }),
  TREE_SAVE_SUCCESS: (state, { payload: { tree, treeKey } }) => {
    const newTree = state.getIn(['trees', treeKey, 'tree']).merge({
      name: tree.name,
      versionId: tree.versionId,
    });
    return state.mergeIn(['trees', treeKey], {
      dirty: false,
      error: null,
      lastSave: newTree,
      saving: false,
      tree: newTree,
    });
  },
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
  TREE_UPDATE: (state, { payload: { tree, treeKey } }) =>
    remember(state, treeKey).setIn(['trees', treeKey, 'tree'], tree),
  TREE_UPDATE_NODE: (
    state,
    {
      payload: {
        treeKey,
        id,
        messages,
        deferrable,
        defers,
        definitionId,
        dependencies,
        name,
        parameters,
        visible,
      },
    },
  ) =>
    remember(state, treeKey)
      .mergeIn(['trees', treeKey, 'tree', 'nodes', id], {
        deferrable,
        defers,
        definitionId,
        messages,
        name,
        parameters,
        visible,
      })
      .updateIn(
        ['trees', treeKey, 'tree'],
        renameDependencies(dependencies, name),
      ),
  TREE_UPDATE_NODE_POSITION: (state, { payload: { treeKey, id, position } }) =>
    remember(state, treeKey).setIn(
      ['trees', treeKey, 'tree', 'nodes', id, 'position'],
      position,
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
    remember(state, treeKey).updateIn(['trees', treeKey, 'tree'], tree =>
      tree
        .update('connectors', connectors =>
          connectors.set(
            tree.nextConnectorId,
            Connector({
              id: tree.nextConnectorId,
              headId,
              tailId,
            }),
          ),
        )
        .update('nextConnectorId', id => id + 1),
    ),
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
    remember(state, treeKey).setIn(
      ['trees', treeKey, 'tree', 'connectors', id, 'headId'],
      nodeId,
    ),
  TREE_UPDATE_CONNECTOR_TAIL: (state, { payload: { treeKey, id, nodeId } }) =>
    remember(state, treeKey).setIn(
      ['trees', treeKey, 'tree', 'connectors', id, 'tailId'],
      nodeId,
    ),
});
