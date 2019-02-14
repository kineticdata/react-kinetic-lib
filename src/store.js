import { applyMiddleware, compose, createStore } from 'redux';
import { Map } from 'immutable';
import { reducer, regHandlers } from './reducer';
import { commitSagas, regSaga, runSaga, sagaMiddleware } from './saga';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ name: 'react-kinetic-lib' })
  : compose;

const store = createStore(
  reducer,
  Map(),
  composeEnhancers(applyMiddleware(sagaMiddleware)),
);

const dispatch = (type, payload) => store.dispatch({ type, payload });
const dispatcher = type => payload => store.dispatch({ type, payload });

const commitStore = () => {
  commitSagas();
};

export {
  commitStore,
  dispatch,
  dispatcher,
  reducer,
  regHandlers,
  regSaga,
  runSaga,
  store,
};
