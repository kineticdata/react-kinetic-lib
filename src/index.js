import React from 'react';
import { Provider } from 'react-redux';
import { commitStore, configure, store } from './store';
import ContentEditable from './components/common/ContentEditable';
import { UserForm, UserList, UserDetails } from './components/core';
import {
  DateBanner,
  DiscussionForm,
  Discussion,
  MessageHistory,
} from './components/discussions';
import partitionListBy from './helpers/partitionListBy';
import { createDiscussionList } from './models/discussions';
import {
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
import {
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
  // Form exports
  fetchForms,
  fetchForm,
  createForm,
  updateForm,
  // Kapp exports
  fetchKapps,
  fetchKapp,
  updateKapp,
  // Profile exports
  fetchProfile,
  updateProfile,
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
  // User exports
  fetchUsers,
  fetchUser,
  updateUser,
  createUser,
  deleteUser,
  // Version exports
  fetchVersion as fetchCoreVersion,
} from './apis/core';
import {
  VALID_EVENTS,
  SOCKET_STAGE,
  SOCKET_STATUS,
  Socket,
  Timer,
  TOPIC_STATUS,
  Topic,
} from './apis/socket';
import { K, bundle } from './helpers/coreHelpers';
commitStore();

const KineticLib = props => <Provider store={store}>{props.children}</Provider>;

export {
  // Library exports.
  KineticLib,
  // Common exports.
  ContentEditable,
  // Core Helpers
  K,
  bundle,
  // Core API exports
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
  // Form exports
  fetchForms,
  fetchForm,
  createForm,
  updateForm,
  // Kapp exports
  fetchKapps,
  fetchKapp,
  updateKapp,
  // Profile exports
  fetchProfile,
  updateProfile,
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
  // User exports
  fetchUsers,
  fetchUser,
  updateUser,
  createUser,
  deleteUser,
  // Version exports
  fetchCoreVersion,
  // Core exports
  UserForm,
  UserList,
  UserDetails,
  // Discussions exports.
  Discussion,
  DateBanner,
  DiscussionForm,
  MessageHistory,
  createDiscussionList,
  fetchDiscussions,
  createDiscussion,
  sendInvites,
  createRelatedItem,
  updateDiscussion,
  resendInvite,
  removeInvite,
  removeParticipant,
  updateParticipant,
  // Helper function exports.
  partitionListBy,
  // Redux exports
  configure,
  // Socket API exports
  VALID_EVENTS,
  SOCKET_STAGE,
  SOCKET_STATUS,
  Socket,
  Timer,
  TOPIC_STATUS,
  Topic,
};
