import { generateTable } from '../../table/Table';
import { fetchBridgeModels } from '../../../apis';

const dataSource = () => ({
  fn: fetchBridgeModels,
  clientSideSearch: true,
  params: () => [
    {
      include: 'details',
    },
  ],
  transform: result => ({
    data: result.bridgeModels,
    nextPageToken: result.nextPageToken,
  }),
});

const columns = [
  {
    value: 'name',
    title: 'Model Name',
    filter: 'includes',
    type: 'text',
    sortable: true,
  },
  {
    value: 'status',
    title: 'Status',
    filter: 'startsWith',
    type: 'text',
    sortable: true,
  },
];

export const BridgeModelTable = generateTable({
  columns,
  dataSource,
});

BridgeModelTable.displayName = 'BridgeModelTable';
