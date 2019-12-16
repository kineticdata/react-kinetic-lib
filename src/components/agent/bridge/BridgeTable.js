import { generateTable } from '../../table/Table';
import { fetchBridges } from '../../../apis';

const dataSource = ({ agentSlug }) => ({
  fn: fetchBridges,
  clientSideSearch: true,
  params: () => [
    {
      agentSlug,
      include: 'details',
    },
  ],
  transform: result => ({
    data: result.bridges,
  }),
});

const columns = [
  {
    value: 'slug',
    title: 'Slug',
    filter: 'includes',
    type: 'text',
    sortable: true,
  },
  {
    value: 'adapterClass',
    title: 'Adapter Class',
    filter: 'includes',
    type: 'text',
    sortable: true,
  },
];

export const BridgeTable = generateTable({
  tableOptions: ['agentSlug'],
  columns,
  dataSource,
});

BridgeTable.displayName = 'BridgeTable';
