import { fetchWebhooks } from '../../../apis';
import { generateTable } from '../../table/Table';

const dataSource = ({ scope, kappSlug }) => ({
  fn: fetchWebhooks,
  clientSideSearch: true,
  params: () => [
    {
      include: 'details',
      scope,
      kappSlug,
    },
  ],
  transform: result => ({
    data: result.webhooks,
  }),
});

const columns = [
  {
    value: 'createdAt',
    title: 'Created At',
    filter: 'equals',
    type: 'text',
  },
  {
    value: 'createdBy',
    title: 'Created By',
    filter: 'startsWith',
    type: 'text',
  },
  { value: 'event', title: 'Event', filter: 'startsWith', type: 'text' },
  { value: 'filter', title: 'Filter' },
  { value: 'name', title: 'Name', filter: 'startsWith', type: 'text' },
  { value: 'type', title: 'Type', filter: 'startsWith', type: 'text' },
  {
    value: 'updatedAt',
    title: 'Updated At',
    filter: 'startsWith',
    type: 'text',
  },
  {
    value: 'updatedBy',
    title: 'Updated By',
    filter: 'startsWith',
    type: 'text',
  },
  { value: 'url', title: 'URL' },
];

export const WebhookTable = generateTable({
  tableOptions: ['scope', 'kappSlug'],
  columns,
  dataSource,
});

WebhookTable.displayName = 'WebhookTable';
