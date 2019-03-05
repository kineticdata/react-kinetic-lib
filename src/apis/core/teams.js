import axios from 'axios';
import { bundle } from '../../helpers/coreHelpers';
import {
  deserializeAttributes,
  serializeAttributes,
  handleErrors,
  paramBuilder,
} from '../http';

export const fetchTeams = (options = {}) => {
  // Build URL and fetch the space.
  let promise = axios.get(`${bundle.apiLocation()}/teams`, {
    params: { ...paramBuilder(options), archived: options.archived },
  });
  // Remove the response envelop and leave us with the space one.
  promise = promise.then(response => ({ teams: response.data.teams }));
  promise = promise.then(deserializeAttributes('attributes', 'teams'));

  // Clean up any errors we receive. Make sure this the last thing so that it cleans up any errors.
  promise = promise.catch(handleErrors);

  return promise;
};

export const fetchTeam = (options = {}) => {
  const { teamSlug } = options;

  if (!teamSlug) {
    throw new Error('fetchTeam failed! The option "teamSlug" is required.');
  }

  // Build URL and fetch the space.
  let promise = axios.get(`${bundle.apiLocation()}/teams/${teamSlug}`, {
    params: paramBuilder(options),
  });
  // Remove the response envelop and leave us with the space one.
  promise = promise.then(response => ({ team: response.data.team }));
  promise = promise.then(deserializeAttributes('attributes', 'team'));

  // Clean up any errors we receive. Make sure this the last thing so that it cleans up any errors.
  promise = promise.catch(handleErrors);

  return promise;
};

export const updateTeam = (options = {}) => {
  const { teamSlug, team } = options;

  if (!teamSlug) {
    throw new Error('updateTeam failed! The option "teamSlug" is required.');
  }

  if (!team) {
    throw new Error('updateTeam failed! The option "team" is required.');
  }

  serializeAttributes(team, 'attributes');

  // Build URL and fetch the space.
  let promise = axios.put(`${bundle.apiLocation()}/teams/${teamSlug}`, team, {
    params: paramBuilder(options),
  });
  // Remove the response envelop and leave us with the space one.
  promise = promise.then(response => ({ team: response.data.team }));
  promise = promise.then(deserializeAttributes('attributes', 'team'));

  // Clean up any errors we receive. Make sure this the last thing so that it cleans up any errors.
  promise = promise.catch(handleErrors);

  return promise;
};

export const createTeam = (options = {}) => {
  const { team } = options;

  if (!team) {
    throw new Error('createTeam failed! The option "team" is required.');
  }

  serializeAttributes(team, 'attributes');

  // Build URL and fetch the space.
  let promise = axios.post(`${bundle.apiLocation()}/teams`, team, {
    params: paramBuilder(options),
  });
  // Remove the response envelop and leave us with the space one.
  promise = promise.then(response => ({ team: response.data.team }));
  promise = promise.then(deserializeAttributes('attributes', 'team'));

  // Clean up any errors we receive. Make sure this the last thing so that it cleans up any errors.
  promise = promise.catch(handleErrors);

  return promise;
};

export const deleteTeam = (options = {}) => {
  const { teamSlug } = options;

  if (!teamSlug) {
    throw new Error('deleteTeam failed! The option "teamSlug" is required.');
  }

  // Build URL and fetch the space.
  let promise = axios.delete(`${bundle.apiLocation()}/teams/${teamSlug}`, {
    params: paramBuilder(options),
  });
  // Remove the response envelop and leave us with the space one.
  // promise = promise.then(response => ({ team: response.data.team }));

  // Clean up any errors we receive. Make sure this the last thing so that it cleans up any errors.
  promise = promise.catch(handleErrors);

  return promise;
};
