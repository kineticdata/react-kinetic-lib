import axios from 'axios';
import { bundle } from '../../helpers/coreHelpers';
import { handleErrors, headerBuilder, paramBuilder } from '../http';

const buildEndpoint = (scope, kappSlug) =>
  scope === 'kapp'
    ? `${bundle.apiLocation()}/kapps/${kappSlug}/webhookJobs`
    : `${bundle.apiLocation()}/webhookJobs`;

export const fetchWebhookJobs = (options = {}) => {
  const { scope, kappSlug, status } = options;

  return axios
    .get(buildEndpoint(scope, kappSlug), {
      params: {
        ...paramBuilder(options),
        status,
      },
      headers: headerBuilder(options),
    })
    .then(response => ({
      webhookJobs: response.data.webhookJobs,
      nextPageToken: response.data.nextPageToken,
    }))
    .catch(handleErrors);
};
