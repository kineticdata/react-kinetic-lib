import axios from 'axios';
import { bundle } from '../../helpers/coreHelpers';
import { deserializeAttributes, handleErrors, paramBuilder } from '../http';

export const fetchCategories = (options = {}) => {
  const { kappSlug = bundle.kappSlug() } = options;

  // Build URL and fetch the categories.
  let promise = axios.get(
    `${bundle.apiLocation()}/kapps/${kappSlug}/categories`,
    {
      params: paramBuilder(options),
    },
  );
  // Remove the response envelop and leave us with the categories one.
  promise = promise.then(response => ({
    categories: response.data.categories,
  }));
  promise = promise.then(deserializeAttributes('attributes', 'categories'));

  // Clean up any errors we receive. Make sure this the last thing so that it cleans up any errors.
  promise = promise.catch(handleErrors);

  return promise;
};

export const fetchCategory = (options = {}) => {
  const { kappSlug = bundle.kappSlug(), categorySlug } = options;

  if (!categorySlug) {
    throw new Error(
      'fetchCategory failed! The option "categorySlug" is required.',
    );
  }

  // Build URL and fetch the category.
  let promise = axios.get(
    `${bundle.apiLocation()}/kapps/${kappSlug}/categories/${categorySlug}`,
    {
      params: paramBuilder(options),
    },
  );
  // Remove the response envelop and leave us with the category one.
  promise = promise.then(response => ({ category: response.data.category }));
  promise = promise.then(deserializeAttributes('attributes', 'category'));

  // Clean up any errors we receive. Make sure this the last thing so that it cleans up any errors.
  promise = promise.catch(handleErrors);

  return promise;
};
