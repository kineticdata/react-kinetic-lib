import React from 'react';
import { compose, lifecycle, withHandlers } from 'recompose';
import { coreOauthAuthorizeUrl } from '../../../apis/core';
import { dispatch } from '../../../store';

const setToken = token => dispatch('SET_TOKEN', token);

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
