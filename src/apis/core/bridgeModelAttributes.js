import axios from 'axios';
import { bundle } from '../../helpers';
import {
  handleErrors,
  headerBuilder,
  paramBuilder,
  validateOptions,
} from '../http';

export const fetchBridgeModelAttributes = (options = {}) => {
  validateOptions('fetchBridgeModelAttributes', ['modelName'], options);
  return axios
    .get(`${bundle.apiLocation()}/models/${options.modelName}/attributes`, {
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .then(response => ({
      bridgeModelAttributes: response.data.attributes,
    }))
    .catch(handleErrors);
};

export const fetchBridgeModelAttribute = (options = {}) => {
  validateOptions(
    'fetchBridgeModelAttribute',
    ['modelName', 'attributeName'],
    options,
  );
  const { modelName, attributeName } = options;
  return axios
    .get(
      `${bundle.apiLocation()}/models/${modelName}/attributes/${attributeName}`,
      {
        params: paramBuilder(options),
        headers: headerBuilder(options),
      },
    )
    .then(response => ({
      bridgeModelAttribute: response.data.attribute,
    }))
    .catch(handleErrors);
};

export const createBridgeModelAttribute = (options = {}) => {
  validateOptions(
    'createBridgeModel',
    ['modelName', 'bridgeModelAttribute'],
    options,
  );
  return axios
    .post(
      `${bundle.apiLocation()}/models/${options.modelName}/attributes`,
      options.bridgeModelAttribute,
      {
        params: paramBuilder(options),
        headers: headerBuilder(options),
      },
    )
    .then(response => ({
      bridgeModelAttribute: response.data.attribute,
    }))
    .catch(handleErrors);
};

export const updateBridgeModelAttribute = (options = {}) => {
  validateOptions(
    'updateBridgeModel',
    ['modelName', 'attributeName', 'bridgeModelAttribute'],
    options,
  );

  const { modelName, attributeName, bridgeModelAttribute } = options;
  return axios
    .put(
      `${bundle.apiLocation()}/models/${modelName}/attributes/${attributeName}`,
      bridgeModelAttribute,
      { params: paramBuilder(options), headers: headerBuilder(options) },
    )
    .then(response => ({
      bridgeModelAttribute: response.data.attribute,
    }))
    .catch(handleErrors);
};

export const deleteBridgeModelAttribute = (options = {}) => {
  validateOptions('deleteBridgeModel', ['modelName', 'attributeName'], options);
  const { modelName, attributeName } = options;
  return axios
    .delete(
      `${bundle.apiLocation()}/models/${modelName}/attributes/${attributeName}`,
      {
        params: paramBuilder(options),
        headers: headerBuilder(options),
      },
    )
    .then(response => ({
      bridgeModelAttribute: response.data.attribute,
    }))
    .catch(handleErrors);
};
