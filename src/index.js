import React from 'react';
import { Provider } from 'react-redux';
import { commitStore, configure, store } from './store';
import ContentEditable from './components/common/ContentEditable';
import { UserForm, UserList, UserDetails } from './components/core';
import {
  DateBanner,
  DiscussionForm,
  Discussion,
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
} from './apis/discussionApi';

commitStore();

const KineticLib = props => <Provider store={store}>{props.children}</Provider>;

export {
  // Library exports.
  KineticLib,
  // Common exports.
  ContentEditable,
  // Core exports
  UserForm,
  UserList,
  UserDetails,
  // Discussions exports.
  Discussion,
  DateBanner,
  DiscussionForm,
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
};
