import { apiFunction } from '../http';

const pluralApiConfig = {
  requiredOptions: ['modelName', 'mappingName'],
  url: ({ modelName, mappingName }) =>
    `/models/${modelName}/mappings/${mappingName}/attributes`,
  transform: response => ({
    bridgeModelAttributeMappings: response.data.attributes,
  }),
};

const singularApiConfig = {
  requiredOptions: ['modelName', 'mappingName', 'attributeName'],
  url: ({ modelName, mappingName, attributeName }) =>
    `/models/${modelName}/mappings/${mappingName}/attributes/${attributeName}`,
  transform: response => ({
    bridgeModelAttributeMapping: response.data.attribute,
  }),
};

const dataOption = 'bridgeModelAttributeMapping';

export const fetchBridgeModelAttributeMappings = apiFunction({
  name: 'fetchBridgeModelAttributeMappings',
  method: 'get',
  ...pluralApiConfig,
});

export const fetchBridgeModelAttributeMapping = apiFunction({
  name: 'fetchBridgeModelAttributeMapping',
  method: 'get',
  ...singularApiConfig,
});

export const createBridgeModelAttributeMapping = apiFunction({
  name: 'createBridgeModelAttributeMapping',
  method: 'post',
  dataOption,
  requiredOptions: pluralApiConfig.url,
  transform: singularApiConfig.transform,
  url: pluralApiConfig.url,
});

export const updateBridgeModelAttributeMapping = apiFunction({
  name: 'updateBridgeModelAttributeMapping',
  method: 'put',
  dataOption,
  ...singularApiConfig,
});

export const deleteBridgeModelAttributeMapping = apiFunction({
  name: 'deleteBridgeModelAttributeMapping',
  method: 'delete',
  ...singularApiConfig,
});
