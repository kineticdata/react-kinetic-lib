import axios from 'axios';
import { bundle } from '../../helpers';
import { handleErrors, headerBuilder } from '../http';

const parseNDLog = logLine => {
  try {
    return JSON.parse(logLine);
  } catch (e) {
    console.warn('Failed to parse ND log line: ', logLine);
  }
  return {};
};

export const fetchLogs = (options = {}) => {
  const format = options.format || 'ndjson';

  return axios
    .get(`${bundle.spaceLocation()}/app/loghub/api/v1/logs`, {
      params: {
        limit: options.limit || 500,
        format,
        q: options.q,
        pageToken: options.nextPageToken,
      },
      headers: headerBuilder(options),
    })
    .then(response => {
      if (typeof response.data === 'object') {
        return {
          logs: [],
          nextPageToken: response.data.metadata.nextPageToken,
        };
      }

      const logs = response.data
        .split('\n')
        .filter(ll => ll !== '')
        .map(parseNDLog);
      const metaEntry = logs[logs.length - 1];
      logs.pop();

      return {
        logs,
        nextPageToken: metaEntry.metadata.nextPageToken,
      };
    })
    .catch(handleErrors);
};
