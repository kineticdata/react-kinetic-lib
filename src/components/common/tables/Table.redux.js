import { List, Map, Record } from 'immutable';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import {
  action,
  connect,
  dispatch,
  regHandlers,
  regSaga,
} from '../../../store';

export const isClientSide = data =>
  data instanceof Array || data instanceof List;

const clientSideNextPage = tableData =>
  tableData.update('pageOffset', pageOffset => pageOffset + tableData.pageSize);

const clientSidePrevPage = tableData =>
  tableData.update('pageOffset', pageOffset =>
    Math.max(0, pageOffset - tableData.pageSize),
  );

const serverSideNextPage = tableData =>
  tableData
    .set('nextPageToken', tableData.currentPageToken)
    .update('pageTokens', pt => pt.push(tableData.currentPageToken));

const serverSidePrevPage = tableData => {
  console.log('doing prev page', tableData.pageTokens.last());
  return tableData
    .update('pageTokens', pt => pt.pop())
    .update(t => t.set('nextPageToken', t.pageTokens.last()));
};

const TableData = Record({
  data: null,
  columns: List(),
  rows: List(),

  // Sort
  sortColumn: null,
  sortDirection: 'desc',

  // Pagination
  currentPageToken: null,
  nextPageToken: null,
  pageTokens: List(),
  pageSize: 25,
  pageOffset: 0,
});

regHandlers({
  SETUP_TABLE: (state, { payload: { tableKey, data, columns, pageSize } }) =>
    state.setIn(
      ['tables', tableKey],
      TableData({
        data,
        columns: List(columns),

        pageSize,
      }),
    ),
  SET_ROWS: (state, { payload: { tableKey, rows, nextPageToken } }) =>
    state.updateIn(['tables', tableKey], table =>
      table
        .set('rows', rows)
        .set('currentPageToken', nextPageToken)
        .set('nextPageToken', null),
    ),
  NEXT_PAGE: (state, { payload: { tableKey } }) =>
    state.updateIn(['tables', tableKey], tableData =>
      isClientSide(tableData.data)
        ? clientSideNextPage(tableData)
        : serverSideNextPage(tableData),
    ),
  PREV_PAGE: (state, { payload: { tableKey } }) =>
    state.updateIn(['tables', tableKey], tableData =>
      isClientSide(tableData.data)
        ? clientSidePrevPage(tableData)
        : serverSidePrevPage(tableData),
    ),
  SORT_COLUMN: (state, { payload: { tableKey, column } }) =>
    state.updateIn(['tables', tableKey], t =>
      t
        // When sorting changes, reset pagination.
        .set('pageOffset', 0)
        // Update the sort column / direction.
        .set(
          'sortDirection',
          t.sortColumn === column
            ? t.sortDirection === 'desc'
              ? 'asc'
              : 'desc'
            : 'desc',
        )
        .set('sortColumn', column),
    ),
});

function* calculateRowsTask({ payload }) {
  const { tableKey } = payload;

  const tableData = yield select(state => state.getIn(['tables', tableKey]));

  const { rows, nextPageToken } = yield call(calculateRows, tableData);
  yield put({ type: 'SET_ROWS', payload: { tableKey, rows, nextPageToken } });
  // set nextPageToken
}

regSaga(takeEvery('SETUP_TABLE', calculateRowsTask));
regSaga(takeEvery('NEXT_PAGE', calculateRowsTask));
regSaga(takeEvery('PREV_PAGE', calculateRowsTask));
regSaga(takeEvery('SORT_COLUMN', calculateRowsTask));
regSaga(takeEvery('SORT_DIRECTION', calculateRowsTask));

const generateSortParams = tableData =>
  tableData.sortColumn
    ? {
        orderBy: tableData.sortColumn.value,
        direction: tableData.sortDirection,
      }
    : {};
const sortParams = {};

const calculateRows = tableData => {
  const {
    pageOffset,
    pageSize,
    sortColumn,
    sortDirection,
    columns,

    nextPageToken,
  } = tableData;
  const data = isClientSide(tableData.data)
    ? List(tableData.data)
    : tableData.data;

  if (isClientSide(tableData.data)) {
    const startIndex = pageOffset;
    const endIndex = Math.min(pageOffset + pageSize, data.size);

    const rows = data
      .update(d => (sortColumn ? d.sortBy(r => r[sortColumn.value]) : d))
      .update(d => (sortDirection === 'asc' ? d.reverse() : d))
      .update(d => d.slice(startIndex, endIndex));

    return Promise.resolve({ rows });
  } else {
    const transform = data.transform || (result => result);
    console.log('nextPageToken', tableData.nextPageToken);
    const params = {
      ...data.params(tableData),
      ...generateSortParams(tableData),
      pageToken: tableData.nextPageToken,
    };

    return data
      .dataSource(params)
      .then(transform)
      .then(result => ({
        nextPageToken: result.nextPageToken,
        rows: List(result.data),
      }));
  }
};

export const setupTable = payload => {
  dispatch('SETUP_TABLE', payload);
};

export const teardownTable = ({ tableKey }) => {
  dispatch('TEARDOWN_TABLE', { tableKey });
};
