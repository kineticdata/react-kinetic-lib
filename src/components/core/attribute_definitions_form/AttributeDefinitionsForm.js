import React from 'react';
import { Form } from '../form/Form';
import {
  createAttributeDefinition,
  updateAttributeDefinition,
  fetchAttributeDefinition,
  fetchAttributeDefinitions,
} from '../../../apis/core';
import { get, List, Map } from 'immutable';

const dataSources = ({ attributeType, attributeName }) => ({
  attributeDefinition: [
    fetchAttributeDefinition,
    [{ attributeType, attributeName, include: 'details' }],
    {
      transform: result => result.attributeDefinition,
      runIf: () => !!attributeType,
    },
  ],
  attributeDefinitions: [
    fetchAttributeDefinitions,
    [{ attributeType, include: 'details' }],
    { transform: result => result.attributeDefinitions },
  ],
});

const handleSubmit = ({ attributeType }) => values =>
  new Promise((resolve, reject) => {
    const attributeDefinition = values.toJS();
    (attributeType
      ? updateAttributeDefinition({ attributeType, attributeDefinition })
      : createAttributeDefinition({ attributeDefinition })
    ).then(({ attributeDefinition, error }) => {
      if (attributeDefinition) {
        resolve(attributeDefinition);
      } else {
        reject(error);
      }
    });
  });

const fields = () => [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    required: true,
    transient: true,
    initialValue: ({ attributeDefinition }) =>
      attributeDefinition ? attributeDefinition.get('description') : '',
  },
  {
    name: 'description',
    label: 'Description',
    type: 'text',
    required: false,
    initialValue: ({ attributeDefinition }) =>
      attributeDefinition ? attributeDefinition.get('description') : '',
  },
];

export const AttributeDefinitionForm = ({
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
    addFields={addFields}
    alterFields={alterFields}
    fieldSet={fieldSet}
    formKey={formKey}
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
