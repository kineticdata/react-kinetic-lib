import axios from 'axios';
import { bundle } from '../../helpers/coreHelpers';
import {
  deserializeAttributes,
  serializeAttributes,
  handleErrors,
  paramBuilder,
  headerBuilder,
} from '../http';

const PROFILE_ENDPOINT = `${bundle.apiLocation()}/me`;

// Extract the profile from the data and return it.
// If there are any errors clean them up and return them instead.
export const fetchProfile = (options = {}) => {
  // Build URL and fetch the space.
  let promise = axios.get(PROFILE_ENDPOINT, {
    params: paramBuilder(options),
    headers: headerBuilder(options),
  });

  // Remove the response envelop and leave us with the space one.
  promise = promise.then(response => ({ profile: response.data }));
  promise = promise.then(deserializeAttributes('attributes', 'profile'));
  promise = promise.then(deserializeAttributes('profileAttributes', 'profile'));

  // Clean up any errors we receive. Make sure this the last thing so that it cleans up any errors.
  promise = promise.catch(handleErrors);

  return promise;
};

export const updateProfile = (options = {}) => {
  const { profile } = options;

  if (!profile) {
    throw new Error('updateProfile failed! The option "profile" is required.');
  }

  serializeAttributes(profile, 'attributes');
  serializeAttributes(profile, 'profileAttributes');

  // Build URL and fetch the space.
  let promise = axios.put(PROFILE_ENDPOINT, profile, {
    params: paramBuilder(options),
    headers: headerBuilder(options),
  });

  // Remove the response envelop and leave us with the space one.
  promise = promise.then(response => ({ profile: response.data.user }));
  promise = promise.then(deserializeAttributes('attributes', 'profile'));
  promise = promise.then(deserializeAttributes('profileAttributes', 'profile'));

  // Clean up any errors we receive. Make sure this the last thing so that it cleans up any errors.
  promise = promise.catch(handleErrors);

  return promise;
};
