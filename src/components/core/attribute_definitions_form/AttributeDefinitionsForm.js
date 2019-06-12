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
      runIf: () => !!attributeName,
    },
  ],
  attributeDefinitions: [
    fetchAttributeDefinitions,
    [{ attributeType, include: 'details' }],
    { transform: result => result.attributeDefinitions },
  ],
});

const handleSubmit = ({ attributeType, attributeName }) => values =>
  new Promise((resolve, reject) => {
    const attributeDefinition = values.toJS();
    (attributeName
      ? updateAttributeDefinition({
          attributeType,
          attributeName,
          attributeDefinition,
        })
      : createAttributeDefinition({ attributeType, attributeDefinition })
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
    initialValue: ({ attributeDefinition }) =>
      attributeDefinition ? attributeDefinition.get('name') : '',
  },
  {
    name: 'description',
    label: 'Description',
    type: 'text',
    required: false,
    initialValue: ({ attributeDefinition }) =>
      attributeDefinition ? attributeDefinition.get('description') : '',
  },
  {
    name: 'allowsMultiple',
    label: 'Allow multiple attributes?',
    type: 'checkbox',
    required: false,
    initialValue: ({ attributeDefinition }) =>
      attributeDefinition ? attributeDefinition.get('allowsMultiple') : '',
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
