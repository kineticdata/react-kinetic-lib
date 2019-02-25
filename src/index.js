import React from 'react';
import { Provider } from 'react-redux';
import { commitStore, store } from './store';
import { UserForm, UserList, UserDetails } from './components/core';
import { DateBanner } from './components/discussions';

commitStore();

const KineticLib = props => <Provider store={store}>{props.children}</Provider>;

export { KineticLib, UserForm, UserList, UserDetails, DateBanner };
