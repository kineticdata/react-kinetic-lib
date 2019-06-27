import axios from 'axios';
import { bundle } from '../../helpers/coreHelpers';
import { handleErrors, paramBuilder, headerBuilder } from '../http';

export const fetchOAuthClients = (options = {}) =>
  axios
    .get(`${bundle.apiLocation()}/oauthClients`, {
      params: { ...paramBuilder(options) },
      headers: headerBuilder(options),
    })
    .then(response => ({
      oauthClients: response.data.oauthClients,
    }))
    .catch(handleErrors);

export const fetchOAuthClient = (options = {}) => {
  const { clientId } = options;
  if (!clientId) {
    throw new Error(
      'fetchOAuthClient failed! The option "clientId" is required.',
    );
  }

  return axios
    .get(`${bundle.apiLocation()}/oauthClients/${clientId}`, {
      params: { ...paramBuilder(options) },
      headers: headerBuilder(options),
    })
    .then(response => ({
      client: response.data.client,
    }))
    .catch(handleErrors);
};

export const updateOAuthClient = (options = {}) => {
  const { clientId, client } = options;

  if (!clientId) {
    throw new Error(
      'updateOAuthClient failed! The option "clientId" is required.',
    );
  }

  if (!client) {
    throw new Error(
      'updateOAuthClient failed! The option "client" is required.',
    );
  }

  // Build URL and fetch the space.
  return axios
    .put(`${bundle.apiLocation()}/oauthClients/${clientId}`, client, {
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .then(response => ({ client: response.data.client }))
    .catch(handleErrors);
};

export const createOAuthClient = (options = {}) => {
  const { client } = options;

  if (!client) {
    throw new Error(
      'updateOAuthClient failed! The option "client" is required.',
    );
  }

  // Build URL and fetch the space.
  return axios
    .post(`${bundle.apiLocation()}/oauthClients`, client, {
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .then(response => ({ client: response.data.client }))
    .catch(handleErrors);
};

export const deleteOAuthClient = (options = {}) => {
  const { clientId } = options;

  if (!clientId) {
    throw new Error(
      'updateOAuthClient failed! The option "clientId" is required.',
    );
  }

  // Build URL and fetch the space.
  return axios
    .delete(`${bundle.apiLocation()}/oauthClients/${clientId}`, {
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .then(response => ({ client: response.data.client }))
    .catch(handleErrors);
};
