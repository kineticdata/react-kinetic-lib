import axios from 'axios';
import { bundle } from '../../helpers';
import {
  handleErrors,
  headerBuilder,
  paramBuilder,
  validateOptions,
} from '../http';

export const fetchAgentHandlers = (options = {}) => {
  return axios
    .get(`${bundle.spaceLocation()}/app/components/agent/app/api/v1/handlers`, {
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .then(response => ({ handlers: response.data.handlers }))
    .catch(handleErrors);
};

export const fetchAgentHandler = (options = {}) => {
  validateOptions('fetchAgentHandler', ['handlerSlug'], options);
  return axios
    .get(`/app/components/agent/app/api/v1/handlers/${options.handlerSlug}`, {
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .then(response => ({ handler: response.data.handler }))
    .catch(handleErrors);
};

export const createAgentHandler = (options = {}) => {
  validateOptions('createAgentHandler', ['handler'], options);
  return axios
    .post(
      `${bundle.spaceLocation()}/app/components/agent/app/api/v1/handlers/`,
      options.handler,
      {
        params: paramBuilder(options),
        headers: headerBuilder(options),
      },
    )
    .then(response => ({ handler: response.data.handler }))
    .catch(handleErrors);
};

export const updateAgentHandler = (options = {}) => {
  validateOptions('updateAgentHandler', ['handlerSlug', 'handler'], options);
  return axios
    .put(
      `${bundle.spaceLocation()}/app/components/agent/app/api/v1/handlers/${
        options.handlerSlug
      }`,
      options.handler,
      { params: paramBuilder(options), headers: headerBuilder(options) },
    )
    .then(response => ({ handler: response.data.handler }))
    .catch(handleErrors);
};

export const deleteAgentHandler = (options = {}) => {
  validateOptions('deleteAgentHandler', ['handlerSlug'], options);
  return axios
    .delete(
      `${bundle.spaceLocation()}/app/components/agent/app/api/v1/handlers/${
        options.handlerSlug
      }`,
      {
        params: paramBuilder(options),
        headers: headerBuilder(options),
      },
    )
    .then(response => ({ handler: response.data.handler }))
    .catch(handleErrors);
};
