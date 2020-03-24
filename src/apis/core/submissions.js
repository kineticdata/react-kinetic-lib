import axios from 'axios';
import qs from 'qs';
import { bundle } from '../../helpers';
import { handleErrors, headerBuilder, paramBuilder } from '../http';

export const VALID_TIMELINES = [
  'closedAt',
  'createdAt',
  'submittedAt',
  'updatedAt',
];
export const VALID_KAPP_CORE_STATES = ['Draft', 'Submitted', 'Closed'];
export const VALID_DS_CORE_STATES = ['Draft', 'Submitted'];

const getValidCoreStates = (datastore = false) =>
  datastore ? VALID_DS_CORE_STATES : VALID_KAPP_CORE_STATES;

const nullFix = (val, nullable = true) =>
  nullable
    ? val === '' || val === null
      ? 'null'
      : `"${val}"`
    : val === null
    ? '""'
    : `"${val}"`;

export class SubmissionSearch {
  constructor(datastore = false) {
    this.searchMeta = {
      include: [],
    };

    this.query = [];
    this.queryContext = [];
    this.queryContext.push(this.query);

    this.isDatastore = datastore;
  }

  /*
   * Context Management
   */
  currentContext() {
    return this.queryContext[this.queryContext.length - 1];
  }

  addContext(context) {
    this.queryContext.push(context);
  }

  endContext() {
    return this.queryContext.pop();
  }

  /*
   * Execution Methods
   */

  build() {
    // Validate our attempt to search:
    this.validateOuter(
      'Attempted to execute query before ending all groupings.',
    );
    // * if core state it set to something other than draft we must have an
    //   beginning and ending date.
    // * ...?
    const query = this.compileQueryString();
    return {
      ...this.searchMeta,
      query,
    };
  }

  raw() {
    return this.query;
  }

  /*
   * Equality Methods
   */
  eq(lvalue, rvalue) {
    this.currentContext().push({ op: 'eq', lvalue, rvalue });
    return this;
  }

  sw(lvalue, rvalue) {
    this.validateDatastore(true);
    this.currentContext().push({ op: 'sw', lvalue, rvalue });
    return this;
  }

  gt(lvalue, rvalue) {
    this.validateDatastore();
    this.currentContext().push({ op: 'gt', lvalue, rvalue });
    return this;
  }

  lt(lvalue, rvalue) {
    this.validateDatastore();
    this.currentContext().push({ op: 'lt', lvalue, rvalue });
    return this;
  }

  gteq(lvalue, rvalue) {
    this.validateDatastore();
    this.currentContext().push({ op: 'gteq', lvalue, rvalue });
    return this;
  }

  lteq(lvalue, rvalue) {
    this.validateDatastore();
    this.currentContext().push({ op: 'lteq', lvalue, rvalue });
    return this;
  }

  between(lvalue, rvalue1, rvalue2) {
    this.validateDatastore();
    this.currentContext().push({ op: 'between', lvalue, rvalue1, rvalue2 });
    return this;
  }

  in(lvalue, rvalue) {
    this.currentContext().push({ op: 'in', lvalue, rvalue });
    return this;
  }

  /*
   * Grouping Methods
   */
  or() {
    this.validateDatastore(false);
    const op = { op: 'or', context: [] };
    this.currentContext().push(op);
    this.addContext(op.context);
    return this;
  }

  and() {
    const op = { op: 'and', context: [] };
    this.currentContext().push(op);
    this.addContext(op.context);
    return this;
  }

  end() {
    this.endContext();
    return this;
  }

  /*
   * Sorting Methods
   */

  sortBy(timeline) {
    this.validateDatastore(false);
    this.validateOuter('Sorting cannot be nested.');
    // Check to see that timeline is in valid timelines.
    if (VALID_TIMELINES.includes(timeline)) {
      this.searchMeta.timeline = timeline;
    }

    return this;
  }

  sortDirection(direction) {
    this.validateOuter('Sorting cannot be nested.');
    if (direction !== 'ASC' && direction !== 'DESC') {
      throw new Error(`Invalid sort direction: ${direction}`);
    }

    this.searchMeta.direction = direction;
    return this;
  }

  type(type) {
    this.validateDatastore(false);
    this.validateOuter('Type qualification cannot be nested');
    this.searchMeta.type = type;
    return this;
  }

  coreState(coreState) {
    this.validateOuter('Core State cannot be nested');
    const validCoreStates = getValidCoreStates(this.isDatastore);

    if (!validCoreStates.includes(coreState)) {
      throw new Error(
        `Invalid Core State "${coreState}". Expected: ${validCoreStates.join()}`,
      );
    }
    this.searchMeta.coreState = coreState;
    return this;
  }

  startDate(startDate) {
    this.validateDatastore(false);
    this.validateOuter('Start Date cannot be nested.');
    if (!(startDate instanceof Date)) {
      throw new Error('Start Date must be a Date object.');
    }
    this.searchMeta.start = startDate.toISOString();
    return this;
  }

  endDate(endDate) {
    this.validateDatastore(false);
    this.validateOuter('End Date cannot be nested.');
    if (!(endDate instanceof Date)) {
      throw new Error('End Date must be a Date object.');
    }
    this.searchMeta.end = endDate.toISOString();
    return this;
  }

  limit(limit) {
    this.validateOuter('Limit cannot be nested');
    this.searchMeta.limit = limit;
    return this;
  }

  pageToken(pageToken) {
    this.validateOuter('Page Token cannot be nested');
    this.searchMeta.pageToken = pageToken;
    return this;
  }

  include(include) {
    this.searchMeta.include.push(include);
    return this;
  }

  includes(includes) {
    const newIncludes = [...new Set([...this.searchMeta.include, ...includes])];
    this.searchMeta.include = newIncludes;
    // _.uniq(_.concat(this.searchMeta.include, includes));
    return this;
  }

  index(index) {
    this.validateDatastore();
    this.searchMeta.index = index ? index.replace(/:UNIQUE$/, '') : index;
    return this;
  }

  /*
   * Privately used utilities.
   */

  validateOuter(message) {
    if (this.queryContext.length > 1) {
      throw new Error(message);
    }
  }

  validateDatastore(datastore = true) {
    if (datastore === false && this.isDatastore) {
      throw new Error('This cannot be used with datastore searches.');
    } else if (datastore && !this.isDatastore) {
      throw new Error('This can only be used with datastore searches.');
    }
  }

  setDatastore(datastore) {
    this.isDatastore = datastore;
  }

  compileQueryString() {
    function doCompileQueryString(queryContext, queryString, and = true) {
      let query = `${queryString}`;

      queryContext.forEach((op, i) => {
        if (i > 0) {
          query += and ? ' AND ' : ' OR ';
        }
        switch (op.op) {
          case 'eq':
            query += `${op.lvalue} = ${nullFix(op.rvalue)}`;
            break;

          case 'sw':
            query += `${op.lvalue} =* ${nullFix(op.rvalue)}`;
            break;

          case 'gt':
            query += `${op.lvalue} > ${nullFix(op.rvalue, false)}`;
            break;

          case 'lt':
            query += `${op.lvalue} < ${nullFix(op.rvalue, false)}`;
            break;

          case 'gteq':
            query += `${op.lvalue} >= ${nullFix(op.rvalue, false)}`;
            break;
          case 'lteq':
            query += `${op.lvalue} <= ${nullFix(op.rvalue, false)}`;
            break;

          case 'between':
            query += `${op.lvalue} BETWEEN (${nullFix(
              op.rvalue1,
              false,
            )}, ${nullFix(op.rvalue2, false)})`;
            break;
          case 'in':
            query += `${op.lvalue} IN (`;
            op.rvalue.forEach((rval, rvi) => {
              if (rvi > 0) {
                query += ', ';
              }

              query += `${nullFix(op.rvalue[rvi])}`;
            });
            query += ')';
            break;

          case 'or':
          case 'and':
            query += '( ';
            query += doCompileQueryString(op.context, '', op.op === 'and');
            query += ')';
            break;
          default:
            throw new Error(
              `Unexpected operator type "${op.op}" encountered. Expected: eq, in, or, and.`,
            );
        }
      });

      return query;
    }

    return doCompileQueryString(this.query, '', true);
  }
}

export const searchSubmissions = options => {
  const { kapp, form, search, datastore = false } = options;
  const kappSlug = datastore ? null : kapp ? kapp : bundle.kappSlug();

  if (datastore && !form) {
    throw new Error('Datastore searches must be scoped to a form.');
  }

  const path = datastore
    ? `${bundle.apiLocation()}/datastore/forms/${form}/submissions`
    : form
    ? `${bundle.apiLocation()}/kapps/${kappSlug}/forms/${form}/submissions`
    : `${bundle.apiLocation()}/kapps/${kappSlug}/submissions`;

  const meta = { ...search };
  // Format includes.
  if (search.include.length > 0) {
    meta.include = search.include.join();
  }

  delete meta.query;
  if (typeof search.query === 'string' && search.query.length > 0) {
    meta.q = search.query;
  }

  // Fetch the submissions.
  let promise = axios.get(path, {
    paramsSerializer: params => qs.stringify(params),
    params: { ...meta, ...paramBuilder(options) },
    headers: headerBuilder(options),
  });

  // Remove the response envelop and leave us with the submissions.
  promise = promise.then(response => ({
    submissions: response.data.submissions,
    messages: response.data.messages,
    nextPageToken: response.data.nextPageToken,
  }));

  // Clean up any errors we receive. Make srue this is the last thing so that it
  // cleans up all errors.
  promise = promise.catch(handleErrors);

  return promise;
};

export const fetchSubmission = options => {
  const { id, datastore } = options;

  if (!id) {
    throw new Error('fetchSubmission failed! The option "id" is required.');
  }

  const path = datastore
    ? `${bundle.apiLocation()}/datastore/submissions/${id}`
    : `${bundle.apiLocation()}/submissions/${id}`;

  return (
    axios
      .get(path, {
        params: paramBuilder(options),
        headers: headerBuilder(options),
      })
      // Remove the response envelop and leave us with the submission one.
      .then(response => ({ submission: response.data.submission }))
      // Clean up any errors we receive. Make sure this the last thing so that it
      // cleans up any errors.
      .catch(handleErrors)
  );
};

export const createSubmission = options => {
  const {
    kappSlug = bundle.kappSlug(),
    formSlug,
    values,
    datastore = false,
    completed = true,
    currentPage,
  } = options;

  if (!formSlug) {
    throw new Error(
      'createSubmission failed! The option "formSlug" is required.',
    );
  } else if (!values) {
    throw new Error(
      'createSubmission failed! The option "values" is required.',
    );
  }

  const path = datastore
    ? `${bundle.apiLocation()}/datastore/forms/${formSlug}/submissions`
    : `${bundle.apiLocation()}/kapps/${kappSlug}/forms/${formSlug}/submissions`;

  const params = { ...paramBuilder(options), completed };

  return (
    axios
      .post(
        path,
        { values, currentPage },
        { params, headers: headerBuilder(options) },
      )
      // Remove the response envelop and leave us with the submission one.
      .then(response => ({ submission: response.data.submission }))
      // Clean up any errors we receive. Make sure this the last thing so that it
      // cleans up any errors.
      .catch(handleErrors)
  );
};

export const updateSubmission = options => {
  const { currentPage, id, values, datastore = false } = options;

  const path = datastore
    ? `${bundle.apiLocation()}/datastore/submissions/${id}`
    : `${bundle.apiLocation()}/submissions/${id}`;
  const params = { ...paramBuilder(options) };

  return (
    axios
      .put(
        path,
        { currentPage, values },
        { params, headers: headerBuilder(options) },
      )
      // Remove the response envelop and leave us with the submission one.
      .then(response => ({ submission: response.data.submission }))
      // Clean up any errors we receive. Make sure this the last thing so that it
      // cleans up any errors.
      .catch(handleErrors)
  );
};

export const deleteSubmission = options => {
  const { id, datastore = false } = options;

  if (!id) {
    throw new Error('deleteSubmission failed! The option "id" is required.');
  }

  const path = datastore
    ? `${bundle.apiLocation()}/datastore/submissions/${id}`
    : `${bundle.apiLocation()}/submissions/${id}`;

  return (
    axios
      .delete(path, {
        params: paramBuilder(options),
        headers: headerBuilder(options),
      })
      // Remove the response envelop and leave us with the submission one.
      .then(response => ({ submission: response.data.submission }))
      // Clean up any errors we receive. Make sure this the last thing so that it
      // cleans up any errors.
      .catch(handleErrors)
  );
};
