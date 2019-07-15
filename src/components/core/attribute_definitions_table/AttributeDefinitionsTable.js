import React from 'react';
import Table from '../../common/tables/Table';
import { fetchAttributeDefinitions } from '../../../apis/core';

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

const AttributeDefinitionsTable = props => (
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

AttributeDefinitionsTable.defaultProps = {
  columns,
};

export default AttributeDefinitionsTable;
