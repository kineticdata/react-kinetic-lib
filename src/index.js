import React from 'react';
import { Provider } from 'react-redux';
import { commitStore, store } from './store';
import { UserDetails } from './components/user_details/UserDetails';
import { UserForm } from './components/user_form/UserForm';
import { UserList } from './components/user_list/UserList';

commitStore();

const KineticLib = props => (
  <Provider store={store}>{...props.children}</Provider>
);

export { KineticLib, UserDetails, UserForm, UserList };
