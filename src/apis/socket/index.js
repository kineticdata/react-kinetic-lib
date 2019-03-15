import { Socket, SOCKET_STATUS } from './socket';
import { dispatch, dispatcher, regHandlers } from '../../store';

regHandlers({
  SET_SOCKET_STATUS: (state, action) =>
    state.set('socketStatus', action.payload),
});

dispatch('SET_SOCKET_STATUS', SOCKET_STATUS.CLOSED);

const createWsUri = () => {
  const secure = window.location.protocol !== 'http:';
  const host = window.location.host;
  const path = `${bundle.spaceLocation()}/app/topics/socket`;

  return `${secure ? 'wss' : 'ws'}://${host}${path}`;
};

export const socket = new Socket().on(
  'status',
  dispatcher('SET_SOCKET_STATUS'),
);

export const socketIdentify = token => socket.connect(token, createWsUri());
