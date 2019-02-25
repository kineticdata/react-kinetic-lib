import React from 'react';
import { Provider } from 'react-redux';
import { commitStore, store } from './store';
import ContentEditable from './components/common/ContentEditable';
import { UserForm, UserList, UserDetails } from './components/core';
import { DateBanner, DiscussionForm } from './components/discussions';

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
  DateBanner,
  DiscussionForm,
};
