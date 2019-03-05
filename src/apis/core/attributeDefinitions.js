import axios from 'axios';
import { bundle } from '../../helpers/coreHelpers';
import { handleErrors, headerBuilder, paramBuilder } from '../http';

const validateOptions = (functionName, requiredOptions, options) => {
  const validAttributes = [
    'spaceAttributeDefinitions',
    'teamAttributeDefinitions',
    'userAttributeDefinitions',
    'userProfileAttributeDefinitions',
    'categoryAttributeDefinitions',
    'kappAttributeDefinitions',
    'formAttributeDefinitions',
    'datastoreFormAttributeDefinitions',
  ];

  const attributesRequiringKappSlug = [
    'categoryAttributeDefinitions',
    'kappAttributeDefinitions',
    'formAttributeDefinitions',
  ];

  const kappSlugMissing =
    attributesRequiringKappSlug.includes(options.attributeType) &&
    !options.kappSlug;

  const invalidType = !validAttributes.includes(options.attributeType);

  const missing = requiredOptions.filter(
    requiredOption => !options[requiredOption],
  );

  if (missing.length > 0) {
    throw new Error(
      `${functionName} failed! The following required options are missing: ${missing}`,
    );
  }
  if (kappSlugMissing) {
    throw new Error(
      `${functionName} failed! A kappSlug is required when using ${
        options.attributeType
      }`,
    );
  }
  if (invalidType) {
    throw new Error(
      `${functionName} failed! The provided attributeType (${
        options.attributeType
      }) is not valid`,
    );
  }
};

const buildEndpoint = ({ attributeType, kappSlug, attributeName }) => {
  const basePath = kappSlug
    ? `${bundle.apiLocation()}/kapps/${kappSlug}/${attributeType}`
    : `${bundle.apiLocation()}/${attributeType}`;
  return attributeName ? `${basePath}/${attributeName}` : basePath;
};

export const fetchAttributeDefinitions = (options = {}) => {
  const { attributeType } = options;
  validateOptions('fetchAttributeDefinitions', ['attributeType'], options);
  return axios
    .get(buildEndpoint(options), {
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .then(response => ({ attributeDefinitions: response.data[attributeType] }))
    .catch(handleErrors);
};

export const fetchAttributeDefinition = (options = {}) => {
  const { attributeType } = options;
  validateOptions(
    'fetchAttributeDefinition',
    ['attributeType', 'attributeName'],
    options,
  );
  // The API returns the singular name of the attribute type, so we remove the "s"
  const responseEnvelope = attributeType.slice(0, -1);
  return axios
    .get(buildEndpoint(options), {
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .then(response => ({
      attributeDefinition: response.data[responseEnvelope],
    }))
    .catch(handleErrors);
};

export const createAttributeDefinition = (options = {}) => {
  const { kappSlug, attributeType, attributeDefinition } = options;
  validateOptions(
    'createAttributeDefinition',
    ['attributeType', 'attributeDefinition'],
    options,
  );
  // For Creates, we don't append the name to the basePath (it goes in the body)
  // so not using the buildEndpoint function
  const basePath = kappSlug
    ? `${bundle.apiLocation()}/kapps/${kappSlug}/${attributeType}`
    : `${bundle.apiLocation()}/${attributeType}`;
  // The API returns the singular name of the attribute type, so we remove the "s"
  const responseEnvelope = attributeType.slice(0, -1);
  return axios
    .post(basePath, attributeDefinition, {
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .then(response => ({
      attributeDefinition: response.data[responseEnvelope],
    }))
    .catch(handleErrors);
};

export const updateAttributeDefinition = (options = {}) => {
  const { attributeType, attributeDefinition } = options;
  validateOptions(
    'updateAttributeDefinition',
    ['attributeType', 'attributeName'],
    options,
  );
  // The API returns the singular name of the attribute type, so we remove the "s"
  const responseEnvelope = attributeType.slice(0, -1);
  return axios
    .put(buildEndpoint(options), attributeDefinition, {
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .then(response => ({
      attributeDefinition: response.data[responseEnvelope],
    }))
    .catch(handleErrors);
};
