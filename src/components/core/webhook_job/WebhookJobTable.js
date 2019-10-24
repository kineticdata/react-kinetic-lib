import { fetchWebhookJobs } from '../../../apis';
import { generateTable } from '../../table/Table';

const dataSource = ({ scope, kappSlug, status }) => ({
  fn: fetchWebhookJobs,
  params: paramData => [
    {
      include: 'details',
      scope,
      kappSlug,
      status,
      limit: paramData.pageSize,
      pageToken: paramData.nextPageToken,
    },
  ],
  transform: result => ({
    data: result.webhookJobs,
    nextPageToken: result.nextPageToken,
  }),
});

const columns = [
  { value: 'createdAt', title: 'Created At' },
  { value: 'createdBy', title: 'Created By' },
  { value: 'event', title: 'Event' },
  { value: 'id', title: 'ID' },
  { value: 'name', title: 'Name' },
  { value: 'parentId', title: 'Parent ID' },
  { value: 'requestContent', title: 'Request Content' },
  { value: 'responseContent', title: 'Response Content' },
  { value: 'retryCount', title: 'Retry Count' },
  { value: 'scheduledAt', title: 'Scheduled At' },
  { value: 'scopeId', title: 'Scope ID' },
  { value: 'scopeType', title: 'Scope Type' },
  { value: 'status', title: 'Status' },
  { value: 'summary', title: 'Summary' },
  { value: 'type', title: 'Type' },
  { value: 'updatedAt', title: 'Updated At' },
  { value: 'updatedBy', title: 'Updated By' },
  { value: 'url', title: 'URL' },
  { value: 'webhookId', title: 'Webhook ID' },
];

export const WebhookJobTable = generateTable({
  tableOptions: ['scope', 'kappSlug', 'status'],
  columns,
  dataSource,
  sortable: false,
});

WebhookJobTable.displayName = 'WebhookJobTable';
