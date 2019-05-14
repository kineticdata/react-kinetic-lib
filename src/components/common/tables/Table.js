import React, { Component } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid/v1';
import {
  compose,
  lifecycle,
  withHandlers,
  withProps,
  withState,
} from 'recompose';
import { List, Map } from 'immutable';
import isarray from 'isarray';
import { I18n } from '../../core/i18n/I18n';
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
    buildFilterControl,
    buildTable,
    buildTableHeader,
    buildTableBody,
    buildTableFooter,
    filterProps,
    sortProps,
  } = props;
  const table = buildTable();
  const filter = buildFilterControl();
  const pagination = buildPaginationControl(props);

  return children({
    table,
    filter,
    pagination,
    sortProps,
  });
};

const buildFilterControl = ({ components, filterProps }) => () => {
  const FilterControl = components.FilterControl;
  return FilterControl ? <FilterControl {...filterProps} /> : null;
};

const hasPrevPage = (data, pageTokens, pageOffset) =>
  isClientSide(data) ? pageOffset > 0 : pageTokens.size !== 0;

const hasNextPage = (data, pageOffset, pageSize, currentPageToken) =>
  isClientSide(data)
    ? data
      ? pageOffset + pageSize < data.length
      : false
    : !!currentPageToken;

const buildPaginationControl = ({
  tableKey,
  data,
  pageTokens,
  pageSize,
  pageOffset,
  nextPageToken,
  currentPageToken,
  components,
  paginationProps,
}) => {
  const PaginationControl = components.PaginationControl;
  const prevPage = hasPrevPage(data, pageTokens, pageOffset)
    ? onPrevPage(tableKey)
    : null;

  const nextPage = hasNextPage(data, pageOffset, pageSize, currentPageToken)
    ? onNextPage(tableKey)
    : null;

  return PaginationControl ? (
    <PaginationControl prevPage={prevPage} nextPage={nextPage} />
  ) : null;
};

const buildTable = ({
  components,
  buildTableHeader,
  buildTableBody,
  buildTableFooter,
}) => () => {
  const TableLayout = components.TableLayout
    ? components.TableLayout
    : DefaultTableLayout;
  const header = buildTableHeader();
  const body = buildTableBody();
  const footer = buildTableFooter();

  return <TableLayout header={header} body={body} footer={footer} />;
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
  const Header = components.Header || DefaultHeader;
  const headerRow = buildTableHeaderRow();
  return (
    <Header
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
  const HeaderRow = components.HeaderRow || DefaultHeaderRow;
  const columnHeaders = columns.map(buildTableHeaderCell);

  return (
    <HeaderRow
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
  const HeaderCell = components.HeaderCell || DefaultHeaderCell;

  return (
    <KeyWrapper key={`column-${index}`}>
      <HeaderCell
        onSortColumn={onSortColumn(tableKey, column)}
        title={title}
        column={column}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
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
  const Body = components.Body || DefaultTableBody;
  const tableRows = buildTableBodyRows(rows);

  return (
    <Body
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
  const BodyRow = components.BodyRow || DefaultTableBodyRow;
  const EmptyBodyRow = components.EmptyBodyRow || DefaultEmptyBodyRow;
  const tableRows =
    rows.size > 0 ? (
      rows.map((row, index) => {
        const cells = buildTableBodyCells(row, index);
        return (
          <KeyWrapper key={`row-${index}`}>
            <BodyRow
              cells={cells}
              columns={columns}
              row={row}
              index={index}
              rows={rows.toJS()}
            />
            {/* filterProps={filterProps}
              sortProps={sortProps}
              paginationProps={paginationProps}
            */}
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
  const Footer = components.Footer || DefaultTableFooter;

  return footer ? (
    <Footer
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
  const FooterRow = components.FooterRow || DefaultTableFooterRow;

  return (
    <FooterRow
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
    const CustomFooterCell = column.components
      ? column.components.FooterCell
      : null;
    const FooterCell =
      CustomFooterCell || components.FooterCell || DefaultTableFooterCell;

    return (
      <KeyWrapper key={`column-${index}`}>
        <FooterCell
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

const mapStateToProps = state => (state, props) =>
  state.getIn(['tables', props.tableKey], Map()).toObject();

const Table = compose(
  // Determine if a tableKey was provided, if not set one and flag this as
  // automatically setting up/tearing down.
  withProps(({ tableKey }) => {
    return {
      tableKey: tableKey || uuid(),
      auto: !tableKey,
    };
  }),
  connect(mapStateToProps),
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
    buildTable,
  }),

  lifecycle({
    componentDidMount() {
      const { data, columns, pageSize, tableKey, auto } = this.props;
      if (auto) {
        setupTable({
          tableKey,
          data,
          columns,
          pageSize,
        });
      }
    },

    componentWillUnmount() {
      if (this.props.auto) {
        teardownTable({ tableKey: this.props.tableKey });
      }
    },
  }),
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

Table.setup = setupTable;
Table.teardown = teardownTable;
export default Table;
