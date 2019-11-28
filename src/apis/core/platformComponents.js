import axios from 'axios';
import { List } from 'immutable';

import { bundle } from '../../helpers';
import {
  handleErrors,
  headerBuilder,
  //   paramBuilder,
  validateOptions,
} from '../http';

const pluckAgentBySlug = (agents, slug) =>
  agents.find(agent => agent.slug === slug);

export const fetchTaskComponent = (options = {}) => {
  validateOptions('fetchTask', [], options);
  return axios
    .get(`${bundle.apiLocation()}/space`, {
      params: { include: 'platformComponents' },
      headers: headerBuilder(options),
    })
    .then(response => ({
      task: response.data.space.platformComponents.task,
    }))
    .catch(handleErrors);
};

export const updateTaskComponent = async (options = {}) => {
  validateOptions('updateTaskComponent', ['task'], options);
  const payload = {
    platformComponents: {
      task: options.task,
    },
  };
  return axios
    .put(`${bundle.apiLocation()}/space`, payload, {
      params: { include: 'platformComponents' },
      headers: headerBuilder(options),
    })
    .then(response => ({
      task: response.data.space.platformComponents.task,
    }))
    .catch(handleErrors);
};

export const fetchAgentComponents = (options = {}) => {
  return axios
    .get(`${bundle.apiLocation()}/space`, {
      params: { include: 'platformComponents' },
      headers: headerBuilder(options),
    })
    .then(response => ({
      agents: response.data.space.platformComponents.agents,
    }))
    .catch(handleErrors);
};

export const fetchAgentComponent = (options = {}) => {
  validateOptions('fetchAgentComponent', ['slug'], options);
  return axios
    .get(`${bundle.apiLocation()}/space`, {
      params: { include: 'platformComponents' },
      headers: headerBuilder(options),
    })
    .then(response => ({
      agent: pluckAgentBySlug(
        response.data.space.platformComponents.agents,
        options.slug,
      ),
    }))
    .catch(handleErrors);
};

export const createAgentComponent = async (options = {}) => {
  validateOptions('createAgentComponent', ['agent'], options);
  const { agents, error } = await fetchAgentComponents();
  if (agents) {
    const payload = {
      platformComponents: {
        agents: [...agents, options.agent],
      },
    };
    return axios
      .put(`${bundle.apiLocation()}/space`, payload, {
        params: { include: 'platformComponents' },
        headers: headerBuilder(options),
      })
      .then(response => ({
        agent: pluckAgentBySlug(
          response.data.space.platformComponents.agents,
          options.agent.slug,
        ),
      }))
      .catch(handleErrors);
  } else {
    return error;
  }
};

export const updateAgentComponent = async (options = {}) => {
  validateOptions('updateAgentComponent', ['slug', 'agent'], options);
  const { agents, error } = await fetchAgentComponents();
  if (agents) {
    const agentIndex = agents.findIndex(agent => agent.slug === options.slug);
    const payload = {
      platformComponents: {
        agents: List(agents)
          .update(agentIndex, options.agent)
          .toJS(),
      },
    };

    return axios
      .put(`${bundle.apiLocation()}/space`, payload, {
        params: { include: 'platformComponents' },
        headers: headerBuilder(options),
      })
      .then(response => ({
        agent: pluckAgentBySlug(
          response.data.space.platformComponents.agents,
          options.agent.slug,
        ),
      }))
      .catch(handleErrors);
  } else {
    return error;
  }
};

export const deleteAgentComponent = async (options = {}) => {
  validateOptions('deleteAgentComponent', ['slug'], options);
  const { agents, error } = await fetchAgentComponents();
  if (agents) {
    const agentIndex = agents.findIndex(agent => agent.slug === options.slug);
    const payload = {
      platformComponents: {
        agents: List(agents)
          .delete(agentIndex)
          .toJS(),
      },
    };

    return axios
      .put(`${bundle.apiLocation()}/space`, payload, {
        params: { include: 'platformComponents' },
        headers: headerBuilder(options),
      })
      .then(response => ({
        agent: pluckAgentBySlug(
          response.data.space.platformComponents.agents,
          options.agent.slug,
        ),
      }))
      .catch(handleErrors);
  } else {
    return error;
  }
};
