import axios from 'axios';
import { bundle } from '../../helpers/coreHelpers';
import { handleErrors, paramBuilder, headerBuilder } from '../http';

export const fetchUsers = (options = {}) => {
  // Build URL and fetch the space.
  let promise = axios.get(`${bundle.apiLocation()}/users`, {
    params: paramBuilder(options),
    headers: headerBuilder(options),
  });
  // Remove the response envelop and leave us with the users one.
  return promise
    .then(response => ({
      users: response.data.users,
      nextPageToken: response.data.nextPageToken,
    }))
    .catch(handleErrors);
};

export const fetchUser = (options = {}) => {
  const { username } = options;

  if (!username) {
    throw new Error('fetchUser failed! The option "username" is required.');
  }

  // Build URL and fetch the space.
  return axios
    .get(`${bundle.apiLocation()}/users/${username}`, {
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .then(response => ({ user: response.data.user }))
    .catch(handleErrors);
};

export const updateUser = (options = {}) => {
  const { username, user } = options;

  if (!username) {
    throw new Error('fetchUser failed! The option "username" is required.');
  }

  if (!user) {
    throw new Error('fetchUser failed! The option "user" is required.');
  }

  // Build URL and fetch the space.
  return axios
    .put(`${bundle.apiLocation()}/users/${username}`, user, {
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .then(response => ({ user: response.data.user }))
    .catch(handleErrors);
};

export const createUser = (options = {}) => {
  const { user } = options;

  if (!user) {
    throw new Error('createUser failed! The option "user" is required.');
  }

  // Build URL and fetch the space.
  return axios
    .post(`${bundle.apiLocation()}/users`, user, {
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .then(response => ({ user: response.data.user }))
    .catch(handleErrors);
};

export const deleteUser = (options = {}) => {
  const { username } = options;

  if (!username) {
    throw new Error('deleteUser failed! The option "username" is required.');
  }

  // Build URL and fetch the space.
  return axios
    .delete(`${bundle.apiLocation()}/users/${username}`, {
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .catch(handleErrors);
};
