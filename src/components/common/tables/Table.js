import React from 'react';
import PropTypes from 'prop-types';
import {
  compose,
  lifecycle,
  withHandlers,
  withProps,
  withState,
} from 'recompose';
import { List, Map } from 'immutable';
import isarray from 'isarray';
import { I18n } from '../i18n/I18nProvider';
import {
  DefaultTableLayout,
  DefaultHeader,
  DefaultHeaderRow,
  DefaultHeaderCell,
  DefaultTableBody,
  DefaultTableBodyRow,
  DefaultEmptyBodyRow,
  DefaultTableBodyCell,
  DefaultTableFooter,
  DefaultTableFooterRow,
  DefaultTableFooterCell,
} from './TableDefaults';
import { connect, dispatch } from '../../../store';
import { setupTable, teardownTable, isClientSide } from './Table.redux';

const KeyWrapper = ({ children }) => children;

const validateTag = (content, tag, functionName) => {
  if (!content || content.type !== tag) {
    throw new Error(
      `Table failed, ${functionName} must return a ${tag} dom element.`,
    );
  }
  return content;
};

const TableComponent = props => {
  const {
    children,
    components,
    // buildPaginationControl,
    buildFilterControl,
    buildTable,
    buildTableHeader,
    buildTableBody,
    buildTableFooter,
    filterProps,
    sortProps,
    paginationProps,
  } = props;
  const table = buildTable();
  const filter = buildFilterControl();
  const pagination = buildPaginationControl(props);

  return children({
    table,
    filter,
    pagination,
    sortProps,
    paginationProps,
  });
};

const buildFilterControl = ({ components, filterProps }) => () => {
  const FilterControl = components.FilterControl;
  return FilterControl ? <FilterControl {...filterProps} /> : null;
};

const hasPrevPage = (data, pageTokens, pageSize, pageOffset, nextPageToken) =>
  isClientSide(data) ? pageOffset > 0 : true;

const hasNextPage = (data, pageTokens, pageSize, pageOffset, nextPageToken) =>
  isClientSide(data)
    ? data
      ? pageOffset + pageSize < data.size
      : false
    : true;

const buildPaginationControl = ({
  tableKey,
  data,
  pageTokens,
  pageSize,
  pageOffset,
  nextPageToken,
  components,
  paginationProps,
}) => {
  const PaginationControl = components.PaginationControl;
  const prevPage = hasPrevPage(
    data,
    pageTokens,
    pageSize,
    pageOffset,
    nextPageToken,
  )
    ? onPrevPage(tableKey)
    : null;

  const nextPage = hasNextPage(
    data,
    pageTokens,
    pageSize,
    pageOffset,
    nextPageToken,
  )
    ? onNextPage(tableKey)
    : null;

  return PaginationControl ? (
    <PaginationControl
      {...paginationProps}
      prevPage={prevPage}
      nextPage={nextPage}
    />
  ) : null;
};

const buildTable = ({
  components,
  buildTableHeader,
  buildTableBody,
  buildTableFooter,
}) => () => {
  const TableImpl = components.TableLayout
    ? components.TableLayout
    : DefaultTableLayout;
  const header = buildTableHeader();
  const body = buildTableBody();
  const footer = buildTableFooter();

  return <TableImpl header={header} body={body} footer={footer} />;
};

const buildTableHeader = ({
  components,
  renderHeader,
  rows,
  sorting,
  filterProps,
  sortProps,
  paginationProps,
  buildTableHeaderRow,
}) => () => {
  const HeaderImpl = components.Header || DefaultHeader;
  const headerRow = buildTableHeaderRow();
  return (
    <HeaderImpl
      sorting={sorting}
      headerRow={headerRow}
      rows={rows}
      filterProps={filterProps}
      sortProps={sortProps}
      paginationProps={paginationProps}
    />
  );
};

const buildTableHeaderRow = ({
  components,
  rows,
  columns,
  filterProps,
  sortProps,
  paginationProps,
  buildTableHeaderCell,
}) => () => {
  const HeaderRowImpl = components.HeaderRow || DefaultHeaderRow;
  const columnHeaders = columns.map(buildTableHeaderCell);

  return (
    <HeaderRowImpl
      columnHeaders={columnHeaders}
      rows={rows.toJS()}
      filterProps={filterProps}
      sortProps={sortProps}
      paginationProps={paginationProps}
    />
  );
};

const buildTableHeaderCell = props => (column, index) => {
  const {
    tableKey,
    components,
    sorting,
    sortColumn,
    sortDirection,
    rows,
    filterProps,
    sortProps,
    paginationProps,
  } = props;
  const { title, sortable = true } = column;

  // console.log('props', props.sort, props.sortProps);
  let sortClass = '',
    sortClick;
  // if (sorting) {
  //   if (sortable) {
  //     if (sort.column === index) {
  //       sortClass = sort.descending ? 'sort-desc' : 'sort-asc';
  //       sortClick = () => sortProps.reverse();
  //     } else {
  //       sortClick = () => sortProps.handleSort(index);
  //     }
  //   } else {
  //     sortClass = 'sort-disabled';
  //   }
  // }
  const HeaderCellImpl = components.HeaderCell || DefaultHeaderCell;
  return (
    <KeyWrapper key={`column-${index}`}>
      <HeaderCellImpl
        onSortColumn={onSortColumn(tableKey, column)}
        title={title}
        rows={rows.toJS}
        filterProps={filterProps}
        sortProps={sortProps}
        paginationProps={paginationProps}
      />
    </KeyWrapper>
  );
};

const buildTableBody = ({
  components,
  rows,
  filterProps,
  sortProps,
  paginationProps,
  buildTableBodyRows,
}) => () => {
  const BodyImpl = components.TableBody || DefaultTableBody;
  const tableRows = buildTableBodyRows(rows);

  return (
    <BodyImpl
      tableRows={tableRows}
      rows={rows.toJS()}
      filterProps={filterProps}
      sortProps={sortProps}
      paginationProps={paginationProps}
    />
  );
};

const buildTableBodyRows = ({
  components,
  rows,
  columns,
  emptyMessage,
  filterProps,
  sortProps,
  paginationProps,
  buildTableBodyCells,
}) => () => {
  const TableBodyRow = components.TableBodyRow || DefaultTableBodyRow;
  const EmptyBodyRow = components.EmptyBodyRow || DefaultEmptyBodyRow;
  const tableRows =
    rows.size > 0 ? (
      rows.map((row, index) => {
        const cells = buildTableBodyCells(row, index);
        return (
          <KeyWrapper key={`row-${index}`}>
            <TableBodyRow
              cells={cells}
              columns={columns}
              row={row}
              index={index}
              rows={rows.toJS()}
              filterProps={filterProps}
              sortProps={sortProps}
              paginationProps={paginationProps}
            />
          </KeyWrapper>
        );
      })
    ) : (
      <EmptyBodyRow
        columns={columns}
        rows={rows.toJS()}
        emptyMessage={emptyMessage}
      />
    );

  return tableRows;
};

const buildTableBodyCells = ({
  components,
  rows,
  columns,
  filterProps,
  sortProps,
  paginationProps,
}) => row => {
  return columns.map((column, index) => {
    const CustomBodyCell = column.components
      ? column.components.BodyCell
      : null;
    const BodyCell =
      CustomBodyCell || components.BodyCell || DefaultTableBodyCell;
    const value = row[column.value];

    return (
      <KeyWrapper key={`column-${index}`}>
        <BodyCell
          row={row}
          index={index}
          value={value}
          rows={rows.toJS()}
          filterProps={filterProps}
          sortProps={sortProps}
          paginationProps={paginationProps}
        />
      </KeyWrapper>
    );
  });
};

const buildTableFooter = ({
  components,
  rows,
  filterProps,
  sortProps,
  paginationProps,
  buildTableFooterRow,
  footer,
}) => () => {
  const footerRow = buildTableFooterRow();
  const TableFooter = components.TableFooter || DefaultTableFooter;

  return footer ? (
    <TableFooter
      rows={rows.toJS()}
      footerRow={footerRow}
      filterProps={filterProps}
      sortProps={sortProps}
      paginationProps={paginationProps}
    />
  ) : null;
};

const buildTableFooterRow = ({
  components,
  rows,
  columns,
  filterProps,
  sortProps,
  paginationProps,
  buildTableFooterCells,
}) => () => {
  const cells = buildTableFooterCells();
  const TableFooterRow = components.TableFooterRow || DefaultTableFooterRow;

  return (
    <TableFooterRow
      cells={cells}
      filterProps={filterProps}
      sortProps={sortProps}
      paginationProps={paginationProps}
    />
  );
};

const buildTableFooterCells = ({
  components,
  columns,
  rows,
  filterProps,
  sortProps,
  paginationProps,
}) => () => {
  return columns.map((column, index) => {
    const CustomBodyCell = column.components
      ? column.components.TableFooterCell
      : null;
    const TableFooterCell =
      CustomBodyCell || components.TableFooterCell || DefaultTableFooterCell;

    return (
      <KeyWrapper key={`column-${index}`}>
        <TableFooterCell
          column={column}
          rows={rows.toJS()}
          filterProps={filterProps}
          sortProps={sortProps}
          paginationProps={paginationProps}
        />
      </KeyWrapper>
    );
  });
};

const onNextPage = tableKey => () => dispatch('NEXT_PAGE', { tableKey });
const onPrevPage = tableKey => () => dispatch('PREV_PAGE', { tableKey });
const onSortColumn = (tableKey, column) => () =>
  dispatch('SORT_COLUMN', { tableKey, column });

const Table = compose(
  // withState('filter', 'setFilter', ''),
  // Wrap data in a `List`.
  // withProps(({ data, rows }) => {
  //   console.log('rows', rows, data);
  //   return {
  //     rows: rows ? rows : List(data),
  //   };
  // }),

  withHandlers({
    buildTableHeaderCell,
    buildTableBodyCells,
    buildTableFooterCells,
  }),
  withHandlers({
    buildTableHeaderRow,
    buildTableBodyRows,
    buildTableFooterRow,
  }),
  withHandlers({
    buildTableHeader,
    buildTableBody,
    buildTableFooter,
  }),
  withHandlers({
    buildFilterControl,
    // buildPaginationControl,
    buildTable,
  }),

  // lifecycle({
  //   componentDidUpdate(prevProps) {
  //     if (this.props.identifier !== prevProps.identifier) {
  //       this.props.setPageNumber(1);
  //       this.props.setFilter('');
  //       this.props.setSort(buildSortFromProps(this.props));
  //     }
  //   },
  // }),
)(TableComponent);

Table.propTypes = {
  identifier: PropTypes.string,
  data: PropTypes.array.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      className: PropTypes.string,
      title: PropTypes.string,
      value: PropTypes.string,
      filterable: PropTypes.bool,
      sortable: PropTypes.bool,
    }),
  ).isRequired,
  emptyMessage: PropTypes.string,
  pagination: PropTypes.bool,
  pageSize: PropTypes.number,
  filtering: PropTypes.bool,
  sorting: PropTypes.bool,
  sortOrder: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.number,
      PropTypes.PropTypes.oneOf(['ASC', 'DESC']),
    ),
    PropTypes.number,
  ]),
  children: PropTypes.func.isRequired,
};

Table.defaultProps = {
  components: {},
  data: [],
  rows: List([]),
  columns: [],

  filtering: true,
  sorting: true,
  pagination: true,
  pageSize: 10,
};

const mapStateToProps = state => (state, props) =>
  state.getIn(['tables', props.tableKey], Map()).toObject();

Table.setup = setupTable;
Table.teardown = teardownTable;
export default connect(mapStateToProps)(Table);
