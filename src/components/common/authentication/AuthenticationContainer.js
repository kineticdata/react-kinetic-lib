import React, { Component, Fragment } from 'react';
import qs from 'qs';
import { regHandlers, connect, dispatch, regSaga } from '../../../store';
import { login, logout, fetchProfile } from '../../../apis/core';
import { takeEvery, select, call, put } from 'redux-saga/effects';

import { RetrieveJwtIframe } from './RetrieveJwtIframe';

regHandlers({
  SET_INITIALIZED: (state, action) =>
    state
      .setIn(['session', 'initialized'], true)
      .setIn(['session', 'authenticated'], action.payload),
  SET_AUTHENTICATED: (state, action) =>
    state.updateIn(['session', 'authenticated'], false, () => action.payload),
  SET_TOKEN: (state, action) =>
    state.setIn(['session', 'token'], action.payload),
  SET_USERNAME: (state, action) =>
    state.setIn(['login', 'username'], action.payload),
  SET_PASSWORD: (state, action) =>
    state.setIn(['login', 'password'], action.payload),
  SET_ERROR: (state, action) => state.setIn(['login', 'error'], action.payload),

  ATTEMPT_LOGIN: state => state.setIn(['login', 'error'], null),
  LOGOUT: state =>
    state
      .setIn(['session', 'authenticated'], false)
      .setIn(['session', 'token'], null),
});

regSaga(
  takeEvery('ATTEMPT_LOGIN', function*() {
    const { username, password } = yield select(state => ({
      username: state.getIn(['login', 'username']),
      password: state.getIn(['login', 'password']),
    }));
    const { error } = yield call(login, { username, password });

    if (error) {
      yield put({ type: 'SET_ERROR', payload: error.message });
    } else {
      yield put({ type: 'SET_AUTHENTICATED', payload: true });
    }
  }),
);

regSaga(
  takeEvery('FETCH_META', function*() {
    const { profile } = yield call(fetchProfile);
    dispatch('SET_INITIALIZED', !!profile);
  }),
);

regSaga(
  takeEvery('LOGOUT', function*() {
    yield call(logout);
  }),
);

const mapStateToProps = state => ({
  initialized: state.getIn(['session', 'initialized'], false),
  authenticated: state.getIn(['session', 'authenticated'], false),
  token: state.getIn(['session', 'token'], null),
  error: state.getIn(['login', 'error'], null),
  username: state.getIn(['login', 'username'], ''),
  password: state.getIn(['login', 'password'], ''),
});

const onChangeUsername = e => {
  dispatch('SET_USERNAME', e.target.value);
};

const onChangePassword = e => {
  dispatch('SET_PASSWORD', e.target.value);
};

const onLogin = e => {
  e.preventDefault();
  dispatch('ATTEMPT_LOGIN');
};

const onLogout = () => {
  dispatch('LOGOUT');
};

const processOAuthToken = token => {
  if (window.opener && window.opener.__OAUTH_CALLBACK__) {
    // If it was opened in a popup, this is being executed in another window so we
    // needed to store the callback to the full React app on `window.opener`.
    window.opener.__OAUTH_CALLBACK__(token);
  } else if (window.parent && window.parent.__OAUTH_CALLBACK__) {
    // This was performed in an iframe. Similar to the popup - the React app being
    // executed right now is now the full React app. The full app set a callback on
    // itself and we'll inform it of our token.
    window.parent.__OAUTH_CALLBACK__(token);
  }
};

export class AuthenticationComponent extends Component {
  componentDidMount() {
    const params = qs.parse(window.location.hash);
    if (params['access_token']) {
      return;
    }
    dispatch('FETCH_META');
  }

  render() {
    const {
      initialized,
      authenticated,
      token,
      username,
      password,
    } = this.props;
    const loggedIn = authenticated && token ? true : false;
    const loggingIn = authenticated && !token ? true : false;

    // First we need to check to see if this is a redirect with an OAuth token.
    // If it is we need to process the token and save it in Redux. Since this
    // is actually rendered in a popup or iframe, we will block further rendering.
    const params = qs.parse(window.location.hash);
    if (params['access_token']) {
      processOAuthToken(params['access_token']);
      return null;
    }

    // If we're initializing it means we're trying to fetch our initial metadata still.
    if (!initialized) {
      return null;
    }

    return (
      <Fragment>
        {authenticated && !token && (
          <RetrieveJwtIframe clientId={this.props.clientId} />
        )}
        {this.props.children({
          loggedIn,
          loggingIn,
          token,
          loginProps: {
            onLogin,
            onChangeUsername,
            onChangePassword,
            username,
            password,
          },
        })}
      </Fragment>
    );
  }
}

const AuthenticationContainer = connect(mapStateToProps)(
  AuthenticationComponent,
);

AuthenticationContainer.propTypes = {};

export { AuthenticationContainer, onLogout };
export default AuthenticationContainer;
