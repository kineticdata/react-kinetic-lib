import axios from 'axios';
import { bundle } from '../../helpers';
import { handleErrors, headerBuilder } from '../http';

/**
 * Determines the appropriate parameter separator (? | &) depending if the query separator (?)
 * has already been used or not.
 *
 * @param {string} url - the URL to test
 */
const paramSeparator = url => (url.indexOf('?') > -1 ? '&' : '?');

/**
 * Returns the URL to a bridged resource.
 *
 * Note: custom sorting is currently not available in this function because the BridgedResource
 * API doesn't support it.
 *
 * @param {*} options - properties to build the bridged resource url
 * @param {string} options.bridgedResourceName - name of the bridged resource
 * @param {string} options.formSlug - form slug where the bridged resource is defined
 * @param {string} options.kappSlug - kapp slug where the bridged resource is defined
 * @param {string[]=} options.attributes - array of attributes (fields) to return
 * @param {number=} options.limit - maximum number of records to retrieve
 * @param {number=} options.offset - offset to retrieve as first record
 * @param {object=} options.values - hash of value names to values
 * @param {object=} options.metadata - hash of metadata names to values
 * @returns {string}
 */
export const bridgedResourceUrl = (options, counting = false) => {
  if (!options.formSlug) {
    throw new Error('Property "formSlug" is required.');
  }
  if (!options.bridgedResourceName) {
    throw new Error('Property "bridgedResourceName" is required.');
  }
  const kappSlug = options.kappSlug || bundle.kappSlug();
  const bridgedResourceName = encodeURIComponent(options.bridgedResourceName);
  // build the url
  let url = `${bundle.spaceLocation()}/${kappSlug}/${
    options.formSlug
  }/bridgedResources/${bridgedResourceName}`;
  // append any attributes if they were specified
  if (counting) {
    url += '/count';
  }
  if (options.attributes) {
    if (!Array.isArray(options.attributes)) {
      throw new Error('Property "attributes" expected as array of strings.');
    }
    if (options.attributes.length > 0) {
      url += `${paramSeparator(url)}attributes=${options.attributes
        .map(encodeURIComponent)
        .join(',')}`;
    }
  }
  // append any parameter values if they were specified
  if (options.values && Object.keys(options.values).length > 0) {
    const parameters = Object.keys(options.values).map(
      key =>
        `${encodeURIComponent(`values[${key}]`)}=${encodeURIComponent(
          options.values[key],
        )}`,
    );
    // Add the appropriate parameter separator and value parameters
    url += `${paramSeparator(url)}${parameters.join('&')}`;
  }
  // append any metadata if it was specified
  if (options.metadata && Object.keys(options.metadata).length > 0) {
    const parameters = Object.keys(options.metadata).map(
      key =>
        `${encodeURIComponent(`metadata[${key}]`)}=${encodeURIComponent(
          options.metadata[key],
        )}`,
    );
    // Add the appropriate parameter separator and value parameters
    url += `${paramSeparator(url)}${parameters.join('&')}`;
  }
  // append the limit if it was specified
  if (options.limit) {
    let limit = options.limit;
    if (!Number.isInteger(limit)) {
      try {
        limit = parseInt(limit, 10);
      } catch (e) {
        throw new Error('Property "limit" expected as a number.');
      }
    }
    // Add the appropriate parameter separator and limit
    url += `${paramSeparator(url)}limit=${limit}`;
  }
  // append the offset if it was specified
  if (options.offset) {
    let offset = options.offset;
    if (!Number.isInteger(offset)) {
      try {
        offset = parseInt(offset, 10);
      } catch (e) {
        throw new Error('Property "offset" expected as a number.');
      }
    }
    // Add the appropriate parameter separator and offset
    url += `${paramSeparator(url)}offset=${offset}`;
  }
  return url;
};

/**
 * Combines the field names array with the records array to produce an array of objects
 * linking the field name to the field value for each record.
 *
 * @param {String[]} keys - Array of field names to use as object keys
 * @param {Array[]} values - Array of records, which are themselves an array of string values
 * @returns {Object[]} Array of objects linking the field name to the field value of each record.
 */
export const arraysToObject = (keys, values) =>
  values.map(value =>
    keys.reduce((object, key, keyIndex) => {
      const o = object;
      o[key] = value[keyIndex];
      return o;
    }, {}),
  );

/**
 * Converts the results from a Bridged Resource response that contains multiple records.
 *
 * A bridged resource that is configured to return multiple results separates the field names
 * from the record data.  This is done to reduce the amount of bandwidth the response uses, but
 * it is not the ideal format to work with.
 *
 * This function combines the field names array with the records array to produce an array of
 * objects linking the field name to the field value for each record.
 *
 * @param {Object} responseJsonRecords - Kinetic Core bridge response parsed from JSON
 * @returns {Object[]} Array of objects linking the field name to the field value of each record.
 */
export const convertMultipleBridgeRecords = responseJsonRecords =>
  arraysToObject(responseJsonRecords.fields, responseJsonRecords.records);

export const fetchBridgedResource = (options = {}) => {
  const { formSlug, bridgedResourceName } = options;

  if (!formSlug) {
    throw new Error('Property "formSlug" is required.');
  }
  if (!bridgedResourceName) {
    throw new Error('Property "bridgedResourceName" is required.');
  }

  return axios
    .get(bridgedResourceUrl(options), { headers: headerBuilder(options) })
    .then(({ data }) => {
      const { record, records } = data;

      if (record) {
        return { record: record.attributes };
      } else if (records) {
        return {
          records: convertMultipleBridgeRecords(records),
          metadata: {
            count: records.metadata.size,
            nextPageToken: records.metadata.nextPageToken,
          },
        };
      }

      return {
        serverError: { status: '500', statusText: 'Invalid server response.' },
      };
    })
    .catch(handleErrors);
};

export const countBridgedResource = (options = {}) => {
  const { formSlug, bridgedResourceName } = options;

  if (!formSlug) {
    throw new Error('Property "formSlug" is required.');
  }
  if (!bridgedResourceName) {
    throw new Error('Property "bridgedResourceName" is required.');
  }

  const counting = true;

  return axios
    .get(`${bridgedResourceUrl(options, counting)}`, {
      headers: headerBuilder(options),
    })
    .then(({ data }) => ({ count: data.count }))
    .catch(handleErrors);
};
