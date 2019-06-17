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
import { generateKey } from '../../../helpers';

const fromColumnSet = (columns, columnSet) =>
  columnSet.map(cs => columns.find(c => c.get('value') === cs));

const KeyWrapper = ({ children }) => children;

const TableComponent = props => {
  if (props.configured) {
    const { children, loading, initializing } = props;
    const table = buildTable(props);
    const filter = buildFilterControl(props);
    const pagination = buildPaginationControl(props);

    return children({
      table,
      filter,
      pagination,
      initializing,
      loading,
    });
  }
  return null;
};

const buildFilterControl = ({
  components,
  filters,
  tableKey,
  columnSet,
  loading,
  initializing,
}) => {
  // Add an onChange to each filter and convert it to a list for looping.
  const f = filters.toIndexedSeq().toList();

  const onSearch = e => {
    e.preventDefault();
    dispatch('APPLY_FILTERS', { tableKey });
  };

  const FilterControl = components.FilterControl;
  return (
    FilterControl && (
      <FilterControl
        filters={f}
        onSearch={onSearch}
        columnSet={columnSet}
        loading={loading}
        initializing={initializing}
      />
    )
  );
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
    tableKey,
    data,
    pageTokens,
    pageSize,
    pageOffset,
    currentPageToken,
    components,
    loading,
  } = props;
  const PaginationControl = components.PaginationControl;
  const prevPage = hasPrevPage(data, pageTokens, pageOffset)
    ? onPrevPage(tableKey)
    : null;

  const nextPage = hasNextPage(data, pageOffset, pageSize, currentPageToken)
    ? onNextPage(tableKey)
    : null;

  return (
    <PaginationControl
      prevPage={prevPage}
      nextPage={nextPage}
      loading={loading}
    />
  );
};

export const buildTable = props => {
  const TableLayout = props.components.TableLayout;
  const header = buildTableHeader(props);
  const body = buildTableBody(props);
  const footer = buildTableFooter(props);

  return (
    <TableLayout
      header={header}
      body={body}
      footer={footer}
      initializing={props.initializing}
      loading={props.loading}
    />
  );
};

export const buildTableHeader = props => {
  const Header = props.components.Header;
  const headerRow = buildTableHeaderRow(props);
  return props.omitHeader ? null : (
    <Header sortable={props.sortable} headerRow={headerRow} rows={props.rows} />
  );
};

export const buildTableHeaderRow = props => {
  const { components, rows, columns, columnSet } = props;
  const HeaderRow = components.HeaderRow;
  const columnHeaders = fromColumnSet(columns, columnSet).map(
    buildTableHeaderCell(props),
  );

  return <HeaderRow columnHeaders={columnHeaders} rows={rows.toJS()} />;
};

export const buildTableHeaderCell = props => (column, index) => {
  const { tableKey, components, columnComponents } = props;
  const HeaderCell = columnComponents.getIn(
    [column.get('value'), 'HeaderCell'],
    components.HeaderCell,
  );

  const sorting = column === props.sortColumn && props.sortDirection;
  const sortable = props.sortable && column.get('sortable');

  return (
    <KeyWrapper key={`column-${index}`}>
      <HeaderCell
        onSortColumn={onSortColumn(tableKey, column)}
        title={column.get('title')}
        sorting={sorting}
        sortable={sortable}
      />
    </KeyWrapper>
  );
};

export const buildTableBody = props => {
  const Body = props.components.Body;
  const tableRows = buildTableBodyRows(props);

  return (
    <Body
      loading={props.loading}
      initializing={props.initializing}
      tableRows={tableRows}
    />
  );
};

export const buildTableBodyRows = props => {
  const { components, rows, columns, columnSet, appliedFilters } = props;
  const BodyRow = components.BodyRow;
  const EmptyBodyRow = components.EmptyBodyRow;

  const tableRows =
    rows.size > 0 ? (
      rows.map((row, index) => {
        const cells = buildTableBodyCells(props, row, index);
        return (
          <KeyWrapper key={`row-${index}`}>
            <BodyRow cells={cells} columns={columns} row={row} index={index} />
          </KeyWrapper>
        );
      })
    ) : (
      <EmptyBodyRow
        colSpan={columnSet.size}
        initializing={props.initializing}
        loading={props.loading}
        appliedFilters={appliedFilters}
      />
    );

  return tableRows;
};

export const buildTableBodyCells = (props, row, _rowIndex) => {
  const { components, rows, columns, columnSet, columnComponents } = props;

  return fromColumnSet(columns, columnSet).map((column, index) => {
    const BodyCell = columnComponents.getIn(
      [column.get('value'), 'BodyCell'],
      components.BodyCell,
    );

    const value = row[column.get('value')];

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
  const { components, columnSet, rows, includeFooter } = props;
  const footerRow = buildTableFooterRow(props);
  const Footer = components.Footer;

  return includeFooter ? (
    <Footer rows={rows.toJS()} footerRow={footerRow} colSpan={columnSet.size} />
  ) : null;
};

export const buildTableFooterRow = props => {
  const { components } = props;
  const cells = buildTableFooterCells(props);
  const FooterRow = components.FooterRow;

  return <FooterRow cells={cells} />;
};

export const buildTableFooterCells = props => {
  const { components, columns, columnSet, columnComponents } = props;
  return fromColumnSet(columns, columnSet).map((column, index) => {
    const FooterCell = columnComponents.getIn(
      [column.get('value'), 'FooterCell'],
      components.FooterCell,
    );

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

export const generateColumns = (columns, addColumns, alterColumns) =>
  List(addColumns)
    .concat(columns)
    .map(c => Map({ ...c, ...alterColumns[c.value], value: c.value }));

export const extractColumnComponents = columns =>
  columns
    .filter(c => c.has('components'))
    .reduce(
      (result, current) =>
        result.set(current.get('value'), current.get('components')),
      Map(),
    );

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
    const columns = generateColumns(
      this.props.columns,
      this.props.addColumns,
      this.props.alterColumns,
    );
    const allColumns = columns.map(c => c.get('value'));
    const columnSet = List(
      this.props.columnSet
        ? typeof this.props.columnSet === 'function'
          ? this.props.columnSet(allColumns)
          : this.props.columnSet
        : allColumns,
    ).filter(c => columns.find(c2 => c2.get('value') === c));
    const columnComponents = extractColumnComponents(columns);

    return (
      <ComponentConfigContext.Consumer>
        {componentConfig => {
          return (
            <TableImpl
              {...this.props}
              components={componentConfig.merge(this.props.components).toJS()}
              columnComponents={columnComponents}
              columns={columns}
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

  /** Set the page size when paginating data. */
  pageSize: t.number,

  /**
   * Flag to enable/disable sorting support.
   * @ignore
   */
  sortable: t.bool,
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
  addColumns: [],
  emptyMessage: 'No data found.',

  sortable: true,
  pageSize: 25,
  omitHeader: false,
  includeFooter: false,
};

Table.defaultProps = defaultProps;

Table.configure = configureTable;
// Table.mount = mountTable;
// Table.unmount = unmountTable;

/**
 * @component
 */
export default Table;
