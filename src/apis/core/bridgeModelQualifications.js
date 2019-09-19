import { apiGroup } from '../http';

export const {
  fetchBridgeModelQualifications,
  fetchBridgeModelQualification,
  createBridgeModelQualification,
  updateBridgeModelQualification,
  deleteBridgeModelQualification,
} = apiGroup({
  name: 'BridgeModelQualification',
  dataOption: 'bridgeModelQualification',
  plural: {
    requiredOptions: ['modelName'],
    url: ({ modelName }) => `/models/${modelName}/qualifications`,

    transform: response => ({
      bridgeModelQualifications: response.data.qualifications,
    }),
  },
  singular: {
    requiredOptions: ['modelName', 'qualificationName'],
    url: ({ modelName, qualificationName }) =>
      `/models/${modelName}/qualifications/${qualificationName}`,
    transform: response => ({
      bridgeModelQualification: response.data.qualification,
    }),
  },
});
