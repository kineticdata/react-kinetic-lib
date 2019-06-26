import React from 'react';
import { Provider } from 'react-redux';
import { context, commitStore, configure, store } from './store';
import { I18nProvider } from './components/core/i18n/I18nProvider';
import './redux/meta';
import { DefaultFieldConfig } from './components/core/form/DefaultFieldConfig';
import { ComponentConfigContext } from './components/common/ComponentConfigContext';
import { createHashHistory } from 'history';
import { DefaultTableConfig } from './components/common/tables/defaults';
import { remove } from 'immutable';
import AuthenticationContainer from './components/common/authentication/AuthenticationContainer';
export {
  onLogout,
} from './components/common/authentication/AuthenticationContainer';
export {
  default as ContentEditable,
} from './components/common/ContentEditable';
export { default as Table } from './components/common/tables/Table';
export {
  mountTable,
  unmountTable,
} from './components/common/tables/Table.redux';
export * from './components/core';
export {
  DateBanner,
  DiscussionForm,
  InvitationForm,
  Discussion,
  MessageHistory,
  UserMessageGroup,
} from './components/discussions';
export { partitionListBy } from './helpers';
export {
  addRequestInterceptor,
  addResponseInterceptor,
  setDefaultAuthAssumed,
} from './apis/http';
export {
  createDiscussionList,
  getGroupedDiscussions,
  sortByLastMessageAt,
} from './models/discussions';
export * from './apis/discussions';
export * from './apis/core';
export * from './apis/socket';
export { K, bundle } from './helpers/coreHelpers';
export { I18n } from './components/core/i18n/I18n';
export { Moment, importLocale } from './components/core/i18n/Moment';
export { mountForm, resetForm, unmountForm } from './components/core/form/Form';

commitStore();

const KineticLib = props => (
  <Provider store={store} context={context}>
    <I18nProvider locale={props.locale}>
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

const history = createHashHistory();

export { configure, KineticLib, history };
