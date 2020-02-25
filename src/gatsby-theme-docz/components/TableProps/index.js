import React, { Fragment, useState } from 'react';
import { TypePopover } from '../TypePopover';
// import { FieldProps } from './FieldProps';
// import { FieldComponentProps } from './FieldComponentProps';
import { ObjectType } from '../ObjectType';
import { PropsTable, PropRow } from '../PropsTable';
import { TableLayoutProps } from './TableLayoutProps';
import { ColumnProps } from './ColumnProps';
import { ListLink, OrderedSetLink } from '../ImmutableLinks';
// import { FormLayoutProps } from './FormLayoutProps';
// import { FormErrorProps } from './FormErrorProps';
// import { FormButtonProps } from './FormButtonProps';

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

const getBindingsType = dataSources =>
  dataSources.reduce(
    (reduction, dataSource) => ({
      ...reduction,
      [dataSource.name]: dataSource.type,
    }),
    {},
  );

export const getTableOptionsType = tableOptions =>
  tableOptions.reduce(
    (reduction, tableOptions) => ({
      ...reduction,
      [tableOptions.name]: [tableOptions.type],
    }),
    {},
  );

const getAlterFieldsDescription = fields => (
  <>
    <div>
      Define customizations to the default field configurations to support a new
      use case. Use this prop to change the component used for a specific field
      or add additional constraints.
    </div>
    {fields
      .filter(field => field.description)
      .map(field => (
        <Fragment key={field.name}>
          <br />
          <strong style={{ fontFamily: 'monospace' }}>{field.name} </strong>
          {field.description}
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
  console.log(isColumn);
  return (
    <ObjectType
      typeSpec={Object.values(columnTypeComponents)
        .sort()
        .reduce(
          (reduction, value) => ({
            ...reduction,
            [value]: <ComponentTypeLink type={value} showType={showType} />,
          }),
          !isColumn
            ? {
                TableLayout: (
                  <ComponentTypeLink type="TableLayout" showType={showType} />
                ),
                FilterLayout: (
                  <ComponentTypeLink type="FilterLayout" showType={showType} />
                ),

                TextFilter: (
                  <ComponentTypeLink type="TextFilter" showType={showType} />
                ),
                BooleanFilter: (
                  <ComponentTypeLink type="BooleanFilter" showType={showType} />
                ),
                EmptyBodyRow: (
                  <ComponentTypeLink type="EmptyBodyRow" showType={showType} />
                ),
              }
            : {},
        )}
    />
  );
};

export const ComponentTypeLink = ({ showType, type }) => (
  <a
    href="#"
    onClick={event => {
      event.preventDefault();
      showType(type)()();
    }}
  >
    {type}
  </a>
);

const DataSourcesObjectType = () => (
  <ObjectType typeSpec={{ '[prop: string]': <a href="#">DataSource</a> }} />
);

const ColumnTypeLink = ({ onClick, type = 'T' }) => (
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
          showType={showType()}
          tableOptions={tableOptions}
        />
      ) : // <FieldProps
      //   bindings={getBindingsType(dataSources)}
      //   type={showingTypes[showingTypes.length - 1]['typeParams'][0]}
      //   showType={showType}
      // />
      // ) : Object.values(fieldTypeComponents).includes(currentType) ? (
      //   <FieldComponentProps type={currentType} />
      // ) : currentType === 'FormButtons' ? (
      //   <FormButtonProps formOptions={getFormOptionsType(formOptions)} />
      // ) : currentType === 'FormError' ? (
      //   <FormErrorProps />
      currentType === 'TableLayout' ? (
        <TableLayoutProps />
      ) : (
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
            description={getAlterFieldsDescription(columns)}
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
            name="onSave?"
            type={
              <>
                (
                <TypePopover
                  name="tableOptions: O"
                  typeSpec={getTableOptionsType(tableOptions)}
                />
                ) => (result: R) => void
              </>
            }
          />
          <PropRow
            name="onError?"
            type={
              <>
                (
                <TypePopover
                  name="tableOptions: O"
                  name="tableOptions: O"
                  typeSpec={getTableOptionsType(tableOptions)}
                />
                ) => (error: unknown) => void
              </>
            }
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
