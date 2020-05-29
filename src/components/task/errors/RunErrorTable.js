import { fetchTaskRunErrors } from '../../../apis/task';
import { generateTable } from '../../table/Table';
import { getIn } from 'immutable';
import { defineFilter } from '../../../helpers';

const ERROR_TYPES = [
  'Connector Error',
  'Handler Error',
  'Invalid Trigger Error',
  'Missing Handler Error',
  'Missing Routine Error',
  'Node Message Error',
  'Node Parameter Error',
  'Source Error',
  'Tree Error',
  'Unidentified Error',
  'Unknown Variable Error',
];

const clientSide = defineFilter()
  .between('createdAt', 'createdAtMin', 'createdAtMax')
  .equals('id', 'id')
  .equals('type', 'type')
  .equals('status', 'status')
  .end();

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
  clientSide,
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
      include: 'details,run,messages,messages.details',
      limit: paramData.pageSize,
      offset: paramData.nextPageToken,
      timeline: paramData.sortColumn,
      direction: paramData.sortColumn
        ? paramData.sortDirection.toUpperCase()
        : undefined,
    },
  ],
  transform: result => ({
    data: result.runErrors,
    nextPageToken: result.nextPageToken,
  }),
});

const filters = () => () => [
  {
    name: 'id',
    label: 'Error Id',
    type: 'text',
    serialize: ({ values }) => values.get('id') && parseInt(values.get('id')),
  },
  {
    name: 'type',
    label: 'Type',
    type: 'select',
    options: ERROR_TYPES.map(s => ({ label: s, value: s })),
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    initialValue: 'Active',
    options: ['Active', 'Handled'].map(s => ({ label: s, value: s })),
  },
  {
    name: 'createdAtMin',
    label: 'Start',
    type: 'date',
  },
  {
    name: 'createdAtMax',
    label: 'End',
    type: 'date',
  },
];

const columns = [
  {
    value: 'createdAt',
    title: 'Created At',
    sortable: true,
  },
  {
    value: 'createdBy',
    title: 'Created By',
    sortable: false,
  },
  {
    value: 'engineIdentification',
    title: 'Engine Identification',
    sortable: false,
  },
  {
    value: 'id',
    title: 'Error Id',
    sortable: false,
  },
  {
    value: 'relatedItem1Id',
    title: 'Related Item 1 ID',
    sortable: false,
  },
  {
    value: 'relatedItem1Type',
    title: 'Related Item 1 Type',
    sortable: false,
  },
  {
    value: 'relatedItem2Id',
    title: 'Related Item 2 ID',
    sortable: false,
  },
  {
    value: 'relatedItem2Type',
    title: 'Related Item 2 Type',
    sortable: false,
  },
  {
    value: 'status',
    title: 'Status',
    sortable: false,
  },
  {
    value: 'sourceName',
    title: 'Source',
    sortable: false,
    valueTransform: (_value, row) =>
      getIn(row, ['run', 'tree', 'sourceName'], ''),
  },
  {
    value: 'sourceGroup',
    title: 'Group',
    sortable: false,
    valueTransform: (_value, row) =>
      getIn(row, ['run', 'tree', 'sourceGroup'], ''),
  },
  {
    value: 'treeName',
    title: 'Name',
    sortable: false,
    valueTransform: (_value, row) => getIn(row, ['run', 'tree', 'name'], ''),
  },
  {
    value: 'Summary',
    title: 'Summary',
    sortable: false,
  },
  {
    value: 'text',
    title: 'Text',
    sortable: false,
  },
  {
    value: 'type',
    title: 'Type',
    sortable: false,
  },
  {
    value: 'updatedAt',
    title: 'Updated At',
    sortable: true,
  },
  {
    value: 'updatedBy',
    title: 'Updated By',
    sortable: false,
  },
];

export const RunErrorTable = generateTable({
  tableOptions: ['runId'],
  columns,
  filters,
  dataSource,
});
