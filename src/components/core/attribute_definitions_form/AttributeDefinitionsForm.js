import React from 'react';
import { Form } from '../form/Form';
import {
  createAttributeDefinition,
  updateAttributeDefinition,
  fetchAttributeDefinition,
} from '../../../apis/core';

const dataSources = ({ attributeType, attributeName }) => ({
  attributeDefinition: [
    fetchAttributeDefinition,
    [{ attributeType, attributeName, include: 'details' }],
    {
      transform: result => result.attributeDefinition,
      runIf: () => !!attributeName,
    },
  ],
});

const handleSubmit = ({ attributeType, attributeName }) => values =>
  new Promise((resolve, reject) => {
    const options = { attributeDefinition: values.toJS(), attributeType };
    (attributeName
      ? updateAttributeDefinition({ ...options, attributeName })
      : createAttributeDefinition(options)
    ).then(({ attributeDefinition, error }) =>
      attributeDefinition
        ? resolve(attributeDefinition)
        : reject(
            error.message ||
              'There was an error saving the attribute definition',
          ),
    );
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
      attributeDefinition ? attributeDefinition.get('allowsMultiple') : false,
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
