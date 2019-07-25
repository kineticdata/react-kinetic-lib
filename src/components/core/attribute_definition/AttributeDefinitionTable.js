import React from 'react';
import { Table } from '../../table/Table';
import { fetchAttributeDefinitions } from '../../../apis';

const dataSource = ({ kappSlug, attributeType }) => ({
  fn: fetchAttributeDefinitions,
  clientSideSearch: true,
  params: () => ({
    include: 'details',
    kappSlug,
    attributeType,
  }),
  transform: result => {
    return {
      data: result.attributeDefinitions,
    };
  },
});

const columns = [
  {
    value: 'name',
    title: 'Name',
    filterable: false,
    sortable: false,
  },
  {
    value: 'description',
    title: 'Description',
    filterable: false,
    sortable: false,
  },
];

export const AttributeDefinitionTable = props => (
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

AttributeDefinitionTable.defaultProps = {
  columns,
};
