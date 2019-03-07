import React from 'react';
import { Provider } from 'react-redux';
import { commitStore, configure, store } from './store';
import ContentEditable from './components/common/ContentEditable';
export { UserForm, UserList, UserDetails, CoreForm } from './components/core';
export {
  DateBanner,
  DiscussionForm,
  Discussion,
  MessageHistory,
} from './components/discussions';
import partitionListBy from './helpers/partitionListBy';
export {
  addRequestInterceptor,
  addResponseInterceptor,
  setDefaultAuthAssumed,
} from './apis/http';
export { createDiscussionList } from './models/discussions';
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
} from './apis/discussions';
export {
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
export {
  VALID_EVENTS,
  SOCKET_STAGE,
  SOCKET_STATUS,
  Socket,
  Timer,
  TOPIC_STATUS,
  Topic,
} from './apis/socket';
export { K, bundle } from './helpers/coreHelpers';

commitStore();

const KineticLib = props => <Provider store={store}>{props.children}</Provider>;

export { configure, ContentEditable, partitionListBy, KineticLib };
// export {
//   // Library exports.
//   KineticLib,
//   // Common exports.
//   ContentEditable,
//   // Core Helpers
//   K,
//   bundle,
//   addRequestInterceptor,
//   addResponseInterceptor,
//   setDefaultAuthAssumed,
//   // Core API exports
//   // Bridged Resource exports
//   bridgedResourceUrl,
//   convertMultipleBridgeRecords,
//   fetchBridgedResource,
//   countBridgedResource,
//   // Bridge Model exports
//   fetchBridgeModels,
//   fetchBridgeModel,
//   createBridgeModel,
//   updateBridgeModel,
//   // Category exports
//   fetchCategories,
//   fetchCategory,
//   createCategory,
//   updateCategory,
//   // Form exports
//   fetchForms,
//   fetchForm,
//   createForm,
//   updateForm,
//   // Kapp exports
//   fetchKapps,
//   fetchKapp,
//   updateKapp,
//   // Membership exports.
//   createMembership,
//   deleteMembership,
//   // Profile exports
//   fetchProfile,
//   updateProfile,
//   // Security Policy Definition exports
//   fetchSecurityPolicyDefinitions,
//   fetchSecurityPolicyDefinition,
//   createSecurityPolicyDefinition,
//   updateSecurityPolicyDefinition,
//   // Space exports
//   fetchSpace,
//   updateSpace,
//   // Submission exports
//   SubmissionSearch,
//   searchSubmissions,
//   fetchSubmission,
//   createSubmission,
//   updateSubmission,
//   deleteSubmission,
//   // Team exports
//   fetchTeams,
//   fetchTeam,
//   updateTeam,
//   createTeam,
//   deleteTeam,
//   // Translations exports
//   fetchAvailableLocales,
//   clearTranslationsCache,
//   fetchStagedTranslations,
//   fetchDefaultLocale,
//   setDefaultLocale,
//   fetchEnabledLocales,
//   enableLocale,
//   disableLocale,
//   fetchContexts,
//   createContext,
//   updateContext,
//   deleteContext,
//   fetchContextKeys,
//   updateContextKey,
//   fetchTranslations,
//   upsertTranslations,
//   deleteTranslations,
//   // User exports
//   fetchUsers,
//   fetchUser,
//   updateUser,
//   createUser,
//   deleteUser,
//   // Version exports
//   fetchVersion,
//   // Webhook exports
//   fetchWebhooks,
//   fetchWebhook,
//   createWebhook,
//   updateWebhook,
//   // Core exports
//   UserForm,
//   UserList,
//   UserDetails,
//   CoreForm,
//   // Discussions exports.
//   Discussion,
//   DateBanner,
//   DiscussionForm,
//   MessageHistory,
//   createDiscussionList,
//   fetchDiscussions,
//   createDiscussion,
//   sendInvites,
//   createRelatedItem,
//   updateDiscussion,
//   resendInvite,
//   removeInvite,
//   removeParticipant,
//   updateParticipant,
//   // Helper function exports.
//   partitionListBy,
//   // Redux exports
//   configure,
//   // Socket API exports
//   VALID_EVENTS,
//   SOCKET_STAGE,
//   SOCKET_STATUS,
//   Socket,
//   Timer,
//   TOPIC_STATUS,
//   Topic,
// };
