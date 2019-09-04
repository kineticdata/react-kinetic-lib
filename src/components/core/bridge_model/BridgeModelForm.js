import React from 'react';
import { get } from 'immutable';
import { Form } from '../../form/Form';
import {
  fetchBridgeModel,
  createBridgeModel,
  updateBridgeModel,
} from '../../../apis';

const dataSources = ({ modelName }) => ({
  model: [
    fetchBridgeModel,
    [{ modelName, include: 'details,attributes,qualifications' }],
    { transform: result => result.bridgeModel, runIf: () => !!modelName },
  ],
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

const fields = ({ modelName }) => [
  {
    name: 'name',
    label: 'Bridge Model Name',
    type: 'text',
    required: true,
    initialValue: ({ model }) => get(model, 'name'),
  },
  {
    name: 'status',
    label: 'Status',
    type: 'text',
    initialValue: ({ model }) => get(model, 'status'),
  },
  {
    name: 'attributes',
    label: 'Attributes',
    type: 'text',
    initialValue: ({ model }) => get(model, 'attributes'),
  },
  {
    name: 'qualifications',
    label: 'Qualifications',
    type: 'text',
    initialValue: ({ model }) => get(model, 'qualifications'),
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
  ...formOptions
}) => (
  <Form
    formKey={formKey}
    addFields={addFields}
    alterFields={alterFields}
    fieldSet={fieldSet}
    components={components}
    onSubmit={handleSubmit(formOptions)}
    onSave={onSave}
    onError={onError}
    dataSources={dataSources(formOptions)}
    fields={fields(formOptions)}
  >
    {children}
  </Form>
);
