import React, { Fragment } from 'react';
import { compose, lifecycle, withHandlers } from 'recompose';
import t from 'prop-types';
import qs from 'qs';
import { regHandlers, connect, dispatch, regSaga } from '../../store';
import { login, coreOauthAuthorizeUrl } from '../../apis/core';
import { ComponentConfigContext } from './ComponentConfigContext';
import { takeEvery, select, call, put } from 'redux-saga/effects';

regHandlers({
  SET_AUTHENTICATED: (state, action) =>
    state.updateIn(['session', 'loggedIn'], false, () => action.payload),
  SET_TOKEN: (state, action) =>
    state.setIn(['session', 'token'], action.payload),
  SET_USERNAME: (state, action) =>
    state.setIn(['login', 'username'], action.payload),
  SET_PASSWORD: (state, action) =>
    state.setIn(['login', 'password'], action.payload),
  SET_ERROR: (state, action) => state.setIn(['login', 'error'], action.payload),

  ATTEMPT_LOGIN: state => state.setIn(['login', 'error'], null),
});

regSaga(
  takeEvery('ATTEMPT_LOGIN', function*() {
    const { username, password } = yield select(state => ({
      username: state.getIn(['login', 'username']),
      password: state.getIn(['login', 'password']),
    }));
    console.log('async login', username, password);
    const { error } = yield call(login, { username, password });

    if (error) {
      yield put({ type: 'SET_ERROR', payload: error.message });
    } else {
      yield put({ type: 'SET_AUTHENTICATED', payload: true });
    }
  }),
);

const mapStateToProps = state => ({
  loggedIn: state.getIn(['session', 'loggedIn'], true),
  token: state.getIn(['session', 'token'], null),
  error: state.getIn(['login', 'error'], null),
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
  console.log('attempting to login');
};

const setToken = token => {
  console.log('setTOken', token);
  dispatch('SET_TOKEN', token);
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

const RetrieveJwt = ({ frameRef, clientId }) => (
  <iframe
    title="oauth-jwt iframe"
    src={coreOauthAuthorizeUrl(clientId)}
    style={{ display: 'none' }}
    ref={frameRef}
  />
);

export const RetrieveJwtIframe = compose(
  withHandlers(() => {
    let frameRef;
    return {
      frameRef: () => ref => (frameRef = ref),
      getFrameRef: () => () => frameRef,
      handleFrameLoad: ({ handleJwt }) => () => {
        if (handleJwt) {
          handleJwt(frameRef);
        }
      },
    };
  }),
  lifecycle({
    componentWillMount() {
      window.__OAUTH_CALLBACK__ = token => {
        setToken(token);
      };
    },
    componentDidMount() {
      this.props.getFrameRef().onload = this.props.handleFrameLoad;
    },
  }),
)(RetrieveJwt);

export const AuthenticationComponent = props => {
  // First we need to check to see if this is a redirect with an OAuth token.
  // If it is we need to process the token and save it in Redux. Since this
  // is actually rendered in a popup or iframe, we will block further rendering.
  const params = qs.parse(window.location.hash);
  if (params['access_token']) {
    processOAuthToken(params['access_token']);
    return null;
  }

  // if authenticated && token && !isPublic
  // else if authenticated && !token && !isPublic
  // else

  return (
    <ComponentConfigContext.Consumer>
      {componentConfig => {
        const LoginScreen = componentConfig.get('LoginScreen');
        const LoginLoading = componentConfig.get('LoginLoading');

        return props.loggedIn && props.token ? (
          <Fragment>{props.children}</Fragment>
        ) : props.loggedIn && !props.token ? (
          <Fragment>
            <RetrieveJwtIframe clientId={props.clientId} />
            {LoginLoading && <LoginLoading />}
          </Fragment>
        ) : (
          <LoginScreen
            error={props.error}
            username={props.username}
            password={props.password}
            onChangeUsername={onChangeUsername}
            onChangePassword={onChangePassword}
            onLogin={onLogin}
          />
        );
      }}
    </ComponentConfigContext.Consumer>
  );
};

const AuthenticationContainer = connect(mapStateToProps)(
  AuthenticationComponent,
);

AuthenticationContainer.propTypes = {};

export default AuthenticationContainer;

// export const AuthenticationContainer = compose(connect(mapStateToProps))(
//   props => {
//     console.log('rendering authentication container');
//     return props.loggedIn ? (
//       <Fragment>{props.children}</Fragment>
//     ) : (
//       <LoginScreen />
//     );
//   },
// );
