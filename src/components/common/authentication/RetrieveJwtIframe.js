import React from 'react';
import { compose, lifecycle, withHandlers } from 'recompose';
import { coreOauthAuthorizeUrl } from '../../../apis';
import { dispatch } from '../../../store';

const setToken = token => dispatch('SET_TOKEN', token);
const jwtTokenListener = e => {
  const checkedOrigin = process.env.REACT_APP_API_HOST
    ? process.env.REACT_APP_API_HOST
    : window.location.origin;

  if (e.origin === checkedOrigin && e.data.token) {
    setToken(e.data.token);
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
      window.addEventListener('message', jwtTokenListener);
      this.props.getFrameRef().onload = this.props.handleFrameLoad;
    },
    componentWillUnmount() {
      window.removeEventListener('message', jwtTokenListener);
    },
  }),
)(RetrieveJwt);
