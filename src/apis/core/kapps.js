import axios from 'axios';
import { bundle } from '../../helpers/coreHelpers';
import {
  deserializeAttributes,
  handleErrors,
  headerBuilder,
  paramBuilder,
  serializeAttributes,
} from '../http';

export const fetchKapps = (options = {}) => {
  // Build URL and fetch the space.
  let promise = axios.get(`${bundle.apiLocation()}/kapps`, {
    params: paramBuilder(options),
    headers: headerBuilder(options),
  });
  // Remove the response envelop and leave us with the space one.
  promise = promise.then(response => ({ kapps: response.data.kapps }));
  promise = promise.then(deserializeAttributes('attributes', 'kapps'));

  // Clean up any errors we receive. Make sure this the last thing so that it cleans up any errors.
  promise = promise.catch(handleErrors);

  return promise;
};

export const fetchKapp = (options = {}) => {
  const { kappSlug = bundle.kappSlug() } = options;

  // Build URL and fetch the space.
  let promise = axios.get(`${bundle.apiLocation()}/kapps/${kappSlug}`, {
    params: paramBuilder(options),
    headers: headerBuilder(options),
  });
  // Remove the response envelop and leave us with the space one.
  promise = promise.then(response => ({ kapp: response.data.kapp }));
  promise = promise.then(deserializeAttributes('attributes', 'kapp'));

  // Clean up any errors we receive. Make sure this the last thing so that it cleans up any errors.
  promise = promise.catch(handleErrors);

  return promise;
};

export const updateKapp = (options = {}) => {
  const { kappSlug = bundle.kappSlug(), kapp } = options;
  if (!kappSlug) {
    throw new Error('updateKapp failed! The option "kappSlug" is required.');
  }
  if (!kapp) {
    throw new Error('updateKapp failed! The option "kapp" is required.');
  }

  return axios
    .put(
      `${bundle.apiLocation()}/kapps/${kappSlug}`,
      serializeAttributes(kapp, 'attributes'),
      {
        params: paramBuilder(options),
        headers: headerBuilder(options),
      },
    )
    .then(response => ({ kapp: response.data.kapp }))
    .then(deserializeAttributes('attributes', 'kapp'))
    .catch(handleErrors);
};
