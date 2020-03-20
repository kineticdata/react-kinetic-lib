import { fetchTaskRuns } from '../../../apis/task';
import { generateTable } from '../../table/Table';
import { get, getIn } from 'immutable';

const dataSource = ({
  sourceName,
  sourceGroup,
  treeName,
  treeType,
  sourceId,
  id,
}) => ({
  fn: fetchTaskRuns,
  params: paramData => [
    {
      source: sourceName
        ? sourceName
        : paramData.filters.getIn(['sourceName', 'value']),
      includeSystemRuns: paramData.filters.getIn([
        'includeSystemRuns',
        'value',
      ]),
      groupFragment: sourceGroup
        ? sourceGroup
        : paramData.filters.getIn(['sourceGroup', 'value']),
      treeFragment: treeName
        ? treeName
        : paramData.filters.getIn(['tree', 'value']),
      treeType: treeType
        ? treeType
        : paramData.filters.getIn(['type', 'value']),
      sourceId: sourceId
        ? sourceId
        : paramData.filters.getIn(['sourceId', 'value']),
      id: id ? id : paramData.filters.getIn(['id', 'value']),
      include: 'details',
      limit: paramData.pageSize,
      offset: paramData.nextPageToken,
      orderBy:
        paramData.sortColumn === 'sourceName'
          ? 'tree.sourceRoot.name'
          : paramData.sortColumn === 'sourceGroup'
          ? 'tree.sourceGroup'
          : paramData.sortColumn === 'tree'
          ? 'tree.name'
          : paramData.sortColumn === 'type'
          ? 'tree.type'
          : paramData.sortColumn,
      direction: paramData.sortColumn ? paramData.sortDirection : undefined,
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
    title: 'Id',
    filter: 'equals',
    type: 'text',
    sortable: true,
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
    sortable: true,
  },
  {
    value: 'includeSystemRuns',
    title: 'Include System Runs',
    filter: 'equals',
    type: 'boolean',
  },
  {
    value: 'sourceId',
    title: 'Source Id',
    filter: 'equals',
    type: 'text',
    sortable: false,
  },
  {
    value: 'tree',
    title: 'Tree',
    filter: 'equals',
    type: 'text',
    sortable: true,
    valueTransform: value => get(value, 'name', ''),
  },
  {
    value: 'sourceGroup',
    title: 'Group',
    sortable: true,
    filter: 'equals',
    type: 'text',
    valueTransform: (_value, row) => row.getIn(['tree', 'sourceGroup']),
  },
  {
    value: 'type',
    title: 'Type',
    filter: 'equals',
    type: 'text',
    sortable: true,
    valueTransform: (_value, row) => row.getIn(['tree', 'type']),
  },
  {
    value: 'status',
    title: 'Status',
    sortable: false,
  },
  { value: 'createdAt', title: 'Created', sortable: true },
  { value: 'createdBy', title: 'Created By', sortable: false },
  { value: 'updatedAt', title: 'Updated', sortable: true },
  { value: 'updatedBy', title: 'Updated By', sortable: false },
];

export const RunTable = generateTable({
  tableOptions: ['sourceName', 'sourceGroup', 'treeName'],
  columns,
  dataSource,
});
