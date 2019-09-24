import axios from 'axios';
import { bundle } from '../../helpers';
import {
  handleErrors,
  headerBuilder,
  paramBuilder,
  validateOptions,
} from '../http';

export const fetchBridges = (options = {}) => {
  return axios
    .get(
      `${bundle.spaceLocation()}/app/components/bridgehub/app/api/v1/bridges`,
      {
        params: paramBuilder(options),
        headers: headerBuilder(options),
      },
    )
    .then(response => ({ bridges: response.data.bridges }))
    .catch(handleErrors);
};
