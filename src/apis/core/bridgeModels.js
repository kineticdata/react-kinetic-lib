import axios from 'axios';
import { bundle } from '../../helpers';
import {
  handleErrors,
  headerBuilder,
  paramBuilder,
  validateOptions,
} from '../http';

export const fetchBridgeModels = (options = {}) => {
  return axios
    .get(`${bundle.apiLocation()}/models`, {
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .then(response => ({ bridgeModels: response.data.models }))
    .catch(handleErrors);
};

export const fetchBridgeModel = (options = {}) => {
  validateOptions('fetchBridgeModel', ['modelName'], options);
  return axios
    .get(`${bundle.apiLocation()}/models/${options.modelName}`, {
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .then(response => ({ bridgeModel: response.data.model }))
    .catch(handleErrors);
};

const TEST_METHODS = ['retrieve', 'search', 'count'];
export const testBridgeModel = (options = {}) => {
  validateOptions(
    'testBridgeModel',
    ['modelName', 'qualificationName', 'method'],
    options,
  );

  const { modelName, qualificationName, attributes = [] } = options;
  const method = TEST_METHODS.includes(options.method)
    ? options.method
    : 'retrieve';
  const parameters = options.parameters.reduce((params, parameter) => {
    params[`parameters[${parameter.name}]`] = parameter.value;
    return params;
  }, {});
  console.log(parameters);
  return axios
    .post(
      `${bundle.spaceLocation()}/app/models/${modelName}/qualifications/${qualificationName}/${method}`,
      null,
      {
        params: {
          ...paramBuilder(options),
          attributes: attributes.join(','),
          ...parameters,
        },
        headers: headerBuilder(options),
      },
    )
    .catch(handleErrors);
};

export const createBridgeModel = (options = {}) => {
  validateOptions('createBridgeModel', ['bridgeModel'], options);
  return axios
    .post(`${bundle.apiLocation()}/models`, options.bridgeModel, {
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .then(response => ({ bridgeModel: response.data.model }))
    .catch(handleErrors);
};

export const updateBridgeModel = (options = {}) => {
  validateOptions('updateBridgeModel', ['modelName', 'bridgeModel'], options);
  return axios
    .put(
      `${bundle.apiLocation()}/models/${options.modelName}`,
      options.bridgeModel,
      { params: paramBuilder(options), headers: headerBuilder(options) },
    )
    .then(response => ({ bridgeModel: response.data.model }))
    .catch(handleErrors);
};

export const deleteBridgeModel = (options = {}) => {
  validateOptions('deleteBridgeModel', ['modelName'], options);
  return axios
    .delete(`${bundle.apiLocation()}/models/${options.modelName}`, {
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .then(response => ({ bridgeModel: response.data.model }))
    .catch(handleErrors);
};
