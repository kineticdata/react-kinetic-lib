import React, { Fragment, useState } from 'react';
import { ObjectType } from '../ObjectType';
import { PropsTable, PropRow } from '../PropsTable';
import { ColumnProps } from './ColumnProps';
import { ListLink } from '../ImmutableLinks';
import { ColumnComponentProps } from './ColumnComponentProps';

export const columnTypeComponents = {
  Header: 'Header',
  HeaderRow: 'HeaderRow',
  HeaderCell: 'HeaderCell',
  Body: 'Body',
  BodyRow: 'BodyRow',
  BodyCell: 'BodyCell',
  Footer: 'Footer',
  FooterRow: 'FooterRow',
  FooterCell: 'FooterCell',
};

export const getTableOptionsType = tableOptions =>
  tableOptions.reduce(
    (reduction, tableOptions) => ({
      ...reduction,
      [tableOptions.name]: [tableOptions.type],
    }),
    {},
  );

const getAlterColumnsDescription = columns => (
  <>
    <div>
      Define customizations to the default field configurations to support a new
      use case. Use this prop to change the component used for a specific column
      or add additional configuration.
    </div>
    {columns
      .filter(column => column.description)
      .map(column => (
        <Fragment key={column.name}>
          <br />
          <strong style={{ fontFamily: 'monospace' }}>{column.name} </strong>
          {column.description}
        </Fragment>
      ))}
  </>
);

const AlterColumnsType = ({ columns, showType }) => (
  <ObjectType
    typeSpec={columns.reduce(
      (reduction, { name, type }) => ({
        ...reduction,
        [name]: <ColumnTypeLink type={type} onClick={showType(type)} />,
      }),
      {},
    )}
  />
);

export const ComponentsType = ({ showType, isColumn }) => {
  return (
    <ObjectType
      typeSpec={Object.values(columnTypeComponents)
        .sort()
        .reduce(
          (reduction, value) => ({
            ...reduction,
            [value]: (
              <ComponentTypeLink
                type={value}
                onClick={() => {
                  return showType(value)()();
                }}
              />
            ),
          }),
          !isColumn
            ? {
                TableLayout: (
                  <ComponentTypeLink
                    type="TableLayout"
                    onClick={() => showType('TableLayout')()()}
                  />
                ),
                FilterLayout: (
                  <ComponentTypeLink
                    type="FilterLayout"
                    onClick={() => showType('FilterLayout')()()}
                  />
                ),

                TextFilter: (
                  <ComponentTypeLink
                    type="TextFilter"
                    onClick={() => showType('TextFilter')()()}
                  />
                ),
                BooleanFilter: (
                  <ComponentTypeLink
                    type="BooleanFilter"
                    onClick={() => showType('BooleanFilter')()()}
                  />
                ),
                EmptyBodyRow: (
                  <ComponentTypeLink
                    type="EmptyBodyRow"
                    onClick={() => showType('EmptyBodyRow')()()}
                  />
                ),
              }
            : {},
        )}
    />
  );
};

export const ComponentTypeLink = ({ onClick, type }) => {
  return (
    <a
      href="#"
      onClick={event => {
        event.preventDefault();
        onClick();
      }}
    >
      {type}
    </a>
  );
};

const DataSourcesObjectType = () => (
  <ObjectType typeSpec={{ '[prop: string]': <a href="#">DataSource</a> }} />
);

export const ColumnTypeLink = ({ onClick, type = 'T' }) => (
  <a
    href="#"
    role="button"
    onClick={event => {
      event.preventDefault();
      onClick();
    }}
  >
    Column&lt;{type}&gt;
  </a>
);

export const TableProps = ({ columns, tableOptions }) => {
  const [showingTypes, setShowingTypes] = useState([{ name: 'Props' }]);
  const showType = name => type => (...typeParams) => () => {
    setShowingTypes([...showingTypes, { name, type, typeParams }]);
  };
  const currentType = showingTypes[showingTypes.length - 1]['type'];
  console.log(showingTypes);
  return (
    <>
      <h3>
        {showingTypes.map(({ name, type, typeParams = [] }, i) => {
          const Wrapper = props =>
            i < showingTypes.length - 1 ? (
              <>
                <a
                  href="#"
                  onClick={event => {
                    event.preventDefault();
                    setShowingTypes(showingTypes.slice(0, i + 1));
                  }}
                >
                  {props.children}
                </a>
                &nbsp;/&nbsp;
              </>
            ) : (
              <span>{props.children}</span>
            );
          return (
            <Wrapper key={i}>
              {name}
              {type && (
                <>
                  : {type}
                  <span style={{ fontFamily: 'monospace' }}>
                    {typeParams.length > 0 && `<${typeParams.join(', ')}>`}
                  </span>
                </>
              )}
            </Wrapper>
          );
        })}
      </h3>
      {currentType === 'Column' ? (
        <ColumnProps
          type={showingTypes[showingTypes.length - 1]['typeParams'][0]}
          showType={showType}
          tableOptions={tableOptions}
        />
      ) : Object.values(columnTypeComponents).includes(currentType) ||
        [
          'TableLayout',
          'FilterLayout',
          'TextFilter',
          'BooleanFilter',
          'EmptyBodyRow',
        ].includes(currentType) ? (
        <ColumnComponentProps
          type={currentType}
          tableOptions={tableOptions}
          showType={showType}
        />
      ) : (
        // ) : ? (
        //   <TableLayoutProps />
        <PropsTable>
          {tableOptions.map(tableOption => (
            <PropRow
              key={tableOption.name}
              name={tableOption.name}
              type={tableOption.type}
              description={tableOption.description}
            />
          ))}
          <PropRow
            name="addColumns?"
            type={
              <>
                <ColumnTypeLink
                  onClick={showType('addColumns')('Column')('T')}
                />
                []
              </>
            }
            description="Define additional columns to add to the table."
          />
          <PropRow
            name="alterColumns?"
            type={
              <AlterColumnsType
                columns={columns}
                showType={showType('alterColumns')('Column')}
              />
            }
            description={getAlterColumnsDescription(columns)}
          />

          <PropRow
            name="columnSet?"
            type={
              <>
                <div>string[] |</div>
                <div>
                  ((columnNames: <ListLink type="string" />) => string[] |{' '}
                  <ListLink type="string" />)
                </div>
              </>
            }
            description="Specify a subset of the columns that should be visible and included when the table is rendered."
          />
          <PropRow name="tableKey?" odd type="string" />
          <PropRow
            name="pageSize?"
            type="number"
            description="The number of entries shown per page."
          />
          <PropRow
            name="sortable?"
            odd
            type="boolean"
            description="Enable or disable sorting the table."
          />
          <PropRow
            name="defaultSortColumn?"
            type="string"
            description="Set the column used for initial sorting."
          />
          <PropRow
            name="defaultSortDirection?"
            odd
            type="string"
            description="Set the initial sort direction."
          />
          <PropRow
            name="omitHeader?"
            odd
            type="boolean"
            description="Suppress rendering the table header."
          />
          <PropRow
            name="includeFooter?"
            odd
            type="boolean"
            description="Enable rendering of the table footer (not rendered by default.)"
          />
          <PropRow
            name="components?"
            type={<ComponentsType showType={showType('components')} />}
          />
        </PropsTable>
      )}
    </>
  );
};
