import axios from 'axios';
import { validateOptions } from '../http';

const generateNextPageToken = data =>
  data.offset + data.limit > data.count ? null : data.limit + data.offset;

export const fetchTrees = (options = {}) =>
  axios
    .get(`/kinetic-task/app/api/v2/trees`, {
      params: {
        type: options.type,
        limit: options.limit,
        include: options.include,
        offset: options.offset,
        source: options.source || undefined,
        group: options.group || undefined,
        name: options.name || undefined,
        ownerEmail: options.ownerEmail || undefined,
        status: options.status || undefined,
      },
      auth: {
        username: 'developer',
        password: 'developer',
      },
    })
    .then(response => ({
      trees: response.data.trees,
      nextPageToken: generateNextPageToken(response.data),
    }));

export const fetchTree = () => ({
  tree: {
    name: 'Complete',
    notes: 'Notes about the tree',
    ownerEmail: 'email of the person that is in change of the process',
    sourceName: 'Request CE',
    sourceGroup: 'Kapp Name > My Process',
    status: 'Active',
    title: 'Request CE :: Kapp Name > My Process :: Complete',
    type: 'Tree',
  },
});

export const fetchSources = (options = {}) =>
  axios
    .get('/kinetic-task/app/api/v2/sources', {
      params: {
        include: options.include,
      },
      auth: {
        username: 'developer',
        password: 'developer',
      },
    })
    .then(response => ({
      sources: response.data.sourceRoots,
    }));

export const fetchTaskCategories = (options = {}) =>
  axios
    .get('/app/components/task/app/api/v2/categories', {
      params: {
        include: options.include,
      },
    })
    .then(response => ({
      categories: response.data.categories,
    }));

export const fetchHandlers = (options = {}) =>
  axios
    .get('/kinetic-task/app/api/v2/handlers', {
      params: {
        include: options.include,
      },
      auth: {
        username: 'developer',
        password: 'developer',
      },
    })
    .then(response => ({
      handlers: response.data.handlers,
    }));

export const fetchHandler = (options = {}) => {
  validateOptions('fetchHandler', ['definitionId'], options);
  return axios
    .get(`/app/components/task/app/api/v2/handlers/${options.definitionId}`, {
      params: {
        include: options.include,
      },
    })
    .then(response => ({
      handler: response.data,
    }));
};

export const fetchHandlerUsage = (options = {}) => {
  validateOptions('fetchHandlerUsage', ['definitionId'], options);
  return axios
    .get(
      `/app/components/task/app/api/v2/handlers/${options.definitionId}/usage`,
      {
        params: {
          include: options.include,
        },
      },
    )
    .then(response => ({
      handlerUsage: response.data.handlerUsage,
    }));
};
