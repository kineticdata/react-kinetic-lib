import axios from 'axios';
import { Map } from 'immutable';
import { bundle } from '../helpers';

// The `X-Kinetic-AuthAssumed` header was added in version 2.2 of Kinetic Core.
// You can add this if you are expecting to be authenticated for a request to
// get a 401 instead of a partial list of the data if you are not authenticated.
// Since many bundles (like request-ce-bundle-kinetic) will want it to always
// behave this way we let you tell CoreAPI to always add this header to the api
// calls instead of manually adding it to all usages of CoreAPI functions.
export let defaultAuthAssumed = false;
export const setDefaultAuthAssumed = boolean => {
  defaultAuthAssumed = boolean;
};

export const addRequestInterceptor = (fulfilled, rejected) => {
  axios.interceptors.request.use(fulfilled, rejected);
};
export const addResponseInterceptor = (fulfilled, rejected) => {
  axios.interceptors.response.use(fulfilled, rejected);
};

const types = {
  400: 'badRequest',
  401: 'unauthorized',
  403: 'forbidden',
  404: 'notFound',
  405: 'methodNotAllowed',
};
export const handleErrors = error => {
  // handle a javascript runtime exception by re-throwing it, this is in case we
  // make a mistake in a `then` block in one of our api functions.
  if (error instanceof Error && !error.response) {
    throw error;
  }

  // Destructure out the information needed.
  const { data = {}, status: statusCode, statusText } = error.response;
  const { error: message, errorKey: key = null, ...rest } = data;
  const type = types[statusCode];
  const result = {
    ...rest,
    message: message || statusText,
    key,
    statusCode,
  };
  if (type) {
    result[type] = true;
  }
  return { error: result };
};

export const paramBuilder = options => {
  const params = {};

  if (options.include) params.include = options.include;
  if (options.limit) params.limit = options.limit;
  if (options.pageToken) params.pageToken = options.pageToken;
  if (options.q) params.q = options.q;
  if (options.direction) params.direction = options.direction;
  if (options.orderBy) params.orderBy = options.orderBy;
  if (options.manage) params.manage = options.manage;
  if (options.export) params.export = options.export;
  if (options.days) params.days = options.days;

  return params;
};

export const headerBuilder = options => {
  const headers = {};
  // CAREFUL to not override falsey values explicitly passed in options, hence
  // the nested if statement.
  if (options.hasOwnProperty('authAssumed')) {
    if (options.authAssumed) {
      headers['X-Kinetic-AuthAssumed'] = 'true';
    }
  } else {
    if (defaultAuthAssumed) {
      headers['X-Kinetic-AuthAssumed'] = 'true';
    }
  }
  return headers;
};

export const formPath = ({ form, kapp, datastore }) =>
  datastore
    ? form
      ? `${bundle.spaceLocation()}/app/datastore/forms/${form}`
      : `${bundle.spaceLocation()}/app/datastore/forms`
    : form
    ? `${bundle.spaceLocation()}/${kapp || bundle.kappSlug()}/${form}`
    : `${bundle.spaceLocation()}/${kapp || bundle.kappSlug()}`;

export const submissionPath = ({ submission, datastore }) =>
  datastore
    ? submission
      ? `${bundle.spaceLocation()}/app/datastore/submissions/${submission}`
      : `${bundle.spaceLocation()}/app/datastore/submissions`
    : submission
    ? `${bundle.spaceLocation()}/submissions/${submission}`
    : `${bundle.spaceLocation()}/submissions`;

export const corePath = ({ submission, kapp, form, datastore = false }) =>
  submission
    ? submissionPath({ submission, datastore })
    : formPath({ form, kapp, datastore });

export const operations = Map({
  startsWith: (field, value) => `${field} =* "${value}"`,
  equals: (field, value) => `${field} = "${value}"`,
  lt: (field, value) => `${field} < "${value}"`,
  lteq: (field, value) => `${field} <= "${value}"`,
  gt: (field, value) => `${field} > "${value}"`,
  gteq: (field, value) => `${field} >= "${value}"`,
  in: (field, value) => `${field} IN (${value.map(v => `"${v}"`).join(', ')})`,
  between: (field, value) =>
    `${field} BETWEEN ("${value.get(0)}", "${value.get(1)}")`,
});

const searchFilters = filters => {
  const q = Map(filters)
    .filter(filter => filter.getIn(['value'], '') !== '')
    .map((filter, key) => {
      const mode = filter.getIn(['column', 'filter']);
      const op = operations.get(mode, operations.get('equals'));

      return op(key, filter.get('value'));
    })
    .toIndexedSeq()
    .toList()
    .join(' AND ');

  return q.length > 0 ? { q } : {};
};

const generateSortParams = (sortColumn, sortDirection) =>
  sortColumn
    ? {
        orderBy: sortColumn,
        direction: sortDirection,
      }
    : {};

export const generateCESearchParams = ({
  pageSize,
  filters,
  sortColumn,
  sortDirection,
  nextPageToken,
}) => ({
  limit: pageSize,
  nextPageToken,
  ...searchFilters(filters),
  ...generateSortParams(sortColumn, sortDirection),
});
