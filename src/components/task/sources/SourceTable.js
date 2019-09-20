import { generateTable } from '../../table/Table';
import { fetchSources } from '../../../apis';

const dataSource = () => ({
  fn: fetchSources,
  params: () => [{ include: 'details' }],
  transform: result => ({ data: result.sources }),
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
    title: 'Type',
    value: 'type',
    filter: 'startsWith',
    type: 'text',
  },
  {
    title: 'Created At',
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
    title: 'Updated At',
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

export const SourceTable = generateTable({
  columns,
  dataSource,
});

SourceTable.displayName = 'SourceTable';
