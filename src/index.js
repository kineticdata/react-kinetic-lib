import React from 'react';
import { Provider } from 'react-redux';
import { createHashHistory } from 'history';
import { remove } from 'immutable';

import { context, commitStore, configure, store } from './store';
import { I18nProvider } from './components';
import { DefaultFieldConfig } from './components/form/defaults';
import { DefaultTableConfig } from './components/table/defaults';
import { ComponentConfigContext } from './components/common/ComponentConfigContext';
import { AuthenticationContainer } from './components/common/authentication/AuthenticationContainer';

export * from './apis';
export * from './components';
export * from './helpers';
export * from './models';

commitStore();

const KineticLib = props => (
  <Provider store={store} context={context}>
    <I18nProvider locale={props.locale} disabled={props.disableTranslations}>
      <ComponentConfigContext.Provider
        value={DefaultFieldConfig.merge(DefaultTableConfig)
          .merge(remove(props.components || {}, 'fields'))
          .merge(props.components && props.components.fields)}
      >
        {typeof props.children === 'function' ? (
          <AuthenticationContainer clientId={props.clientId}>
            {props.children}
          </AuthenticationContainer>
        ) : (
          props.children
        )}
      </ComponentConfigContext.Provider>
    </I18nProvider>
  </Provider>
);

const history = typeof window !== 'undefined' ? createHashHistory() : null;

export { configure, KineticLib, history };
