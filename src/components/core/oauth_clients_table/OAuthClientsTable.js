import React from 'react';
import Table from '../../common/tables/Table';
import { fetchOAuthClients } from '../../../apis/core';

const dataSource = () => ({
  dataSource: fetchOAuthClients,
  params: () => ({}),
  transform: result => ({
    data: result.oauthClients,
  }),
});

const columns = [
  {
    value: 'clientId',
    title: 'Client ID',
    filterable: true,
    sortable: true,
  },
  {
    value: 'description',
    title: 'Description',
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
    value: 'redirectUri',
    title: 'Redirect URI',
    filterable: false,
    sortable: true,
  },
];

export const OAuthClientTable = props => (
  <Table
    tableKey={props.tableKey}
    components={{
      ...props.components,
    }}
    data={dataSource()}
    columns={columns}
    alterColumns={props.alterColumns}
    addColumns={props.addColumns}
    columnSet={props.columnSet}
    pageSize={props.pageSize}
  >
    {props.children}
  </Table>
);

export default OAuthClientTable;

OAuthClientTable.defaultProps = {
  columns,
};
