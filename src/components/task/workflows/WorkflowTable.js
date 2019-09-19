import { generateTable } from '../../table/Table';
import { fetchTrees } from '../../../apis';

const STATUS_OPTIONS = ['Active', 'Inactive', 'Paused'].map(v => ({
  label: v,
  value: v,
}));

const filtersToParams = filters => ({
  name: filters.getIn(['name', 'value']),
  ownerEmail: filters.getIn(['ownerEmail', 'value']),
  status: filters.getIn(['status', 'value']),
});

const dataSource = ({ workflowType, sourceName, sourceGroup }) => ({
  fn: fetchTrees,
  params: paramData => [
    {
      ...filtersToParams(paramData.filters),
      source: sourceName
        ? sourceName
        : paramData.filters.getIn(['sourceName', 'value']),
      group: sourceGroup
        ? sourceGroup
        : paramData.filters.getIn(['sourceGroup', 'value']),
      type: workflowType || 'Tree',
      include: 'details',
      limit: paramData.pageSize,
      offset: paramData.nextPageToken,
    },
  ],
  transform: result => ({
    data: result.trees,
    nextPageToken: result.nextPageToken,
  }),
});

const columns = [
  {
    value: 'id',
    title: 'ID',
  },
  {
    value: 'name',
    title: 'Name',
    filter: 'equals',
    type: 'text',
    sortable: true,
  },
  {
    value: 'notes',
    title: 'Notes',
  },
  {
    value: 'definitionId',
    title: 'Definition ID',
  },
  {
    value: 'ownerEmail',
    title: 'Owner EMail',
  },
  {
    value: 'sourceGroup',
    title: 'Source Group',
    filter: 'startsWith',
    type: 'text',
    sortable: true,
  },
  {
    value: 'sourceName',
    title: 'Source Name',
    filter: 'equals',
    type: 'text',
    sortable: true,
  },
  {
    value: 'status',
    title: 'Status',
    filter: 'equals',
    type: 'text',
    sortable: true,
    options: () => STATUS_OPTIONS,
  },
  { value: 'title', title: 'Title' },
  { value: 'type', title: 'type' },
  { value: 'createdAt', title: 'Created At' },
  { value: 'createdBy', title: 'Created By' },
  { value: 'updatedAt', title: 'Updated At' },
  { value: 'updatedBy', title: 'Updated By' },
];

export const WorkflowTable = generateTable({
  tableOptions: ['workflowType', 'sourceName', 'sourceGroup'],
  columns,
  dataSource,
});

WorkflowTable.displayName = 'WorkflowTable';
