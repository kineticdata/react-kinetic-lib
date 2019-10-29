import { generateTable } from '../../table/Table';
import { fetchHandlers } from '../../../apis';

const dataSource = () => ({
  fn: fetchHandlers,
  params: () => [{ include: 'details' }],
  transform: result => ({ data: result.handlers }),
  clientSideSearch: true,
});

const columns = [
  {
    title: 'ID',
    value: 'id',
    filter: 'equals',
    type: 'text',
  },
  {
    title: 'Name',
    value: 'name',
    filter: 'startsWith',
    type: 'text',
  },
  {
    title: 'Status',
    value: 'status',
    filter: 'equals',
    type: 'text',
  },
  {
    title: 'Definition ID',
    value: 'definitionId',
    filter: 'equals',
    type: 'text',
  },
  {
    title: 'Definition Name',
    value: 'definitionName',
    filter: 'startsWith',
    type: 'text',
  },
  {
    title: 'Definition Version',
    value: 'definitionVersion',
    filter: 'equals',
    type: 'text',
  },
  {
    title: 'Description',
    value: 'description',
    filter: 'equals',
    type: 'text',
  },
  {
    title: 'Created',
    value: 'createdAt',
    filter: 'equals',
    type: 'text',
  },
  {
    title: 'Created By',
    value: 'createdBy',
    filter: 'startsWith',
    type: 'text',
  },
  {
    title: 'Updated',
    value: 'updatedAt',
    filter: 'equals',
    type: 'text',
  },
  {
    title: 'Updated By',
    value: 'updatedBy',
    filter: 'startsWith',
    type: 'text',
  },
];

export const HandlerTable = generateTable({
  columns,
  dataSource,
});

HandlerTable.displayName = 'HandlerTable';
