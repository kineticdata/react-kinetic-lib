import React from 'react';
import { Provider } from 'react-redux';
import { createHashHistory } from 'history';
import { remove } from 'immutable';
import axios from 'axios';
import { action, context, commitStore, store } from './store';
import { I18nProvider } from './components';
import { DefaultFieldConfig } from './components/form/defaults';
import { DefaultTableConfig } from './components/table/defaults';
import { ComponentConfigContext } from './components/common/ComponentConfigContext';
import { AuthenticationContainer } from './components/common/authentication/AuthenticationContainer';
import AuthInterceptor from './components/common/authentication/AuthInterceptor';
import RequestInterceptor from './components/common/authentication/RequestInterceptor';

export * from './apis';
export * from './components';
export * from './helpers';
export * from './models';

const requestInterceptor = new RequestInterceptor(store);
const authInterceptor = new AuthInterceptor(
  store,
  // callback to invoke when we get a 401 response
  () => action('TIMEOUT'),
  // how to detect if the user has re-authenticated
  state => !!state.getIn(['session', 'token']),
  // how to detect if the user has cancelled the re-authentication process
  state => !state.getIn(['session', 'loggedIn']),
);

// axios.defaults.withCredentials = true;
axios.interceptors.request.use(requestInterceptor.handleFulfilled);
axios.interceptors.response.use(null, authInterceptor.handleRejected);

commitStore();

export const KineticLib = props => (
  <Provider store={store} context={context}>
    <I18nProvider locale={props.locale}>
      <ComponentConfigContext.Provider
        value={DefaultFieldConfig.merge(DefaultTableConfig)
          .merge(remove(props.components || {}, 'fields'))
          .merge(props.components && props.components.fields)}
      >
        {typeof props.children === 'function' ? (
          <AuthenticationContainer noSocket={props.noSocket}>
            {props.children}
          </AuthenticationContainer>
        ) : (
          props.children
        )}
      </ComponentConfigContext.Provider>
    </I18nProvider>
  </Provider>
);

export const history =
  typeof window !== 'undefined' && window.bundle ? createHashHistory() : null;
