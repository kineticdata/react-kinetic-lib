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
    params: [{ modelName, include: 'details,attributes,qualifications' }],
    transform: result => result.bridgeModel,
  },
});

const handleSubmit = ({ modelName }) => values =>
  (modelName ? updateBridgeModel : createBridgeModel)({
    modelName,
    bridgeModel: values.toJS(),
  }).then(({ model, error }) => {
    if (error) {
      throw (error.statusCode === 400 && error.message) ||
        'There was an error saving the model';
    }
    return model;
  });

const fields = ({ modelName }) => ({ model }) =>
  (!modelName || model) && [
    {
      name: 'name',
      label: 'Bridge Model Name',
      type: 'text',
      required: true,
      initialValue: model.get('name'),
    },
    {
      name: 'status',
      label: 'Status',
      type: 'text',
      initialValue: model.get('status'),
    },
    {
      name: 'attributes',
      label: 'Attributes',
      type: 'text',
      initialValue: model.get('attributes'),
    },
    {
      name: 'qualifications',
      label: 'Qualifications',
      type: 'text',
      initialValue: model.get('qualifications'),
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
}) => (
  <Form
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
