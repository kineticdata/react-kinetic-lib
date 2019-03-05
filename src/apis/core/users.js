import axios from 'axios';
import { bundle } from '../../helpers/coreHelpers';
import {
  deserializeAttributes,
  serializeAttributes,
  handleErrors,
  paramBuilder,
} from '../http';

export const fetchUsers = (options = {}) => {
  // Build URL and fetch the space.
  let promise = axios.get(`${bundle.apiLocation()}/users`, {
    params: paramBuilder(options),
  });
  // Remove the response envelop and leave us with the users one.
  promise = promise.then(response => ({ users: response.data.users }));
  promise = promise.then(deserializeAttributes('attributes', 'users'));
  promise = promise.then(deserializeAttributes('profileAttributes', 'users'));

  // Clean up any errors we receive. Make sure this the last thing so that it cleans up any errors.
  promise = promise.catch(handleErrors);

  return promise;
};

export const fetchUser = (options = {}) => {
  const { username } = options;

  if (!username) {
    throw new Error('fetchUser failed! The option "username" is required.');
  }

  // Build URL and fetch the space.
  let promise = axios.get(`${bundle.apiLocation()}/users/${username}`, {
    params: paramBuilder(options),
  });
  // Remove the response envelop and leave us with the user one.
  promise = promise.then(response => ({ user: response.data.user }));
  promise = promise.then(deserializeAttributes('attributes', 'user'));
  promise = promise.then(deserializeAttributes('profileAttributes', 'user'));

  // Clean up any errors we receive. Make sure this the last thing so that it cleans up any errors.
  promise = promise.catch(handleErrors);

  return promise;
};

export const updateUser = (options = {}) => {
  const { username, user } = options;

  if (!username) {
    throw new Error('fetchUser failed! The option "username" is required.');
  }

  if (!user) {
    throw new Error('fetchUser failed! The option "user" is required.');
  }

  // Serialize user attributes.
  serializeAttributes(user, 'attributes');
  serializeAttributes(user, 'profileAttributes');

  // Build URL and fetch the space.
  let promise = axios.put(`${bundle.apiLocation()}/users/${username}`, user, {
    params: paramBuilder(options),
  });
  // Remove the response envelop and leave us with the user one.
  promise = promise.then(response => ({ user: response.data.user }));
  promise = promise.then(deserializeAttributes('attributes', 'user'));
  promise = promise.then(deserializeAttributes('profileAttributes', 'user'));

  // Clean up any errors we receive. Make sure this the last thing so that it cleans up any errors.
  promise = promise.catch(handleErrors);

  return promise;
};

export const createUser = (options = {}) => {
  const { user } = options;

  if (!user) {
    throw new Error('createUser failed! The option "user" is required.');
  }

  serializeAttributes(user, 'attributes');
  serializeAttributes(user, 'profileAttributes');

  // Build URL and fetch the space.
  let promise = axios.post(`${bundle.apiLocation()}/users`, user, {
    params: paramBuilder(options),
  });
  // Remove the response envelop and leave us with the space one.
  promise = promise.then(response => ({ user: response.data.user }));
  promise = promise.then(deserializeAttributes('attributes', 'user'));
  promise = promise.then(deserializeAttributes('profileAttributes', 'user'));

  // Clean up any errors we receive. Make sure this the last thing so that it cleans up any errors.
  promise = promise.catch(handleErrors);

  return promise;
};

export const deleteUser = (options = {}) => {
  const { username } = options;

  if (!username) {
    throw new Error('deleteUser failed! The option "username" is required.');
  }

  // Build URL and fetch the space.
  let promise = axios.delete(`${bundle.apiLocation()}/users/${username}`, {
    params: paramBuilder(options),
  });
  // Remove the response envelop and leave us with the space one.
  // promise = promise.then(response => ({ user: response.data.user }));

  // Clean up any errors we receive. Make sure this the last thing so that it cleans up any errors.
  promise = promise.catch(handleErrors);

  return promise;
};
