import axios from 'axios';
import { bundle } from '../../helpers/coreHelpers';
import {
  deserializeAttributes,
  handleErrors,
  paramBuilder,
  headerBuilder,
  serializeAttributes,
} from '../http';

export const fetchSpace = (options = {}) => {
  // Build URL and fetch the space.
  let promise = axios.get(`${bundle.apiLocation()}/space`, {
    params: paramBuilder(options),
    headers: headerBuilder(options),
  });
  // Remove the response envelop and leave us with the space one.
  promise = promise.then(response => ({ space: response.data.space }));
  promise = promise.then(deserializeAttributes('attributes', 'space'));

  // Clean up any errors we receive. Make sure this the last thing so that it cleans up any errors.
  promise = promise.catch(handleErrors);

  return promise;
};

export const updateSpace = (options = {}) => {
  const { space } = options;
  if (!space) {
    throw new Error('updateSpace failed! The option "space" is required.');
  }

  return axios
    .put(
      `${bundle.apiLocation()}/space`,
      serializeAttributes(space, 'attributes'),
      {
        params: paramBuilder(options),
        headers: headerBuilder(options),
      },
    )
    .then(response => ({ space: response.data.space }))
    .then(deserializeAttributes('attributes', 'space'))
    .catch(handleErrors);
};
