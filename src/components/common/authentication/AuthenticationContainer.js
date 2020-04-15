import { Component } from 'react';
import { takeEvery, select, call, put } from 'redux-saga/effects';
import { isFunction } from 'lodash-es';
import {
  action,
  regHandlers,
  connect,
  dispatch,
  regSaga,
  store,
} from '../../../store';
import {
  login,
  logoutDirect,
  retrieveJwt,
  singleSignOn,
  fetchSpaMeta,
} from '../../../apis';
import { socketIdentify } from '../../../apis/socket';

const defaultLoginProps = {
  error: null,
  password: '',
  pending: false,
  username: '',
};

regHandlers({
  INITIALIZE: state => state.set('login', defaultLoginProps),
  LOGIN: state => state.mergeIn(['login'], { error: null, pending: true }),
  LOGOUT: state =>
    state
      .mergeIn(['session'], {
        loggedIn: false,
        token: null,
      })
      .set('login', defaultLoginProps),
  SET_AUTHENTICATED: (state, action) =>
    state
      .mergeIn(['session'], {
        loggedIn: true,
        token: action.payload.token,
      })
      .set('login', defaultLoginProps),
  SET_INITIALIZED: (state, action) =>
    state.mergeIn(['session'], {
      csrfToken: action.payload.csrfToken,
      initialized: true,
      loggedIn: !!action.payload.token,
      securityStrategies: action.payload.securityStrategies,
      socket: action.payload.socket,
      spaceSlug: action.payload.spaceSlug,
      token: action.payload.token,
    }),

  SET_ERROR: (state, action) =>
    state.mergeIn(['login'], {
      error: action.payload,
      password: '',
      pending: false,
    }),
  SET_PASSWORD: (state, action) =>
    state.setIn(['login', 'password'], action.payload),
  SET_USERNAME: (state, action) =>
    state.setIn(['login', 'username'], action.payload),
  SINGLE_SIGN_ON: state =>
    state.mergeIn(['login'], { error: null, pending: true }),
  TIMEOUT: state => state.setIn(['session', 'token'], null),
});

regSaga(
  takeEvery('LOGIN', function*({ payload }) {
    try {
      const socket = yield select(state => state.getIn(['session', 'socket']));
      const { username, password } = yield select(state => state.get('login'));
      const { error } = yield call(login, { username, password });
      if (error) {
        yield put({ type: 'SET_ERROR', payload: error.message });
      } else {
        const token = yield call(retrieveJwt);
        if (socket) {
          yield call(socketIdentify, token);
        }
        yield put({
          type: 'SET_AUTHENTICATED',
          payload: { token, callback: payload },
        });
      }
    } catch (e) {
      console.error(e);
    }
  }),
);

regSaga(
  takeEvery('SINGLE_SIGN_ON', function*({ payload: { callback, spaceSlug } }) {
    try {
      const socket = yield select(state => state.getIn(['session', 'socket']));
      const { error } = yield call(singleSignOn, spaceSlug, {
        width: 770,
        height: 750,
      });
      if (error) {
        yield put({ type: 'SET_ERROR', payload: error });
      } else {
        const token = yield call(retrieveJwt);
        if (socket) {
          yield call(socketIdentify, token);
        }
        yield put({
          type: 'SET_AUTHENTICATED',
          payload: { token, callback },
        });
      }
    } catch (e) {
      console.error(e);
    }
  }),
);

regSaga(
  takeEvery('INITIALIZE', function*({ payload: { socket } }) {
    try {
      const {
        securityStrategies,
        session: { csrfToken, isAuthenticated },
        spaceSlug,
      } = yield call(fetchSpaMeta);
      const token = isAuthenticated ? yield call(retrieveJwt) : null;
      if (socket && token) {
        yield call(socketIdentify, token);
      }
      yield put(
        action('SET_INITIALIZED', {
          csrfToken,
          securityStrategies,
          socket,
          spaceSlug,
          token,
        }),
      );
    } catch (e) {
      console.error(e);
    }
  }),
);

regSaga(
  takeEvery('LOGOUT_START', function*({ payload }) {
    try {
      const loggedIn = yield select(state => state.getIn(['session', 'token']));
      if (loggedIn) {
        yield call(logoutDirect);
      }
      yield put(action('LOGOUT'));
      if (isFunction(payload)) {
        yield call(payload);
      }
    } catch (e) {
      console.error(e);
    }
  }),
);

regSaga(
  takeEvery('SET_AUTHENTICATED', function*({ payload }) {
    if (isFunction(payload.callback)) {
      yield call(payload.callback);
    }
  }),
);

const onChangeUsername = e => {
  dispatch('SET_USERNAME', e.target.value);
};

const onChangePassword = e => {
  dispatch('SET_PASSWORD', e.target.value);
};

const onLogin = (e, callback) => {
  e.preventDefault();
  dispatch('LOGIN', callback);
};

const logout = callback => {
  dispatch('LOGOUT_START', callback);
};

const timedOut = () => {
  dispatch('TIMEOUT');
};

const getToken = () => store.getState().getIn(['session', 'token']);

export class AuthenticationComponent extends Component {
  componentDidMount() {
    dispatch('INITIALIZE', { socket: !this.props.noSocket });
  }

  render() {
    const {
      initialized,
      loggedIn,
      login,
      securityStrategies,
      spaceSlug,
      token,
    } = this.props;
    return this.props.children({
      initialized: initialized,
      timedOut: loggedIn && !token,
      loggedIn: loggedIn,
      loginProps: {
        onChangeUsername,
        onChangePassword,
        onLogin,
        onSso:
          securityStrategies.length > 0
            ? callback => dispatch('SINGLE_SIGN_ON', { callback, spaceSlug })
            : null,
        ...login,
      },
    });
  }
}

const mapStateToProps = state => ({
  initialized: state.getIn(['session', 'initialized'], false),
  loggedIn: state.getIn(['session', 'loggedIn'], false),
  token: state.getIn(['session', 'token'], null),
  login: state.get('login', defaultLoginProps),
  spaceSlug: state.getIn(['session', 'spaceSlug'], ''),
  securityStrategies: state.getIn(['session', 'securityStrategies'], []),
});

const AuthenticationContainer = connect(mapStateToProps)(
  AuthenticationComponent,
);

export { AuthenticationContainer, getToken, logout, timedOut };
