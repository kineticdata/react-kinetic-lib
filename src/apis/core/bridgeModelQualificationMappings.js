import { apiGroup } from '../http';

export const {
  fetchBridgeModelQualificationMappings,
  fetchBridgeModelQualificationMapping,
  createBridgeModelQualificationMapping,
  updateBridgeModelQualificationMapping,
  deleteBridgeModelQualificationMapping,
} = apiGroup({
  name: 'BridgeModelQualificationMapping',
  dataOption: 'bridgeModelQualificationMapping',
  plural: {
    requiredOptions: ['modelName', 'mappingName'],
    url: ({ modelName, mappingName }) =>
      `/models/${modelName}/mappings/${mappingName}/qualifications`,
    transform: response => ({
      bridgeModelQualificationMappings: response.data.qualifications,
    }),
  },
  singular: {
    requiredOptions: ['modelName', 'mappingName', 'qualificationName'],
    url: ({ modelName, mappingName, qualificationName }) =>
      `/models/${modelName}/mappings/${mappingName}/qualifications/${qualificationName}`,
    transform: response => ({
      bridgeModelQualificationMapping: response.data.qualification,
    }),
  },
});
