import { bundle } from '../helpers/coreHelpers';

export const deserializeAttributes = (attributeKey, envelop) => result => {
  const xlatable = envelop ? result[envelop] : result;

  if (xlatable instanceof Array) {
    // If the item is an array of items then apply the translation to
    // each item in the array and return the mutated result.
    xlatable.forEach(xlat => deserializeAttributes(attributeKey)(xlat));
  } else {
    // Attempt to translate the item normally.
    const attributes = xlatable[attributeKey];

    if (!(xlatable[attributeKey] instanceof Array)) {
      return result;
    }

    xlatable[attributeKey] = attributes.reduce((attrs, attr) => {
      // eslint-disable-next-line
      attrs[attr.name] = attr.values;
      return attrs;
    }, {});
  }

  return result;
};

export const serializeAttributes = (xlatable, attributeKey) => {
  // If the attribute key is missing or is already in a list format then
  // skip serialization.
  // eslint-disable-next-line
  if (
    !xlatable.hasOwnProperty(attributeKey) ||
    xlatable[attributeKey] instanceof Array
  ) {
    return xlatable;
  }

  const attributes = xlatable[attributeKey];

  // Serialize the Object form into a List form.
  // eslint-disable-next-line no-param-reassign
  xlatable[attributeKey] = Object.keys(attributes).map(
    key => ({ name: key, values: attributes[key] }),
    [],
  );

  return xlatable;
};

export const handleErrors = error => {
  if (error instanceof Error && !error.response) {
    // When the error is an Error object an exception was thrown in the process.
    // so we'll just 'convert' it to a 400 error to be handled downstream.
    return { serverError: { status: 400, statusText: error.message } };
  }

  // Destructure out the information needed.
  const { data, status, statusText } = error.response;
  if (status === 400 && typeof data === 'object') {
    // If the errors returned are from server-side validations or constraints.
    return data.errors ? { errors: data.errors } : data;
  }

  // For all other server-side errors.
  return { serverError: { status, statusText, error: data && data.error } };
};

export const paramBuilder = options => {
  const params = {};

  if (options.include) {
    params.include = options.include;
  }

  if (options.limit) {
    params.limit = options.limit;
  }

  if (options.manage) {
    params.manage = options.manage;
  }

  return params;
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
