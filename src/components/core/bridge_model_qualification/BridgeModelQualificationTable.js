import { generateTable } from '../../table/Table';
import {
  fetchBridgeModel,
  fetchBridgeModelQualificationMappings,
} from '../../../apis';

const mergeQualificationsAndMappings = (
  qualifications,
  qualificationMappings,
) => ({
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
  fn: ({ modelName }) =>
    fetchBridgeModel({ modelName, include: 'qualifications' }).then(
      ({
        bridgeModel: { activeMappingName: mappingName, qualifications },
        error: error1,
      }) =>
        error1 ||
        fetchBridgeModelQualificationMappings({ modelName, mappingName }).then(
          ({ bridgeModelQualificationMappings, error: error2 }) =>
            error2 ||
            mergeQualificationsAndMappings(
              qualifications,
              bridgeModelQualificationMappings,
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
