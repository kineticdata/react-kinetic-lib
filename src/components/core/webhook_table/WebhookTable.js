import React from 'react';
import { fetchWebhooks } from '../../../apis/core';
import Table from '../../common/tables/Table';

const dataSource = ({ scope, kappSlug }) => ({
  fn: fetchWebhooks,
  clientSideSearch: true,
  params: () => ({
    include: 'details',
    scope,
    kappSlug,
  }),
  transform: result => ({
    data: result.webhooks,
  }),
});

const columns = [
  { value: 'createdAt', title: 'Created At', filterable: true },
  { value: 'createdBy', title: 'Created By', filterable: true },
  { value: 'authStrategy', title: 'Authentication Strategy' },
  { value: 'event', title: 'Event', filterable: true },
  { value: 'filter', title: 'Filter' },
  { value: 'name', title: 'Name', filterable: true },
  { value: 'type', title: 'Type', filterable: true },
  { value: 'updatedAt', title: 'Updated At', filterable: true },
  { value: 'updatedBy', title: 'Updated By', filterable: true },
  { value: 'url', title: 'URL' },
];

const WebhookTable = props => (
  <Table
    tableKey={props.tableKey}
    components={{
      ...props.components,
    }}
    dataSource={dataSource(props)}
    columns={columns}
    addColumns={props.addColumns}
    alterColumns={props.alterColumns}
    columnSet={props.columnSet}
    pageSize={props.pageSize}
  >
    {props.children}
  </Table>
);

export default WebhookTable;
