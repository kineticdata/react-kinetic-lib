import {
  fetchWebhookJobs,
  fetchKappWebhookEvents,
  fetchSpaceWebhookEvents,
} from '../../../apis';
import { generateTable } from '../../table/Table';
import { defineFilter } from '../../../helpers';
import { List, Map } from 'immutable';

const clientSide = defineFilter(true)
  .startsWith('name', 'name')
  .equals('event', 'event')
  .equals('type', 'type')
  .between('scheduledAt', 'minScheduledAt', 'maxScheduledAt')
  .end();

const dataSource = ({ scope, kappSlug, status }) => ({
  fn: fetchWebhookJobs,
  clientSide,
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

const filterDataSources = ({ kappSlug }) => ({
  events: {
    fn: kappSlug ? fetchKappWebhookEvents : fetchSpaceWebhookEvents,
    params: [],
    transform: result => result,
  },
});

const filters = () => ({ events, values }) =>
  events && [
    {
      name: 'minScheduledAt',
      label: 'Start',
      type: 'date',
    },
    {
      name: 'maxScheduledAt',
      label: 'End',
      type: 'date',
    },
    { name: 'name', label: 'Name', type: 'text' },
    {
      name: 'type',
      label: 'Type',
      type: 'select',
      options: ({ events }) =>
        events
          ? events
              .keySeq()
              .sort()
              .map(type => Map({ label: type, value: type }))
          : List(),
      onChange: ({ values }, { setValue }) => {
        if (values.get('event')) {
          setValue('event', '');
        }
      },
    },
    {
      name: 'event',
      label: 'Event',
      type: 'select',
      options: ({ values, events }) =>
        values && events
          ? events
              .get(values.get('type'), List())
              .map(event => Map({ label: event, value: event }))
          : List(),
    },
  ];

const columns = [
  { value: 'createdAt', title: 'Created' },
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
  { value: 'updatedAt', title: 'Updated' },
  { value: 'updatedBy', title: 'Updated By' },
  { value: 'url', title: 'URL' },
  { value: 'webhookId', title: 'Webhook ID' },
];

export const WebhookJobTable = generateTable({
  tableOptions: ['scope', 'kappSlug', 'status'],
  columns,
  filters,
  filterDataSources,
  dataSource,
  sortable: false,
});

WebhookJobTable.displayName = 'WebhookJobTable';
