import React, { Component } from 'react';
import t from 'prop-types';
import { compose, lifecycle } from 'recompose';
import { List, Map } from 'immutable';
import { ComponentConfigContext } from '../ComponentConfigContext';
import { connect, dispatch } from '../../../store';
import {
  configureTable,
  mountTable,
  unmountTable,
  isClientSide,
} from './Table.redux';
import generateKey from '../../../helpers/generateKey';

const generateColumns = (columns, columnSet) => {
  const allColumns = columns.map(c => c.value);
  const cset =
    typeof columnSet === 'function'
      ? columnSet(allColumns)
      : columnSet && columnSet instanceof Array && columnSet.length > 0
      ? columnSet
      : allColumns;

  return cset.map(cs => columns.find(c => c.value === cs));
};

const KeyWrapper = ({ children }) => children;

const TableComponent = props => {
  if (props.configured) {
    const { children } = props;
    const table = buildTable(props);
    const filter = buildFilterControl(props);
    const pagination = buildPaginationControl(props);

    return children({
      table,
      filter,
      pagination,
    });
  }
  return null;
};

const buildFilterControl = ({
  components,
  filters,
  tableKey,
  filtering,
  columnSet,
}) => {
  // Add an onChange to each filter and convert it to a list for looping.
  const f = filters.toIndexedSeq().toList();

  const onSearch = e => {
    e.preventDefault();
    dispatch('APPLY_FILTERS', { tableKey });
  };

  const FilterControl = components.FilterControl;
  return filtering && FilterControl ? (
    <FilterControl filters={f} onSearch={onSearch} columnSet={columnSet} />
  ) : null;
};

const hasPrevPage = (data, pageTokens, pageOffset) =>
  isClientSide(data) ? pageOffset > 0 : pageTokens.size !== 0;

const hasNextPage = (data, pageOffset, pageSize, currentPageToken) =>
  isClientSide(data)
    ? data
      ? pageOffset + pageSize < data.length
      : false
    : !!currentPageToken;

const buildPaginationControl = props => {
  const {
    pagination,
    tableKey,
    data,
    pageTokens,
    pageSize,
    pageOffset,
    currentPageToken,
    components,
  } = props;
  const PaginationControl = components.PaginationControl;
  const prevPage = hasPrevPage(data, pageTokens, pageOffset)
    ? onPrevPage(tableKey)
    : null;

  const nextPage = hasNextPage(data, pageOffset, pageSize, currentPageToken)
    ? onNextPage(tableKey)
    : null;

  return pagination ? (
    <PaginationControl prevPage={prevPage} nextPage={nextPage} />
  ) : null;
};

export const buildTable = props => {
  const TableLayout = props.components.TableLayout;
  const header = buildTableHeader(props);
  const body = buildTableBody(props);
  const footer = buildTableFooter(props);

  return <TableLayout header={header} body={body} footer={footer} />;
};

export const buildTableHeader = props => {
  const Header = props.components.Header;
  const headerRow = buildTableHeaderRow(props);
  return props.omitHeader ? null : (
    <Header sorting={props.sorting} headerRow={headerRow} rows={props.rows} />
  );
};

export const buildTableHeaderRow = props => {
  const { components, rows, columns, columnSet } = props;
  const HeaderRow = components.HeaderRow;
  const columnHeaders = generateColumns(columns, columnSet).map(
    buildTableHeaderCell(props),
  );

  return <HeaderRow columnHeaders={columnHeaders} rows={rows.toJS()} />;
};

export const buildTableHeaderCell = props => (column, index) => {
  const {
    tableKey,
    components,
    sorting,
    sortColumn,
    sortDirection,
    rows,
  } = props;
  const { title, sortable = false } = column;
  const CustomHeaderCell = column.components
    ? column.components.HeaderCell
    : null;
  const HeaderCell = CustomHeaderCell || components.HeaderCell;

  return (
    <KeyWrapper key={`column-${index}`}>
      <HeaderCell
        onSortColumn={onSortColumn(tableKey, column)}
        title={title}
        column={column}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        sortable={sortable}
      />
    </KeyWrapper>
  );
};

export const buildTableBody = props => {
  const Body = props.components.Body;
  const tableRows = buildTableBodyRows(props);

  return <Body tableRows={tableRows} rows={props.rows.toJS()} />;
};

export const buildTableBodyRows = props => {
  const { components, rows, columns, emptyMessage } = props;
  const BodyRow = components.BodyRow;
  const EmptyBodyRow = components.EmptyBodyRow;

  const tableRows =
    rows.size > 0 ? (
      rows.map((row, index) => {
        const cells = buildTableBodyCells(props, row, index);
        return (
          <KeyWrapper key={`row-${index}`}>
            <BodyRow
              cells={cells}
              columns={columns}
              row={row}
              index={index}
              rows={rows.toJS()}
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

export const buildTableBodyCells = (props, row, rowIndex) => {
  const { components, rows, columns, columnSet } = props;
  return generateColumns(columns, columnSet).map((column, index) => {
    const CustomBodyCell = column.components
      ? column.components.BodyCell
      : null;
    const BodyCell = CustomBodyCell || components.BodyCell;
    const value = row[column.value];

    return (
      <KeyWrapper key={`column-${index}`}>
        <BodyCell
          row={row}
          index={index}
          value={value}
          rows={rows.toJS()}
          column={column}
        />
      </KeyWrapper>
    );
  });
};

export const buildTableFooter = props => {
  const { components, rows, includeFooter } = props;
  const footerRow = buildTableFooterRow(props);
  const Footer = components.Footer;

  return includeFooter ? (
    <Footer rows={rows.toJS()} footerRow={footerRow} />
  ) : null;
};

export const buildTableFooterRow = props => {
  const { components } = props;
  const cells = buildTableFooterCells(props);
  const FooterRow = components.FooterRow;

  return <FooterRow cells={cells} />;
};

export const buildTableFooterCells = props => {
  const { components, columns, columnSet } = props;
  return generateColumns(columns, columnSet).map((column, index) => {
    const CustomFooterCell = column.components
      ? column.components.FooterCell
      : null;
    const FooterCell = CustomFooterCell || components.FooterCell;

    return (
      <KeyWrapper key={`column-${index}`}>
        <FooterCell column={column} />
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

/**
 * @component
 */
const TableImpl = compose(
  connect(mapStateToProps),
  lifecycle({
    componentDidMount() {
      if (this.props.mounted && !this.props.configured) {
        configureTable(this.props);
      }
    },

    componentDidUpdate() {
      if (this.props.mounted && !this.props.configured) {
        configureTable(this.props);
      }
    },
  }),
)(TableComponent);

class Table extends Component {
  constructor(props) {
    super(props);
    const { components, tableKey, ...config } = props;
    this.components = components;
    this.config = config;
    this.auto = !tableKey;
    this.tableKey = tableKey || generateKey();
  }

  componentDidMount() {
    if (this.auto) {
      mountTable(this.tableKey);
    }
  }

  componentWillUnmount() {
    if (this.auto) {
      unmountTable(this.tableKey);
    }
  }

  render() {
    const columnSet =
      this.props.columnSet || this.props.columns.map(c => c.value);
    return (
      <ComponentConfigContext.Consumer>
        {componentConfig => {
          return (
            <TableImpl
              {...this.props}
              components={componentConfig.merge(this.props.components).toJS()}
              columnSet={columnSet}
              tableKey={this.tableKey}
              auto={this.auto}
            >
              {this.props.children}
            </TableImpl>
          );
        }}
      </ComponentConfigContext.Consumer>
    );
  }
}

Table.propTypes = {
  /** Either an array of data (for client-side tables) or an object providing datasource configuration. */
  data: t.oneOfType([t.array, t.object]).isRequired,
  /**
   * Calculated row data from the datasource mechanism.
   * @ignore
   */
  rows: t.instanceOf(List),
  /** An array of the columns that will be rendered on the table. */
  columns: t.arrayOf(
    t.shape({
      /** The title that will be rendered in the header. */
      title: t.string,
      /** The value key that will be used to map the column to the data object. */
      value: t.string,
      /** Flag that determines if the column can be used as a filter. */
      filterable: t.bool,
      /** Flag that determines if the column is sortable.*/
      sortable: t.bool,
      /** Allows overriding the `HeaderCell`, `BodyCell`, and `FooterCell` for a given column. */
      components: t.shape({
        HeaderCell: t.func,
        BodyCell: t.func,
        FooterCell: t.func,
      }),
    }),
  ).isRequired,
  /** Add additional columns to a table. */
  addColumns: t.arrayOf(
    t.shape({
      /** The title that will be rendered in the header. */
      title: t.string,
      /** The value key that will be used to map the column to the data object. */
      value: t.string,
      /** Flag that determines if the column can be used as a filter. */
      filterable: t.bool,
      /** Flag that determines if the column is sortable.*/
      sortable: t.bool,
      /** Allows overriding the `HeaderCell`, `BodyCell`, and `FooterCell` for a given column. */
      components: t.shape({
        HeaderCell: t.func,
        BodyCell: t.func,
        FooterCell: t.func,
      }),
    }),
  ),
  /** Allow overriding the columns shown and in which order. */
  columnSet: t.oneOf([t.arrayOf(t.string), t.func]),
  components: t.shape({
    /** Override the default table layout, analogous to `<table>`. */
    TableLayout: t.func,

    /** Override the table header, analogous to `<thead>`. */
    Header: t.func,
    /** Override the table header row, analogous to the `<tr>` in `<thead>`. */
    HeaderRow: t.func,
    /** Override the table header cells, analogous to `<th>`. */
    HeaderCell: t.func,

    /** Override the table body, analogous to `<tbody>`. */
    Body: t.func,
    /** Override the table rows, analogous to `<tr>`. */
    BodyRow: t.func,
    /** Override the table body row when there is no data. */
    EmptyBodyRow: t.func,
    /** Override the table cells, analogous to `<td>`. */
    BodyCell: t.func,

    /** Override the table footer, analogous to `<tfoot>`. */
    Footer: t.func,
    /** Override the table footer row, analogous to the `<tr>` in `<tfoot>`. */
    FooterRow: t.func,
    /** Override the table footer cells, analogous to `<td>`. */
    FooterCell: t.func,
  }),
  /** Override the text message in the empty body row when there is no data in the table. */
  emptyMessage: t.string,
  /** Flag to enable/disable pagination support. */
  pagination: t.bool,
  /** Set the page size when paginating data. */
  pageSize: t.number,
  /** Flag to enable/disable filtering support. */
  filtering: t.bool,
  /** Flag to enable/disable sorting support. */
  sorting: t.bool,
  /** The child of this component should be a function which renders the table layout. */
  children: t.func.isRequired,

  /** A flag used to suppress the rendering of the table header. */
  omitHeader: t.bool,
  /** A flag used to enable to rendering of the table footer. */
  includeFooter: t.bool,
};

const defaultProps = {
  components: {},
  rows: List([]),
  columns: [],
  emptyMessage: 'No data found.',

  filtering: true,
  sorting: true,
  pagination: true,
  pageSize: 25,
  omitHeader: false,
  includeFooter: false,
};

Table.defaultProps = defaultProps;

Table.configure = configureTable;
Table.mount = mountTable;
Table.unmount = unmountTable;

/**
 * @component
 */
export default Table;
