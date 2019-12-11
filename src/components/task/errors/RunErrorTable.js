import { fetchTaskRunErrors } from '../../../apis/task';
import { generateTable } from '../../table/Table';
import { getIn } from 'immutable';

const dataSource = ({
  runId,
  sourceName,
  sourceGroup,
  sourceId,
  tree,
  status,
  id,
}) => ({
  fn: fetchTaskRunErrors,
  params: paramData => [
    {
      runId,
      source: sourceName
        ? sourceName
        : paramData.filters.getIn(['sourceName', 'value']),
      group: sourceGroup
        ? sourceGroup
        : paramData.filters.getIn(['sourceGroup', 'value']),
      tree: tree ? tree : paramData.filters.getIn(['treeName', 'value']),
      sourceId: sourceId
        ? sourceId
        : paramData.filters.getIn(['sourceId', 'value']),
      id: id ? id : paramData.filters.getIn(['id', 'value']),
      status: status ? status : paramData.filters.getIn(['status', 'value']),
      nodeId: paramData.filters.getIn(['nodeId', 'value']),
      handlerId: paramData.filters.getIn(['handlerId', 'value']),
      type: paramData.filters.getIn(['type', 'value']),
      relatedItem1Id: paramData.filters.getIn(['relatedItem1Id', 'value']),
      relatedItem1Type: paramData.filters.getIn(['relatedItem1Type', 'value']),
      relatedItem2Id: paramData.filters.getIn(['relatedItem2Id', 'value']),
      relatedItem2Type: paramData.filters.getIn(['relatedItem2Type', 'value']),
      include: 'details,run,messages',
      limit: paramData.pageSize,
      offset: paramData.nextPageToken,
      timeline: paramData.sortColumn,
      direction: paramData.sortColumn ? paramData.sortDirection : undefined,
    },
  ],
  transform: result => ({
    data: result.runErrors,
    nextPageToken: result.nextPageToken,
  }),
});

const columns = [
  {
    value: 'createdAt',
    title: 'Created At',
    type: 'text',
    sortable: true,
  },
  {
    value: 'createdBy',
    title: 'Created By',
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
    value: 'id',
    title: 'Error Id',
    type: 'text',
    filter: 'equals',
    sortable: false,
  },
  {
    value: 'relatedItem1Id',
    title: 'Related Item 1 ID',
    type: 'text',
    sortable: false,
  },
  {
    value: 'relatedItem1Type',
    title: 'Related Item 1 Type',
    type: 'text',
    sortable: false,
  },
  {
    value: 'relatedItem2Id',
    title: 'Related Item 2 ID',
    type: 'text',
    sortable: false,
  },
  {
    value: 'relatedItem2Type',
    title: 'Related Item 2 Type',
    type: 'text',
    sortable: false,
  },
  {
    value: 'status',
    title: 'Status',
    filter: 'equals',
    type: 'text',
    sortable: false,
    initial: 'Active',
  },
  {
    value: 'sourceName',
    title: 'Source',
    filter: 'equals',
    type: 'text',
    sortable: false,
    valueTransform: (_value, row) =>
      getIn(row, ['run', 'tree', 'sourceName'], ''),
  },
  {
    value: 'sourceGroup',
    title: 'Group',
    filter: 'equals',
    type: 'text',
    sortable: false,
    valueTransform: (_value, row) =>
      getIn(row, ['run', 'tree', 'sourceGroup'], ''),
  },
  {
    value: 'treeName',
    title: 'Name',
    filter: 'equals',
    type: 'text',
    sortable: false,
    valueTransform: (_value, row) => getIn(row, ['run', 'tree', 'name'], ''),
  },
  {
    value: 'Summary',
    title: 'Summary',
    type: 'text',
    sortable: false,
  },
  {
    value: 'text',
    title: 'Text',
    type: 'text',
    sortable: false,
  },
  {
    value: 'type',
    title: 'Type',
    filter: 'equals',
    type: 'text',
    // options: [{ label: 'a', value: 'a' }],
    sortable: false,
  },
  {
    value: 'updatedAt',
    title: 'Updated At',
    type: 'text',
    sortable: true,
  },
  {
    value: 'updatedBy',
    title: 'Updated By',
    type: 'text',
    sortable: false,
  },
];

export const RunErrorTable = generateTable({
  tableOptions: ['runId'],
  columns,
  dataSource,
});
