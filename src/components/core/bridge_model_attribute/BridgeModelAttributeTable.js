import { generateTable } from '../../table/Table';
import { fetchBridgeModel } from '../../../apis';

// Handles bridge model api response by checking for error and also returning
// error if active mapping is not present. If valid returns object with the
// attributes and their mappings.
const handleBridgeModel = ({
  bridgeModel: { error, attributes, activeMappingName, mappings },
}) => {
  if (error) {
    return { error };
  }
  const mapping = mappings.find(({ name }) => name === activeMappingName);
  if (!mapping) {
    return { error: 'Invalid bridge model, active mapping not found' };
  }
  return { attributes, attributeMappings: mapping.attributes };
};

const transform = ({ attributes, attributeMappings }) => ({
  data: attributes.map(attribute => {
    const mapping = attributeMappings.find(
      ({ name }) => name === attribute.name,
    );
    return {
      ...attribute,
      structureField: mapping ? mapping.structureField || '' : null,
    };
  }),
});

const dataSource = ({ modelName }) => ({
  fn: () => fetchBridgeModel({ modelName }).then(handleBridgeModel),
  clientSideSearch: true,
  params: () => [{ modelName }],
  transform,
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
