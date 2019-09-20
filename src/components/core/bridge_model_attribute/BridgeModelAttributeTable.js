import { generateTable } from '../../table/Table';
import {
  fetchBridgeModel,
  fetchBridgeModelAttributeMappings,
} from '../../../apis';

const mergeAttributesAndMappings = (attributes, attributesMappings) => ({
  data: attributes.map(attributes => {
    const mapping = attributesMappings.find(
      ({ name }) => name === attributes.name,
    );
    return {
      ...attributes,
      structureField: mapping ? mapping.structureField || '' : null,
    };
  }),
});

const dataSource = ({ modelName }) => ({
  fn: ({ modelName }) =>
    fetchBridgeModel({ modelName, include: 'attributes' }).then(
      ({
        bridgeModel: { activeMappingName: mappingName, attributes },
        error: error1,
      }) =>
        error1
          ? { error: error1 }
          : fetchBridgeModelAttributeMappings({ modelName, mappingName }).then(
              ({ bridgeModelAttributeMappings, error: error2 }) =>
                error2
                  ? { error: error2 }
                  : mergeAttributesAndMappings(
                      attributes,
                      bridgeModelAttributeMappings,
                    ),
            ),
    ),
  clientSideSearch: true,
  params: () => [{ modelName }],
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
