import axios from 'axios';
import { bundle } from '../../helpers/coreHelpers';
import { handleErrors, paramBuilder, headerBuilder } from '../http';

const backgroundJobPath = job =>
  job
    ? job.parentType === 'Datastore'
      ? `${bundle.apiLocation()}/datastore/forms/${
          job.parent.slug
        }/backgroundJobs/${job.id}`
      : null
    : `${bundle.apiLocation()}/backgroundJobs`;

export const fetchBackgroundJobs = (options = {}) =>
  axios
    .get(backgroundJobPath(), {
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .then(response => ({
      backgroundJobs: response.data.backgroundJobs,
    }))
    .catch(handleErrors);

export const updateBackgroundJob = (options = {}) => {
  const { job, status } = options;

  const path = backgroundJobPath(job);

  if (job === null) {
    throw new Error(`updateBackgroundJob failed! Property "job" is required.`);
  }

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

export const deleteBackgroundJob = (options = {}) => {
  const { job } = options;

  const path = backgroundJobPath(job);

  if (job === null) {
    throw new Error(`deleteBackgroundJob failed! Property "job" is required.`);
  }

  if (path === null) {
    throw new Error(
      `deleteBackgroundJob failed! Unsupported parentType: 'job.parentType'`,
    );
  }

  return axios
    .delete(path, {
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .then(response => ({
      backgroundJob: response.data.backgroundJob,
    }))
    .catch(handleErrors);
};
