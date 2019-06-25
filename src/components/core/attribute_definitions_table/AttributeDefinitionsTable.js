import React from 'react';
import Table from '../../common/tables/Table';
import { fetchAttributeDefinitions } from '../../../apis/core';

const dataSource = ({ attributeType }) => ({
  dataSource: fetchAttributeDefinitions,
  params: ({ pageSize }) => ({
    include: 'details',
    limit: pageSize,
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

const AttributeDefinitionsTable = props => (
  <Table
    tableKey={props.tableKey}
    components={{
      ...props.components,
    }}
    data={dataSource({
      attributeType: props.attributeType,
    })}
    columns={columns}
    addColumns={props.addColumns}
    columnSet={props.columnSet}
    pageSize={props.pageSize}
  >
    {props.children}
  </Table>
);

AttributeDefinitionsTable.defaultProps = {
  columns,
};

export default AttributeDefinitionsTable;
