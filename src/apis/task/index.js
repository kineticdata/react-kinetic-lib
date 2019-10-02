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

export const fetchTree = (options = {}) => {
  validateOptions('fetchTree', ['itemId'], options);
  return axios
    .get(`/kinetic-task/app/api/v2/trees/${options.itemId}`, {
      params: {
        include: options.include,
      },
      auth: {
        username: 'developer',
        password: 'developer',
      },
    })
    .then(response => ({
      tree: response.data,
    }));
};

export const updateTree = (options = {}) => {
  validateOptions('updateTree', ['itemId', 'tree'], options);
  return axios
    .put(`/kinetic-task/app/api/v2/trees/${options.itemId}`, options.tree, {
      params: {
        include: options.include,
      },
      auth: {
        username: 'developer',
        password: 'developer',
      },
    })
    .then(response => ({
      tree: response.data,
    }));
};

export const createTree = (options = {}) => {
  validateOptions('createTree', ['tree'], options);
  return axios
    .post(`/kinetic-task/app/api/v2/trees`, options.tree, {
      params: {
        include: options.include,
      },
      auth: {
        username: 'developer',
        password: 'developer',
      },
    })
    .then(response => ({
      tree: response.data,
    }));
};

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
