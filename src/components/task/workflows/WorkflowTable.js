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
      orderBy:
        paramData.sortColumn === 'sourceName'
          ? 'sourceRoot.name'
          : paramData.sortColumn,
      direction: paramData.sortColumn ? paramData.sortDirection : undefined,
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
    sortable: false,
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
    sortable: false,
  },
  {
    value: 'definitionId',
    title: 'Definition ID',
    sortable: true,
  },
  {
    value: 'ownerEmail',
    title: 'Owner EMail',
    sortable: false,
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
  { value: 'title', title: 'Title', sortable: false },
  { value: 'type', title: 'type', sortable: false },
  { value: 'createdAt', title: 'Created At', sortable: false },
  { value: 'createdBy', title: 'Created By', sortable: false },
  { value: 'updatedAt', title: 'Updated At', sortable: true },
  { value: 'updatedBy', title: 'Updated By', sortable: false },
];

export const WorkflowTable = generateTable({
  tableOptions: ['workflowType', 'sourceName', 'sourceGroup'],
  columns,
  dataSource,
});

WorkflowTable.displayName = 'WorkflowTable';
