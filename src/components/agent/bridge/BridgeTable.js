import { generateTable } from '../../table/Table';
import { fetchBridges } from '../../../apis';

const dataSource = () => ({
  fn: fetchBridges,
  clientSideSearch: true,
  params: () => [
    {
      include: 'details',
    },
  ],
  transform: result => ({
    data: result.bridges,
  }),
});

const columns = [
  {
    value: 'name',
    title: 'Name',
    filter: 'startsWith',
    type: 'text',
    sortable: true,
  },
  {
    value: 'slug',
    title: 'Slug',
    filter: 'startsWith',
    type: 'text',
    sortable: true,
  },
  {
    value: 'adapterClass',
    title: 'Adapter Class',
    filter: 'startsWith',
    type: 'text',
    sortable: true,
  },
];

export const BridgeTable = generateTable({
  columns,
  dataSource,
});

BridgeTable.displayName = 'BridgeTable';
