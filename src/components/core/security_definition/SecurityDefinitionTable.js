import React from 'react';
import { Table } from '../../table/Table';
import { fetchSecurityPolicyDefinitions } from '../../../apis';

const dataSource = ({ kappSlug }) => ({
  fn: fetchSecurityPolicyDefinitions,
  clientSideSearch: true,
  params: () => ({
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
    filterable: true,
    sortable: true,
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
    filterable: true,
    sortable: true,
  },
];

export const SecurityDefinitionTable = props => (
  <Table
    tableKey={props.tableKey}
    components={{
      ...props.components,
    }}
    dataSource={dataSource({
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

SecurityDefinitionTable.defaultProps = {
  columns,
};
