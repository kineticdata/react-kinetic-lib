import axios from 'axios';

import { bundle } from '../../helpers';
import {
  handleErrors,
  headerBuilder,
  paramBuilder,
  validateOptions,
} from '../http';

export const fetchTaskComponent = (options = {}) => {
  validateOptions('fetchTaskComponent', [], options);
  return axios
    .get(`${bundle.apiLocation()}/platformComponents/task`, {
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .then(response => ({
      task: response.data.task,
    }))
    .catch(handleErrors);
};

export const updateTaskComponent = async (options = {}) => {
  validateOptions('updateTaskComponent', ['task'], options);
  return axios
    .put(`${bundle.apiLocation()}/platformComponents/task`, options.task, {
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .then(response => ({
      task: response.data.task,
    }))
    .catch(handleErrors);
};

export const fetchAgentComponents = (options = {}) => {
  return axios
    .get(`${bundle.apiLocation()}/platformComponents/agents`, {
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .then(response => ({
      agents: response.data.agents,
    }))
    .catch(handleErrors);
};

export const fetchAgentComponent = (options = {}) => {
  validateOptions('fetchAgentComponent', ['slug'], options);
  return axios
    .get(`${bundle.apiLocation()}/platformComponents/agents/${options.slug}`, {
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .then(response => ({
      agent: response.data.agent,
    }))
    .catch(handleErrors);
};

export const createAgentComponent = async (options = {}) => {
  validateOptions('createAgentComponent', ['agent'], options);
  return axios
    .post(`${bundle.apiLocation()}/platformComponents/agents`, options.agent, {
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .then(response => ({
      agent: response.data.agent,
    }))
    .catch(handleErrors);
};

export const updateAgentComponent = async (options = {}) => {
  validateOptions('updateAgentComponent', ['slug', 'agent'], options);
  return axios
    .put(
      `${bundle.apiLocation()}/platformComponents/agents/${options.slug}`,
      options.agent,
      {
        params: paramBuilder(options),
        headers: headerBuilder(options),
      },
    )
    .then(response => ({
      agent: response.data.agent,
    }))
    .catch(handleErrors);
};

export const deleteAgentComponent = async (options = {}) => {
  validateOptions('deleteAgentComponent', ['slug'], options);
  return axios
    .delete(
      `${bundle.apiLocation()}/platformComponents/agents/${options.slug}`,
      {
        params: paramBuilder(options),
        headers: headerBuilder(options),
      },
    )
    .then(response => ({
      agent: response.data.agent,
    }))
    .catch(handleErrors);
};

export const validateAgent = async (options = {}) => {
  validateOptions('validateAgent', ['slug'], options);
  const endpoint = `app/components/agents/${options.slug}/app/api/v1/bridges`;
  return axios
    .post(endpoint, options.agent, {
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .then(response => ({
      successMessage: `${options.slug} has been successfully validated.`,
    }))
    .catch(handleErrors);
};
