import axios from 'axios';
import { bundle } from '../../helpers';
import { handleErrors, headerBuilder, paramBuilder } from '../http';

export const fetchFormTypes = (options = {}) => {
  const { kappSlug = bundle.kappSlug() } = options;

  // Build URL and fetch the form types.
  return axios
    .get(`${bundle.apiLocation()}/kapps/${kappSlug}/formTypes`, {
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .then(response => ({
      formTypes: response.data.formTypes,
    }))
    .catch(handleErrors);
};

export const fetchFormType = (options = {}) => {
  const { kappSlug = bundle.kappSlug(), name } = options;

  if (!name) {
    throw new Error('fetchFormType failed! The option "name" is required.');
  }

  // Build URL and fetch the form type.
  return axios
    .get(`${bundle.apiLocation()}/kapps/${kappSlug}/formTypes/${name}`, {
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .then(response => ({ formType: response.data.formType }))
    .catch(handleErrors);
};

export const createFormType = (options = {}) => {
  const { kappSlug = bundle.kappSlug(), formType } = options;

  if (!formType) {
    throw new Error(
      'createFormType failed! The option "formType" is required.',
    );
  }

  // Build URL and create the form type.
  return axios
    .post(`${bundle.apiLocation()}/kapps/${kappSlug}/formTypes`, formType, {
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .then(response => ({ formType: response.data.formType }))
    .catch(handleErrors);
};

export const updateFormType = (options = {}) => {
  const { kappSlug = bundle.kappSlug(), formType, name } = options;

  if (!formType) {
    throw new Error(
      'updateCategory failed! The option "category" is required.',
    );
  }

  if (!name) {
    throw new Error(
      'updateCategory failed! The option "categorySlug" is required.',
    );
  }

  // Build URL and update the form type.
  return axios
    .put(
      `${bundle.apiLocation()}/kapps/${kappSlug}/formTypes/${name}`,
      formType,
      {
        params: paramBuilder(options),
        headers: headerBuilder(options),
      },
    )
    .then(response => ({ formType: response.data.formType }))
    .catch(handleErrors);
};

export const deleteFormType = (options = {}) => {
  const { kappSlug = bundle.kappSlug(), name } = options;

  // Build URL and delete the form type.
  return axios
    .delete(`${bundle.apiLocation()}/kapps/${kappSlug}/formTypes/${name}`, {
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .then(response => ({ formType: response.data.formType }))
    .catch(handleErrors);
};
