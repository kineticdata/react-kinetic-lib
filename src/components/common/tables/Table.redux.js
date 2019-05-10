import { List, Map, Record } from 'immutable';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import {
  action,
  connect,
  dispatch,
  regHandlers,
  regSaga,
} from '../../../store';

export const isClientSide = data => typeof data !== 'function';

const clientSideNextPage = tableData =>
  tableData.update('pageOffset', pageOffset => pageOffset + tableData.pageSize);

const clientSidePrevPage = tableData =>
  tableData.update('pageOffset', pageOffset =>
    Math.max(0, pageOffset - tableData.pageSize),
  );

const TableData = Record({
  data: null,
  columns: List(),
  rows: List(),

  // Sort
  sortColumn: null,
  sortDirection: 'desc',

  // Pagination
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
        data: isClientSide(data) ? List(data) : data,
        columns: List(columns),

        pageSize,
      }),
    ),
  SET_ROWS: (state, { payload: { tableKey, rows } }) =>
    state.setIn(['tables', tableKey, 'rows'], rows),
  NEXT_PAGE: (state, { payload: { tableKey } }) =>
    state.updateIn(['tables', tableKey], tableData =>
      isClientSide(tableData.data) ? clientSideNextPage(tableData) : tableData,
    ),
  PREV_PAGE: (state, { payload: { tableKey } }) =>
    state.updateIn(['tables', tableKey], tableData =>
      isClientSide(tableData.data) ? clientSidePrevPage(tableData) : tableData,
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

  const rows = yield call(calculateRows, tableData);
  yield put({ type: 'SET_ROWS', payload: { tableKey, rows } });
}

regSaga(takeEvery('SETUP_TABLE', calculateRowsTask));
regSaga(takeEvery('NEXT_PAGE', calculateRowsTask));
regSaga(takeEvery('PREV_PAGE', calculateRowsTask));
regSaga(takeEvery('SORT_COLUMN', calculateRowsTask));
regSaga(takeEvery('SORT_DIRECTION', calculateRowsTask));

const calculateRows = tableData => {
  if (typeof tableData.data === 'function') {
    console.log('re-fetching data source');
    const details = tableData.data(tableData);
    return details.ds(details.params);
  } else {
    const {
      pageOffset,
      pageSize,
      sortColumn,
      sortDirection,
      data,
      columns,
    } = tableData;
    const startIndex = pageOffset;
    const endIndex = Math.min(pageOffset + pageSize, data.size);
    console.log('SORT', sortColumn, columns);
    const rows = data
      .update(d => (sortColumn ? d.sortBy(r => r[sortColumn.value]) : d))
      .update(d => (sortDirection === 'asc' ? d.reverse() : d))
      .update(d => d.slice(startIndex, endIndex));
    return Promise.resolve(rows);
  }
};

export const setupTable = payload => {
  dispatch('SETUP_TABLE', payload);
};

export const teardownTable = ({ tableKey }) => {
  dispatch('TEARDOWN_TABLE', { tableKey });
};
