import React from 'react';
import Table from '../../common/tables/Table';
import { fetchSecurityPolicyDefinitions } from '../../../apis/core';

const data = {
  dataSource: fetchSecurityPolicyDefinitions,
  params: ({ pageSize, sortColumn, sortDirection, filters }) => ({
    include: 'details',
  }),
  transform: result => ({
    data: result.securityPolicyDefinitions,
  }),
};

const columns = [
  {
    value: 'message',
    title: 'Message',
    filterable: false,
    sortable: false,
  },
  {
    value: 'name',
    title: 'Name',
    filterable: false,
    sortable: false,
  },
  {
    value: 'rule',
    title: 'Rule',
    filterable: false,
    sortable: false,
  },
  {
    value: 'type',
    title: 'Type',
    filterable: false,
    sortable: false,
  },
];

export const SecuityDefinitionTable = props => (
  <Table
    tableKey={props.tableKey}
    components={{
      ...props.components,
    }}
    data={data}
    columns={columns}
    alterColumns={props.alterColumns}
    addColumns={props.addColumns}
    columnSet={props.columnSet}
  >
    {props.children}
  </Table>
);

export default SecuityDefinitionTable;

SecuityDefinitionTable.defaultProps = {
  columns,
};
