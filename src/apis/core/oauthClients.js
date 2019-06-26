import axios from 'axios';
import { bundle } from '../../helpers/coreHelpers';
import { handleErrors, paramBuilder, headerBuilder } from '../http';

export const fetchOAuthClients = (options = {}) =>
  axios
    .get(`${bundle.apiLocation()}/oauthClients`, {
      params: { ...paramBuilder(options) },
      headers: headerBuilder(options),
    })
    .then(response => ({
      oauthClients: response.data.oauthClients,
    }))
    .catch(handleErrors);
