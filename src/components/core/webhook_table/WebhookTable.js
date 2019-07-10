import React from 'react';
import { fetchWebhooks } from '../../../apis/core';
import Table from '../../common/tables/Table';

const dataSource = ({ scope, kappSlug, status }) => ({
  dataSource: fetchWebhooks,
  params: ({ pageSize }) => ({
    include: 'details',
    limit: pageSize,
    scope,
    kappSlug,
    status,
  }),
  transform: result => ({
    data: result.webhooks,
  }),
});

const columns = [
  { value: 'createdAt', title: 'Created At' },
  { value: 'createdBy', title: 'Created By' },
  { value: 'authStrategy', title: 'Authentication Strategy' },
  { value: 'event', title: 'Event' },
  { value: 'filter', title: 'Filter' },
  { value: 'name', title: 'Name' },
  { value: 'type', title: 'Type' },
  { value: 'updatedAt', title: 'Updated At' },
  { value: 'updatedBy', title: 'Updated By' },
  { value: 'url', title: 'URL' },
];

const WebhookTable = props => (
  <Table
    tableKey={props.tableKey}
    components={{
      ...props.components,
    }}
    data={dataSource(props)}
    columns={columns}
    addColumns={props.addColumns}
    alterColumns={props.alterColumns}
    columnSet={props.columnSet}
    pageSize={props.pageSize}
    sortable={false}
  >
    {props.children}
  </Table>
);

export default WebhookTable;
