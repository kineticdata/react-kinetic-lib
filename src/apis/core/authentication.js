import axios from 'axios';
import { bundle } from '../../helpers/coreHelpers';
import { handleErrors } from '../http';

export const login = ({ username, password }) =>
  axios
    .post(
      `${bundle.spaceLocation()}/app/login.do`,
      {
        j_username: username,
        j_password: password,
      },
      {
        __bypassAuthInterceptor: true,
      },
    )
    .catch(handleErrors);

export const coreOauthAuthorizeUrl = clientId => {
  return `${bundle.spaceLocation()}/app/oauth/authorize?grant_type=implicit&client_id=${encodeURIComponent(
    clientId,
  )}&response_type=token`;
};