import axios from 'axios';
import { bundle } from '../../helpers';
import {
  handleErrors,
  headerBuilder,
  paramBuilder,
  validateOptions,
} from '../http';

export const fetchBridgeModelAttributeMappings = (options = {}) => {
  validateOptions(
    'fetchBridgeModelAttributeMappings',
    ['modelName', 'mappingName'],
    options,
  );
  return axios
    .get(
      `${bundle.apiLocation()}/models/${options.modelName}/mappings/${
        options.mappingName
      }/attributes`,
      {
        params: paramBuilder(options),
        headers: headerBuilder(options),
      },
    )
    .then(response => ({
      bridgeModelAttributeMappings: response.data.attributes,
    }))
    .catch(handleErrors);
};

export const fetchBridgeModelAttributeMapping = (options = {}) => {
  validateOptions(
    'fetchBridgeModelAttributeMapping',
    ['modelName', 'mappingName', 'attributeName'],
    options,
  );
  const { modelName, mappingName, attributeName } = options;
  return axios
    .get(
      `${bundle.apiLocation()}/models/${modelName}/mappings/${mappingName}/attributes/${attributeName}`,
      {
        params: paramBuilder(options),
        headers: headerBuilder(options),
      },
    )
    .then(response => ({
      bridgeModelAttributeMapping: response.data.attribute,
    }))
    .catch(handleErrors);
};

export const createBridgeModelAttributeMapping = (options = {}) => {
  validateOptions(
    'createBridgeModelAttributeMapping',
    ['modelName', 'mappingName', 'bridgeModelAttributeMapping'],
    options,
  );
  return axios
    .post(
      `${bundle.apiLocation()}/models/${options.modelName}/mappings/${
        options.mappingName
      }/attributes`,
      options.bridgeModelAttributeMapping,
      {
        params: paramBuilder(options),
        headers: headerBuilder(options),
      },
    )
    .then(response => ({
      bridgeModelAttributeMapping: response.data.attribute,
    }))
    .catch(handleErrors);
};

export const updateBridgeModelAttributeMapping = (options = {}) => {
  validateOptions(
    'updateBridgeModelMapping',
    [
      'modelName',
      'mappingName',
      'attributeName',
      'bridgeModelAttributeMapping',
    ],
    options,
  );

  const {
    modelName,
    mappingName,
    attributeName,
    bridgeModelAttributeMapping,
  } = options;
  return axios
    .put(
      `${bundle.apiLocation()}/models/${modelName}/mappings/${mappingName}/attributes/${attributeName}`,
      bridgeModelAttributeMapping,
      { params: paramBuilder(options), headers: headerBuilder(options) },
    )
    .then(response => ({
      bridgeModelAttributeMapping: response.data.attribute,
    }))
    .catch(handleErrors);
};

export const deleteBridgeModelAttributeMapping = (options = {}) => {
  validateOptions(
    'deleteBridgeModelAttributeMapping',
    ['modelName', 'mappingName', 'attributeName'],
    options,
  );
  const { modelName, mappingName, attributeName } = options;
  return axios
    .delete(
      `${bundle.apiLocation()}/models/${modelName}/mappings/${mappingName}/attributes/${attributeName}`,
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
