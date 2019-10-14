import { generateTable } from '../../table/Table';
import { fetchUsage } from '../../../apis';

const dataSource = ({ definitionId, usageType }) => ({
  fn: fetchUsage,
  clientSideSearch: true,
  params: () => [{ definitionId, usageType }],
  transform: result => ({
    data: result.usages,
  }),
});

const columns = [
  {
    value: 'type',
    title: 'Type',
    filter: 'equals',
    type: 'text',
    sortable: true,
  },
  {
    value: 'source',
    title: 'Source',
    filter: 'startsWith',
    type: 'text',
    sortable: true,
  },
  {
    value: 'group',
    title: 'Group',
    filter: 'startsWith',
    type: 'text',
    sortable: true,
  },
  {
    value: 'name',
    title: 'Tree',
    filter: 'startsWith',
    type: 'text',
    sortable: true,
  },
  {
    value: 'nodeCount',
    title: 'Usage',
    filter: 'startsWith',
    type: 'text',
    sortable: true,
  },
  {
    value: 'updatedAt',
    title: 'Updated',
    filter: 'equals',
    type: 'text',
    sortable: true,
  },
];

export const UsageTable = generateTable({
  tableOptions: ['definitionId', 'usageType'],
  columns,
  dataSource,
});

UsageTable.displayName = 'UsageTable';
