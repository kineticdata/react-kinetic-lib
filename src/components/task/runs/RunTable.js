import { fetchTaskRuns } from '../../../apis/task';
import { generateTable } from '../../table/Table';
import { get, getIn } from 'immutable';

const dataSource = ({
  sourceName,
  sourceGroup,
  tree,
  treeType,
  sourceId,
  runId,
}) => ({
  fn: fetchTaskRuns,
  params: paramData => [
    {
      source: sourceName
        ? sourceName
        : paramData.filters.getIn(['sourceName', 'value']),
      group: sourceGroup
        ? sourceGroup
        : paramData.filters.getIn(['sourceGroup', 'value']),
      tree: tree ? tree : paramData.filters.getIn(['tree', 'value']),
      treeType: treeType
        ? treeType
        : paramData.filters.getIn(['type', 'value']),
      sourceId: sourceId
        ? sourceId
        : paramData.filters.getIn(['sourceId', 'value']),
      runId: runId ? runId : paramData.filters.getIn(['id', 'value']),
      include: 'details',
      limit: paramData.pageSize,
      offset: paramData.nextPageToken,
      orderBy: 'createdAt',
      direction: 'desc',
    },
  ],
  transform: result => ({
    data: result.runs,
    nextPageToken: result.nextPageToken,
  }),
});

const columns = [
  {
    value: 'id',
    title: 'ID',
    filter: 'equals',
    type: 'text',
    sortable: false,
  },
  {
    value: 'originatingId',
    title: 'Originating ID',
    sortable: false,
  },
  {
    value: 'sourceName',
    valueTransform: (_value, row) => getIn(row, ['source', 'name'], ''),
    title: 'Source',
    type: 'text',
    filter: 'equals',
    sortable: false,
  },
  {
    value: 'sourceId',
    title: 'Sources ID',
    filter: 'equals',
    type: 'text',
    sortable: false,
  },
  {
    value: 'tree',
    title: 'Tree',
    filter: 'equals',
    type: 'text',
    sortable: false,
    valueTransform: value => get(value, 'name', ''),
  },
  {
    value: 'sourceGroup',
    title: 'Group',
    sortable: false,
    filter: 'equals',
    type: 'text',
    valueTransform: (_value, row) => row.getIn(['tree', 'sourceGroup']),
  },
  {
    value: 'type',
    title: 'Type',
    filter: 'equals',
    type: 'text',
    sortable: false,
    valueTransform: (_value, row) => row.getIn(['tree', 'type']),
  },
  {
    value: 'status',
    title: 'Status',
    sortable: false,
  },
  { value: 'createdAt', title: 'Created', sortable: false },
  { value: 'createdBy', title: 'Created By', sortable: false },
  { value: 'updatedAt', title: 'Updated', sortable: true },
  { value: 'updatedBy', title: 'Updated By', sortable: false },
];

export const RunTable = generateTable({
  tableOptions: [],
  columns,
  dataSource,
});
