import axios from 'axios';
import { bundle } from '../../helpers/coreHelpers';
import { handleErrors, paramBuilder, headerBuilder } from '../http';

export const fetchBackgroundJobs = (options = {}) =>
  axios
    .get(`${bundle.apiLocation()}/backgroundJobs`, {
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .then(response => ({
      backgroundJobs: response.data.backgroundJobs,
    }))
    .catch(handleErrors);

export const updateBackgroundJob = (options = {}) => {
  const { job, status } = options;

  const path =
    job.parentType === 'Datastore'
      ? `${bundle.apiLocation()}/datastore/forms/${
          job.parent.slug
        }/backgroundJobs/${job.id}`
      : null;

  if (path === null) {
    throw new Error(
      `updateBackgroundJob failed! Unsupported parentType: 'job.parentType'`,
    );
  }

  return axios
    .put(
      path,
      { status },
      {
        params: paramBuilder(options),
        headers: headerBuilder(options),
      },
    )
    .then(response => ({
      backgroundJob: response.data.backgroundJob,
    }))
    .catch(handleErrors);
};
