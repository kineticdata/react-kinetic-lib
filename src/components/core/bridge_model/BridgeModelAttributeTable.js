import { generateTable } from '../../table/Table';
import { fetchBridgeModelAttributes } from '../../../apis';

const dataSource = ({ modelName }) => ({
  fn: fetchBridgeModelAttributes,
  clientSideSearch: true,
  params: () => [
    {
      modelName,
    },
  ],
  transform: result => ({
    data: result.bridgeModelAttributes,
    nextPageToken: result.nextPageToken,
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
];

export const BridgeModelAttributeTable = generateTable({
  columns,
  dataSource,
  tableOptions: ['modelName'],
});

BridgeModelAttributeTable.displayName = 'BridgeModelAttributeTable';
