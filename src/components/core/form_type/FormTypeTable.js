import React from 'react';
import { Table } from '../../table/Table';
import { fetchFormTypes } from '../../../apis';

const dataSource = ({ kappSlug }) => ({
  fn: fetchFormTypes,
  clientSideSearch: true,
  params: () => ({
    kappSlug,
  }),
  transform: result => {
    return {
      data: result.formTypes,
    };
  },
});

const columns = [
  {
    value: 'name',
    title: 'Form Type',
    filterable: true,
    sortable: false,
  },
];

export const FormTypeTable = props => (
  <Table
    tableKey={props.tableKey}
    components={{
      ...props.components,
    }}
    dataSource={dataSource({
      kappSlug: props.kappSlug,
      attributeType: props.attributeType,
    })}
    columns={columns}
    addColumns={props.addColumns}
    alterColumns={props.alterColumns}
    columnSet={props.columnSet}
    pageSize={props.pageSize}
  >
    {props.children}
  </Table>
);

FormTypeTable.defaultProps = {
  columns,
};
