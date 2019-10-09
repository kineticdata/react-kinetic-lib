import axios from 'axios';
import { validateOptions } from '../http';

const generateNextPageToken = data =>
  data.offset + data.limit > data.count ? null : data.limit + data.offset;

export const fetchTrees = (options = {}) =>
  axios
    .get(`/app/components/task/app/api/v2/trees`, {
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
    })
    .then(response => ({
      trees: response.data.trees,
      nextPageToken: generateNextPageToken(response.data),
    }));

export const fetchTree = (options = {}) => {
  validateOptions('fetchTree', ['itemId'], options);
  return axios
    .get(`/app/components/task/app/api/v2/trees/${options.itemId}`, {
      params: {
        include: options.include,
      },
    })
    .then(response => ({
      tree: response.data,
    }));
};

export const updateTree = (options = {}) => {
  validateOptions('updateTree', ['itemId', 'tree'], options);
  return axios
    .put(
      `/app/components/task/app/api/v2/trees/${options.itemId}`,
      options.tree,
      {
        params: {
          include: options.include,
        },
      },
    )
    .then(response => ({
      tree: response.data,
    }));
};

export const createTree = (options = {}) => {
  validateOptions('createTree', ['tree'], options);
  return axios
    .post(`/app/components/task/app/api/v2/trees`, options.tree, {
      params: {
        include: options.include,
      },
    })
    .then(response => ({
      tree: response.data,
    }));
};

export const fetchSources = (options = {}) =>
  axios
    .get('/app/components/task/app/api/v2/sources', {
      params: {
        include: options.include,
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
    .get('/app/components/task/app/api/v2/handlers', {
      params: {
        include: options.include,
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
