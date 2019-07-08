import React from 'react';
import { fetchForm, updateForm } from '../../../apis/core';
import { Form } from '../form/Form';

const dataSources = ({ formSlug, indexName }) => ({
  form: [
    fetchForm,
    [
      {
        datastore: true,
        kappSlug: null,
        formSlug,
        include: 'fields,indexDefinitions',
      },
    ],
    {
      transform: result => result.form,
    },
  ],
  fields: [
    fields => fields,
    [({ form }) => form.fields],
    { dependsOn: ['form'] },
  ],
  indexDefinition: [
    indexDefinitions =>
      indexDefinitions.find(
        indexDefinition => indexDefinition.name === indexName,
      ),
    [({ form }) => form.indexDefinitions],
    { runIf: () => !!indexName, dependsOn: ['form'] },
  ],
});

const handleSubmit = ({ formSlug, indexName }) => values =>
  console.log('handleSubmit...', formSlug, indexName, values.toJS()) ||
  updateForm({
    datastore: true,
    kappSlug: null,
    formSlug,
    form: {},
  }).then(({ form, error }) => {
    if (error) {
      throw (error.statusCode === 400 && error.message) ||
        'There was an error saving the index definition';
    }
    return form;
  });

const fields = (formSlug, indexName) => [
  {
    name: 'parts',
    label: 'Parts',
    type: 'select-multi',
    required: true,
    options: [],
  },
  {
    name: 'unique',
    label: 'Unique',
    type: 'checkbox',
  },
];

export const IndexDefinitionForm = ({
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
