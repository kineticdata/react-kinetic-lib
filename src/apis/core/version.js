import axios from 'axios';
import { bundle } from '../../helpers/coreHelpers';
import { handleErrors } from '../http';

export const fetchVersion = () => {
  // Build URL and fetch the space.
  let promise = axios.get(`${bundle.apiLocation()}/version`);
  // Remove the response envelop and leave us with the space one.
  promise = promise.then(response => ({ version: response.data.version }));

  // Clean up any errors we receive. Make sure this the last thing so that it cleans up any errors.
  promise = promise.catch(handleErrors);

  return promise;
};
