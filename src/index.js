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

export {
  default as ContentEditable,
} from './components/common/ContentEditable';
export { default as Table } from './components/common/tables/Table';
export {
  FormForm,
  UserForm,
  UserTable,
  UserDetails,
  CoreForm,
  UserSelect,
  TeamSelect,
} from './components/core';
export {
  DateBanner,
  DiscussionForm,
  InvitationForm,
  Discussion,
  MessageHistory,
  UserMessageGroup,
} from './components/discussions';
export { default as partitionListBy } from './helpers/partitionListBy';
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
export {
  fetchDiscussions,
  createDiscussion,
  sendInvites,
  createRelatedItem,
  updateDiscussion,
  resendInvite,
  removeInvite,
  removeParticipant,
  updateParticipant,
  sendMessage,
  updateMessage,
  fetchMessage,
  fetchMessages,
  fetchMessageHistory,
  fetchDiscussion,
  fetchInvites,
  fetchParticipants,
  createInvite,
} from './apis/discussions';
export {
  // Attribute Definition exports
  fetchAttributeDefinitions,
  // Bridged Resource exports
  bridgedResourceUrl,
  convertMultipleBridgeRecords,
  fetchBridgedResource,
  countBridgedResource,
  // Bridge Model exports
  fetchBridgeModels,
  fetchBridgeModel,
  createBridgeModel,
  updateBridgeModel,
  // Category exports
  fetchCategories,
  fetchCategory,
  createCategory,
  updateCategory,
  // Form exports
  fetchForms,
  fetchForm,
  createForm,
  updateForm,
  // Kapp exports
  fetchKapps,
  fetchKapp,
  updateKapp,
  // Membership exports
  createMembership,
  deleteMembership,
  // Profile exports
  fetchProfile,
  updateProfile,
  // Security Policy Definition exports
  fetchSecurityPolicyDefinitions,
  fetchSecurityPolicyDefinition,
  createSecurityPolicyDefinition,
  updateSecurityPolicyDefinition,
  // Space exports
  fetchSpace,
  updateSpace,
  // Submission exports
  SubmissionSearch,
  searchSubmissions,
  fetchSubmission,
  createSubmission,
  updateSubmission,
  deleteSubmission,
  // Team exports
  fetchTeams,
  fetchTeam,
  updateTeam,
  createTeam,
  deleteTeam,
  // Translations exports
  fetchAvailableLocales,
  clearTranslationsCache,
  fetchStagedTranslations,
  fetchDefaultLocale,
  setDefaultLocale,
  fetchEnabledLocales,
  enableLocale,
  disableLocale,
  fetchContexts,
  createContext,
  updateContext,
  deleteContext,
  fetchContextKeys,
  updateContextKey,
  fetchTranslations,
  upsertTranslations,
  deleteTranslations,
  // User exports
  fetchUsers,
  fetchUser,
  updateUser,
  createUser,
  deleteUser,
  // Version exports
  fetchVersion,
  // Webhook exports
  fetchWebhooks,
  fetchWebhook,
  createWebhook,
  updateWebhook,
} from './apis/core';
export { socket, socketIdentify } from './apis/socket';
export { K, bundle } from './helpers/coreHelpers';
export { I18n } from './components/core/i18n/I18n';
export { Moment, importLocale } from './components/core/i18n/Moment';
export { mountForm, unmountForm } from './components/core/form/Form';

commitStore();

const KineticLib = props => (
  <Provider store={store} context={context}>
    <I18nProvider locale={props.locale}>
      <ComponentConfigContext.Provider
        value={DefaultFieldConfig.merge(DefaultTableConfig)
          .merge(remove(props.components || {}, 'fields'))
          .merge(props.components && props.components.fields)}
      >
        {props.children}
      </ComponentConfigContext.Provider>
    </I18nProvider>
  </Provider>
);

const history = createHashHistory();

export { configure, KineticLib, history };
