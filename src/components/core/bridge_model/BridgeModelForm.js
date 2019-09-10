import React from 'react';
import { Form } from '../../form/Form';
import {
  fetchBridgeModel,
  createBridgeModel,
  updateBridgeModel,
} from '../../../apis';

const dataSources = ({ modelName }) => ({
  model: {
    fn: fetchBridgeModel,
    params: modelName && [{ modelName, include: 'details' }],
    transform: result => result.bridgeModel,
  },
});

const handleSubmit = ({ modelName }) => values =>
  (modelName ? updateBridgeModel : createBridgeModel)({
    modelName,
    bridgeModel: values.toJS(),
  }).then(({ bridgeModel, error }) => {
    if (error) {
      throw (error.statusCode === 400 && error.message) ||
        'There was an error saving the model';
    }
    return bridgeModel;
  });

const fields = ({ modelName }) => ({ model }) =>
  (!modelName || model) && [
    {
      name: 'name',
      label: 'Bridge Model Name',
      type: 'text',
      required: true,
      initialValue: model ? model.get('name') : '',
    },
    {
      name: 'status',
      label: 'Status',
      type: 'radio',
      initialValue: model ? model.get('status') : 'Active',
      options: [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' },
      ],
    },
  ];

export const BridgeModelForm = ({
  addFields,
  alterFields,
  fieldSet,
  formKey,
  components,
  onSave,
  onError,
  children,
  modelName,
  noFormTag,
}) => (
  <Form
    noFormTag={noFormTag}
    formKey={formKey}
    addFields={addFields}
    alterFields={alterFields}
    fieldSet={fieldSet}
    components={components}
    onSubmit={handleSubmit}
    onSave={onSave}
    onError={onError}
    dataSources={dataSources}
    fields={fields}
    formOptions={{ modelName }}
  >
    {children}
  </Form>
);
