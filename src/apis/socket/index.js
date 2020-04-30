import { call, takeEvery } from 'redux-saga/effects';
import { Socket, SOCKET_STATUS } from './socket';
import { dispatch, dispatcher, regHandlers } from '../../store';
import { bundle } from '../../helpers';
import { regSaga } from '../../saga';
import { authInterceptor } from '../../index';

regHandlers({
  SET_SOCKET_STATUS: (state, action) =>
    state.set('socketStatus', action.payload),
});

dispatch('SET_SOCKET_STATUS', SOCKET_STATUS.CLOSED);

const createWsUri = () => {
  if (process.env.REACT_APP_API_HOST) {
    // if there is an api host env variable (dev mode) then we can replace the
    // 'http' in that string with 'ws' to build the path
    return `${process.env.REACT_APP_API_HOST.replace(
      'http',
      'ws',
    )}/app/topics/socket`;
  } else {
    // otherwise (prod mode) we usually use paths that are root relative, but
    // the websocket path needs to include the protocol, so we determine whether
    // or not the current page is using https and get the host from the current
    // page to build the appropriate websocket uri
    const protocol = window.location.protocol !== 'http:' ? 'wss' : 'ws';
    const host = window.location.host;
    const path = `${bundle.spaceLocation()}/app/topics/socket`;
    return `${protocol}://${host}${path}`;
  }
};

// This handles situations where the socket goes to 'unidenfitied' which means
// the token we're using to reconnect is no longer valid.
regSaga(
  takeEvery('SET_SOCKET_STATUS', function*({ payload }) {
    if (payload === SOCKET_STATUS.UNIDENTIFIED) {
      try {
        yield call(authInterceptor.authenticate);
      } catch (e) {
        console.warn(
          'There was a problem attempting to authenticate and reconnect.',
          e,
        );
      }
    }
  }),
);

export const socket = new Socket().on(
  'status',
  dispatcher('SET_SOCKET_STATUS'),
);

export const socketIdentify = token =>
  new Promise(resolve => {
    socket.on('status', status => {
      if (status === SOCKET_STATUS.IDENTIFIED) {
        resolve();
      }
    });
    socket.connect(token, createWsUri());
  });
