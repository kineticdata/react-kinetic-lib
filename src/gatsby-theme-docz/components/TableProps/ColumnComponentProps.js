import React from 'react';
import { PropRow, PropsTable } from '../PropsTable';
import { get } from 'immutable';
import { TypePopover } from '../TypePopover';
import { ColumnTypeLink, getTableOptionsType } from './index';
import { ListLink, MapLink } from '../ImmutableLinks';

export const ColumnComponentProps = ({ type, tableOptions, showType }) => {
  const columnComponents = {
    Body: (
      <PropsTable>
        <PropRow
          description="Resulting element from Header component."
          name="loading"
          type="boolean"
        />
        <PropRow
          description="Resulting element from Header component."
          name="initializing"
          type="boolean"
        />
        <PropRow
          name="tableOptions"
          type={
            <TypePopover
              name="tableOptions: O"
              typeSpec={getTableOptionsType(tableOptions)}
            />
          }
        />
        <PropRow
          name="tableRows"
          type="React.Element [] | React.Element"
          description="The array of table body rows or the empty body row if there are no rows to be rendered."
        />
        <PropRow
          description="A string provided when there is an error encounted fetching data for the table."
          name="error"
          type="string"
        />
        <PropRow
          description="Flag denoting that the dataset is empty."
          name="empty"
          type="boolean"
        />
      </PropsTable>
    ),
    BodyCell: (
      <PropsTable>
        <PropRow name="tableKey" type="string" />
        <PropRow
          name="row"
          type={
            <>
              <MapLink type="string, any" />
            </>
          }
          description="Map containing the data for the current row."
        />
        <PropRow
          name="rowIndex"
          type="number"
          description="The index of the row in which this cell is in."
        />
        <PropRow
          name="index"
          type="number"
          description="The index of this cell in the list of columns."
        />
        <PropRow
          name="value"
          type="any"
          description="The value of the cell mapped from the dataset."
        />
        <PropRow
          name="rows"
          type={<ListLink type={<MapLink type={'string, any'} />} />}
          description="All of the rows being rendered in the table."
        />
        <PropRow
          name="column"
          type={<ColumnTypeLink onClick={showType('column')('Column')('T')} />}
          description="The column definition for this column."
        />
        <PropRow
          name="tableOptions"
          type={
            <TypePopover
              name="tableOptions: O"
              typeSpec={getTableOptionsType(tableOptions)}
            />
          }
        />
      </PropsTable>
    ),
    BodyRow: (
      <PropsTable>
        <PropRow
          name="cells"
          type={<ListLink type="React.Element" />}
          description="All of the rendered cell React elements for the current row."
        />
        <PropRow
          name="columns"
          type={
            <ListLink
              type={
                <ColumnTypeLink onClick={showType('column')('Column')('T')} />
              }
            />
          }
          description="A list of the column definitions."
        />
        <PropRow
          name="row"
          type={
            <>
              <MapLink type="string, any" />
            </>
          }
          description="Map containing the data for the current row."
        />
        <PropRow
          name="index"
          type="number"
          description="The index of the row in which this cell is in."
        />
        <PropRow
          name="tableOptions"
          type={
            <TypePopover
              name="tableOptions: O"
              typeSpec={getTableOptionsType(tableOptions)}
            />
          }
        />
      </PropsTable>
    ),
    Footer: (
      <PropsTable>
        <PropRow
          name="rows"
          type={<ListLink type={<MapLink type={'string, any'} />} />}
          description="All of the rows being rendered in the table."
        />
        <PropRow
          name="footerRow"
          type="React.Element"
          description="The rendered footer row React element."
        />
        <PropRow
          name="colSpan"
          type="number"
          description="The number of columns expected to be rendered."
        />
        <PropRow
          name="tableOptions"
          type={
            <TypePopover
              name="tableOptions: O"
              typeSpec={getTableOptionsType(tableOptions)}
            />
          }
        />
      </PropsTable>
    ),
    FooterCell: (
      <PropsTable>
        <PropRow
          name="column"
          type={<ColumnTypeLink onClick={showType('column')('Column')('T')} />}
          description="The column definition for this column."
        />
        <PropRow
          name="tableOptions"
          type={
            <TypePopover
              name="tableOptions: O"
              typeSpec={getTableOptionsType(tableOptions)}
            />
          }
        />
      </PropsTable>
    ),
    FooterRow: (
      <PropsTable>
        <PropRow
          name="cells"
          type={<ListLink type="React.Element" />}
          description="All of the rendered cell React elements for the current row."
        />
        <PropRow
          name="tableOptions"
          type={
            <TypePopover
              name="tableOptions: O"
              typeSpec={getTableOptionsType(tableOptions)}
            />
          }
        />
      </PropsTable>
    ),
    Header: (
      <PropsTable>
        <PropRow
          name="sortable"
          type="boolean"
          description="A flag denoting whether sorting is enabled."
        />
        <PropRow
          name="headerRow"
          type="React.Element"
          description="React element representing the rendered header row."
        />
        <PropRow
          name="rows"
          type={<ListLink type={<MapLink type={'string, any'} />} />}
          description="All of the rows being rendered in the table."
        />
      </PropsTable>
    ),
    HeaderCell: (
      <PropsTable>
        <PropRow
          name="onSortColumn"
          type="() => void"
          description="Function to be called in order to toggle sorting of by current column."
        />
        <PropRow name="title" type="string" description="The column's title." />
        <PropRow
          name="sorting"
          type="boolean"
          description="A flag denoting whether the table is currently being sorted by this column."
        />
        <PropRow
          name="sortable"
          type="boolean"
          description="A flag denoting whether sorting is enabled for this column."
        />
      </PropsTable>
    ),
    HeaderRow: (
      <PropsTable>
        <PropRow
          name="columnHeaders"
          type={<ListLink type="React.Element" />}
          description="List of the React header columns elements to be rendered."
        />
        <PropRow
          name="rows"
          type={<ListLink type={<MapLink type={'string, any'} />} />}
          description="All of the rows being rendered in the table."
        />
      </PropsTable>
    ),
    TableLayout: (
      <PropsTable>
        <PropRow
          description="Resulting element from Header component."
          name="header"
          type="React.Element"
        />
        <PropRow
          description="Resulting element from Body component."
          name="body"
          type="React.Element"
        />
        <PropRow
          description="Resulting element from Footer component."
          name="footer"
          type="React.Element"
        />
        <PropRow
          description="Resulting element from Header component."
          name="initializing"
          type="boolean"
        />
        <PropRow
          description="Resulting element from Header component."
          name="loading"
          type="boolean"
        />
        <PropRow
          description="Resulting element from Header component."
          name="error"
          type="string"
        />
        <PropRow
          description="Resulting element from Header component."
          name="empty"
          type="boolean"
        />
      </PropsTable>
    ),
    FilterLayout: (
      <PropsTable>
        <PropRow
          name="filters"
          type="Map<string, Map({ value: string, column: Column<T> })>"
          description="Map storing the current values for filters and the column configuration."
        />
        <PropRow
          name="appliedFilters"
          type="Map<string, Map({ value: string, column: Column<T> })>"
          description="Map storing the values for filters being used to display table rows and the column configuration."
        />
        <PropRow
          name="validFilters"
          type="boolean"
          description="True when all filters are valid."
        />
        <PropRow
          name="onSearch"
          type="(e?: React.SyntheticEvent<T>) => void"
          description="Event handler typically used for form submits to apply filters."
        />
        <PropRow
          name="onReset"
          type="(e?: React.SyntheticEvent<T>) => void"
          description="Event handler used to reset applied and current filter values."
        />
        <PropRow
          name="onClear"
          type="(e?: React.SyntheticEvent<T>) => void"
          description="Event handler used to clear current filter values."
        />
        <PropRow
          name="onChangeFilter"
          type="(value: string, filterName: string) => void"
          description="Event handler used for updating the current value of a filter."
        />
        <PropRow
          name="columnSet"
          type={<ListLink type="string" />}
          description="List of of currently rendered columns."
        />
        <PropRow
          description="Resulting element from Header component."
          name="loading"
          type="boolean"
        />
        <PropRow
          description="Resulting element from Header component."
          name="initializing"
          type="boolean"
        />
        <PropRow
          name="tableOptions"
          type={
            <TypePopover
              name="tableOptions: O"
              typeSpec={getTableOptionsType(tableOptions)}
            />
          }
        />
        <PropRow name="tableKey" type="string" />
      </PropsTable>
    ),
    TextFilter: (
      <PropsTable>
        <PropRow
          name="value"
          type="string"
          description="Current filter's value."
        />
        <PropRow
          name="name"
          type="string"
          description="Current filter's column name."
        />
        <PropRow
          name="title"
          type="string"
          description="Current filter's column title."
        />
        <PropRow
          name="onChange"
          type="(value: string, filterName?: string) => void"
          description="Event handler for changing filter values, defaults to the current filter."
        />
        <PropRow
          name="options"
          type={
            <>
              {'('}
              <TypePopover
                name="tableOptions: O"
                typeSpec={getTableOptionsType(tableOptions)}
              />
              {') => [{ label: string, value: string }]'}
            </>
          }
          description="Function called to generate options for filters, such as `select` inputs."
        />
        <PropRow
          name="tableOptions"
          type={
            <TypePopover
              name="tableOptions: O"
              typeSpec={getTableOptionsType(tableOptions)}
            />
          }
        />
        <PropRow
          name="filters"
          type="Map<string, Map({ value: string, column: Column<T> })>"
          description="Map storing the values for filters being used to display table rows and the column configuration."
        />
      </PropsTable>
    ),
    BooleanFilter: (
      <PropsTable>
        <PropRow
          name="value"
          type="string"
          description="Current filter's value."
        />
        <PropRow
          name="name"
          type="string"
          description="Current filter's column name."
        />
        <PropRow
          name="title"
          type="string"
          description="Current filter's column title."
        />
        <PropRow
          name="onChange"
          type="(value: string, filterName?: string) => void"
          description="Event handler for changing filter values, defaults to the current filter."
        />
        <PropRow
          name="options"
          type={
            <>
              {'('}
              <TypePopover
                name="tableOptions: O"
                typeSpec={getTableOptionsType(tableOptions)}
              />
              {') => [{ label: string, value: string }]'}
            </>
          }
          description="Function called to generate options for filters, such as `select` inputs."
        />
        <PropRow
          name="tableOptions"
          type={
            <TypePopover
              name="tableOptions: O"
              typeSpec={getTableOptionsType(tableOptions)}
            />
          }
        />
        <PropRow
          name="filters"
          type="Map<string, Map({ value: string, column: Column<T> })>"
          description="Map storing the values for filters being used to display table rows and the column configuration."
        />
      </PropsTable>
    ),
    EmptyBodyRow: (
      <PropsTable>
        <PropRow
          name="colSpan"
          type="number"
          description="The number of columns expected to be rendered."
        />
        <PropRow
          description="Resulting element from Header component."
          name="loading"
          type="boolean"
        />
        <PropRow
          description="Resulting element from Header component."
          name="initializing"
          type="boolean"
        />
        <PropRow
          name="appliedFilters"
          type="Map<string, Map({ value: string, column: Column<T> })>"
          description="Map storing the values for filters being used to display table rows and the column configuration."
        />
        <PropRow
          name="tableOptions"
          type={
            <TypePopover
              name="tableOptions: O"
              typeSpec={getTableOptionsType(tableOptions)}
            />
          }
        />
        <PropRow
          description="A string provided when there is an error encounted fetching data for the table."
          name="error"
          type="string"
        />
      </PropsTable>
    ),
  };

  return get(columnComponents, type, <div />);
};
