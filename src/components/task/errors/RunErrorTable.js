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
      orderBy: 'createdAt',
      direction: 'desc',
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
    sortable: false,
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
    title: 'ID',
    type: 'text',
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
    title: 'Tree',
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
    type: 'text',
    sortable: false,
  },
  {
    value: 'updatedAt',
    title: 'Updated At',
    type: 'text',
    sortable: false,
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
