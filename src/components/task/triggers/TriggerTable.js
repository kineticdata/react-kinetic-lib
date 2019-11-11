import { fetchTaskTriggers } from '../../../apis/task';
import { generateTable } from '../../table/Table';
import { get, getIn } from 'immutable';

const dataSource = ({
  runId,
  sourceName,
  sourceGroup,
  tree,
  treeType,
  triggerStatus,
  sourceId,
  status,
}) => ({
  fn: fetchTaskTriggers,
  params: paramData => [
    {
      runId,
      triggerStatus,
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
      status: status ? status : paramData.filters.getIn(['status', 'value']),
      include: 'details,tree',
      limit: paramData.pageSize,
      offset: paramData.nextPageToken,
      orderBy: paramData.sortColumn,
      direction: paramData.sortDirection,
    },
  ],
  transform: result => ({
    data: result.triggers,
    nextPageToken: result.nextPageToken,
  }),
});

const columns = [
  {
    value: 'action',
    title: 'Action',
    type: 'text',
    sortable: false,
  },
  {
    value: 'branchId',
    title: 'Branch Id',
    type: 'text',
    sortable: false,
  },
  {
    value: 'type',
    title: 'Type',
    type: 'text',
    sortable: false,
  },
  {
    value: 'engineIdentification',
    title: 'Engine Identification',
    type: 'text',
    sortable: false,
  },
  {
    value: 'flags',
    title: 'Flags',
    type: 'text',
    sortable: false,
  },
  {
    value: 'loopIndex',
    title: 'Loop Index',
    type: 'text',
    sortable: false,
  },
  {
    value: 'managementAction',
    title: 'Loop Index',
    type: 'text',
    filter: 'equals',
    sortable: false,
  },
  {
    value: 'message',
    title: 'Message',
    type: 'text',
    sortable: false,
  },
  {
    value: 'mode',
    title: 'Mode',
    type: 'text',
    sortable: false,
  },
  {
    value: 'nodeId',
    title: 'Node Id',
    type: 'text',
    sortable: false,
  },
  {
    value: 'nodeName',
    title: 'Node Name',
    type: 'text',
    sortable: false,
  },
  {
    value: 'originator',
    title: 'Originator',
    type: 'text',
    sortable: false,
  },
  {
    value: 'results',
    title: 'Results',
    type: 'text',
    sortable: false,
  },
  {
    value: 'scheduledAt',
    title: 'Scheduled At',
    type: 'text',
    sortable: true,
  },
  {
    value: 'selectionCriterion',
    title: 'Selection Criterion',
    type: 'text',
    sortable: false,
  },
  {
    value: 'status',
    title: 'Status',
    sortable: false,
    filter: 'equals',
  },
  {
    value: 'token',
    title: 'Token',
    sortable: false,
  },
  {
    value: 'sourceName',
    valueTransform: (_value, row) => getIn(row, ['tree', 'sourceName'], ''),
    title: 'Source',
    type: 'text',
    filter: 'equals',
    sortable: false,
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
    value: 'tree',
    title: 'Tree',
    filter: 'equals',
    type: 'text',
    sortable: false,
    valueTransform: value => get(value, 'name', ''),
  },
  {
    value: 'treeType',
    title: 'Tree Type',
    filter: 'equals',
    type: 'text',
    sortable: false,
    valueTransform: (_value, row) => row.getIn(['tree', 'type']),
  },
  { value: 'createdAt', title: 'Created', sortable: true },
  { value: 'createdBy', title: 'Created By', sortable: false },
  {
    value: 'id',
    title: 'ID',
    filter: 'equals',
    type: 'text',
    sortable: false,
  },
  { value: 'updatedAt', title: 'Updated', sortable: true },
  { value: 'updatedBy', title: 'Updated By', sortable: false },
];

export const TriggerTable = generateTable({
  tableOptions: ['runId', 'triggerStatus'],
  columns,
  dataSource,
});
