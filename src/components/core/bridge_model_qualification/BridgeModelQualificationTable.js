import { generateTable } from '../../table/Table';
import { fetchBridgeModel } from '../../../apis';

// Handles bridge model api response by checking for error and also returning
// error if active mapping is not present. If valid returns object with the
// attributes and their mappings.
const handleBridgeModel = ({
  bridgeModel: { error, qualifications, activeMappingName, mappings },
}) => {
  if (error) {
    return { error };
  }
  const mapping = mappings.find(({ name }) => name === activeMappingName);
  if (!mapping) {
    return { error: 'Invalid bridge model, active mapping not found' };
  }
  return { qualifications, qualificationMappings: mapping.qualifications };
};

const transform = ({ qualifications, qualificationMappings }) => ({
  data: qualifications.map(qualification => {
    const mapping = qualificationMappings.find(
      ({ name }) => name === qualification.name,
    );
    return {
      ...qualification,
      query: mapping ? mapping.query || '' : null,
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
    value: 'resultType',
    title: 'Result Type',
    filter: 'equals',
    type: 'text',
  },
  {
    value: 'query',
    title: 'Query',
    type: 'text',
  },
];

export const BridgeModelQualificationTable = generateTable({
  columns,
  dataSource,
  tableOptions: ['modelName'],
});

BridgeModelQualificationTable.displayName = 'BridgeModelQualificationTable';
