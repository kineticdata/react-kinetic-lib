import { generateTable } from '../../table/Table';
import {
  fetchBridgeModel,
  fetchBridgeModelAttributeMappings,
} from '../../../apis';

const dataSource = ({ modelName }) => ({
  fn: ({ modelName }) =>
    fetchBridgeModel({ modelName }).then(
      ({ bridgeModel: { activeMappingName: mappingName } }) =>
        fetchBridgeModelAttributeMappings({ modelName, mappingName }),
    ),
  clientSideSearch: true,
  params: () => [{ modelName }],
  transform: result => ({
    data: result.bridgeModelAttributeMappings,
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
  {
    value: 'structureField',
    title: 'Mapping',
    type: 'text',
  },
];

export const BridgeModelAttributeTable = generateTable({
  columns,
  dataSource,
  tableOptions: ['modelName'],
});

BridgeModelAttributeTable.displayName = 'BridgeModelAttributeTable';
