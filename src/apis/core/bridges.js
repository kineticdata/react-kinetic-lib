import axios from 'axios';
import { bundle } from '../../helpers';
import {
  handleErrors,
  headerBuilder,
  paramBuilder,
  validateOptions,
} from '../http';

export const fetchBridges = (options = {}) => {
  return axios
    .get(
      `${bundle.spaceLocation()}/app/components/agent/app/api/v1/bridges`,
      {
        params: paramBuilder(options),
        headers: headerBuilder(options),
      },
    )
    .then(response => ({ bridges: response.data.bridges }))
    .catch(handleErrors);
};

export const fetchBridgeAdapters = (options = {}) => {
  return axios
    .get(
      `${bundle.spaceLocation()}/app/components/agent/app/api/v1/adapters?type=bridge`,
      {
        params: paramBuilder(options),
        headers: headerBuilder(options),
      },
    )
    .then(response => ({ adapters: response.data.adapters }))
    .catch(handleErrors);
};

export const fetchBridge = (options = {}) => {
  validateOptions('fetchBridge', ['bridgeSlug'], options);
  return axios
    .get(
      `${bundle.spaceLocation()}/app/components/agent/app/api/v1/bridges/${
        options.bridgeSlug
      }`,
      {
        params: paramBuilder(options),
        headers: headerBuilder(options),
      },
    )
    .then(response => ({ bridge: response.data.bridge }))
    .catch(handleErrors);
};

export const createBridge = (options = {}) => {
  validateOptions('createBridge', ['bridge'], options);
  return axios
    .post(
      `${bundle.spaceLocation()}/app/components/agent/app/api/v1/bridges/`,
      options.bridge,
      {
        params: paramBuilder(options),
        headers: headerBuilder(options),
      },
    )
    .then(response => ({ bridge: response.data.bridge }))
    .catch(handleErrors);
};

export const updateBridge = (options = {}) => {
  validateOptions('updateBridge', ['bridgeSlug', 'bridge'], options);
  return axios
    .put(
      `${bundle.spaceLocation()}/app/components/agent/app/api/v1/bridges/${
        options.bridgeSlug
      }`,
      options.bridge,
      { params: paramBuilder(options), headers: headerBuilder(options) },
    )
    .then(response => ({ bridge: response.data.bridge }))
    .catch(handleErrors);
};

export const deleteBridge = (options = {}) => {
  validateOptions('deleteBridge', ['bridgeSlug'], options);
  return axios
    .delete(
      `${bundle.spaceLocation()}/app/components/agent/app/api/v1/bridges/${
        options.bridgeSlug
      }`,
      {
        params: paramBuilder(options),
        headers: headerBuilder(options),
      },
    )
    .then(response => ({ bridge: response.data.bridge }))
    .catch(handleErrors);
};
