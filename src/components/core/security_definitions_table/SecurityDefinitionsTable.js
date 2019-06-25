import React from 'react';
import Table from '../../common/tables/Table';
import { fetchSecurityPolicyDefinitions } from '../../../apis/core';

const dataSource = ({ kappSlug = null }) => ({
  dataSource: fetchSecurityPolicyDefinitions,
  params: ({ pageSize, sortColumn, sortDirection, filters }) => ({
    include: 'details',
    kappSlug,
  }),
  transform: result => ({
    data: result.securityPolicyDefinitions,
  }),
});

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

export const SecuityDefinitionsTable = props => (
  <Table
    tableKey={props.tableKey}
    components={{
      ...props.components,
    }}
    data={dataSource({
      kappSlug: props.kappSlug,
    })}
    columns={columns}
    alterColumns={props.alterColumns}
    addColumns={props.addColumns}
    columnSet={props.columnSet}
  >
    {props.children}
  </Table>
);

export default SecuityDefinitionsTable;

SecuityDefinitionsTable.defaultProps = {
  columns,
};
