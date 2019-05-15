import { List, Record, Map } from 'immutable';
import isarray from 'isarray';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import { dispatch, regHandlers, regSaga } from '../../../store';

export const isClientSide = data => isarray(data) || data instanceof List;

const clientSideNextPage = tableData =>
  tableData.update(
    'pageOffset',
    pageOffset => pageOffset + tableData.get('pageSize'),
  );

const clientSidePrevPage = tableData =>
  tableData.update('pageOffset', pageOffset =>
    Math.max(0, pageOffset - tableData.get('pageSize')),
  );

const serverSideNextPage = tableData =>
  tableData
    .set('nextPageToken', tableData.get('currentPageToken'))
    .update('pageTokens', pt => pt.push(tableData.get('currentPageToken')));

const serverSidePrevPage = tableData =>
  tableData
    .update('pageTokens', pt => pt.pop())
    .update(t => t.set('nextPageToken', t.get('pageTokens').last()));

regHandlers({
  MOUNT_TABLE: (state, { payload: { tableKey } }) => {
    return state.setIn(['tables', tableKey, 'mounted'], true);
  },
  UNMOUNT_TABLE: (state, { payload: { tableKey } }) => {
    return state.deleteIn(['tables', tableKey]);
  },
  CONFIGURE_TABLE: (
    state,
    { payload: { tableKey, data = List(), columns, pageSize = 25 } },
  ) =>
    !state.getIn(['tables', tableKey, 'mounted'])
      ? state
      : state.hasIn(['tables', tableKey, 'configured'])
      ? state.setIn(['tables', tableKey, 'initialize'], false)
      : state.mergeIn(
          ['tables', tableKey],
          Map({
            data,
            columns,
            rows: List(),
            MATTR: 'IS THE BERST',

            pageSize,
            sortColumn: null,
            sortDirection: 'desc',

            // Pagination
            currentPageToken: null,
            nextPageToken: null,
            pageTokens: List(),
            pageOffset: 0,

            configured: true,
            initialize: true,
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
      isClientSide(tableData.get('data'))
        ? clientSideNextPage(tableData)
        : serverSideNextPage(tableData),
    ),
  PREV_PAGE: (state, { payload: { tableKey } }) =>
    state.updateIn(['tables', tableKey], tableData =>
      isClientSide(tableData.get('data'))
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
}

regSaga(takeEvery('CONFIGURE_TABLE', calculateRowsTask));
regSaga(takeEvery('NEXT_PAGE', calculateRowsTask));
regSaga(takeEvery('PREV_PAGE', calculateRowsTask));
regSaga(takeEvery('SORT_COLUMN', calculateRowsTask));
regSaga(takeEvery('SORT_DIRECTION', calculateRowsTask));

const generateSortParams = tableData =>
  tableData.get('sortColumn')
    ? {
        orderBy: tableData.get('sortColumn').value,
        direction: tableData.get('sortDirection'),
      }
    : {};

const calculateRows = tableData => {
  const pageOffset = tableData.get('pageOffset');
  const pageSize = tableData.get('pageSize');
  const sortColumn = tableData.get('sortColumn');
  const sortDirection = tableData.get('sortDirection');

  const data = isClientSide(tableData.get('data'))
    ? List(tableData.get('data'))
    : tableData.get('data');

  if (isClientSide(tableData.get('data'))) {
    const startIndex = pageOffset;
    const endIndex = Math.min(pageOffset + pageSize, data.size);

    const rows = data
      .update(d => (sortColumn ? d.sortBy(r => r[sortColumn.value]) : d))
      .update(d => (sortDirection === 'asc' ? d.reverse() : d))
      .update(d => d.slice(startIndex, endIndex));

    return Promise.resolve({ rows });
  } else {
    const transform = data.transform || (result => result);
    const params = {
      ...data.params(tableData.toJS()),
      ...generateSortParams(tableData),
      pageToken: tableData.get('nextPageToken'),
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

export const mountTable = tableKey => dispatch('MOUNT_TABLE', { tableKey });
export const unmountTable = tableKey => dispatch('UNMOUNT_TABLE', { tableKey });
export const configureTable = payload => dispatch('CONFIGURE_TABLE', payload);
