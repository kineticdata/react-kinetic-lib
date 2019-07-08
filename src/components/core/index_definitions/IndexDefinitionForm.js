import React from 'react';
import { fetchForm, updateForm } from '../../../apis/core';
import { Form } from '../form/Form';

const staticParts = [
  'createdAt',
  'createdBy',
  'handle',
  'submittedAt',
  'submittedBy',
  'updatedAt',
  'updatedBy',
];

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
    ({ form }) => [form.get('fields')],
    { dependencies: ['form'] },
  ],
  indexDefinition: [
    indexDefinition => indexDefinition,
    ({ form }) => [
      form
        .get('indexDefinitions')
        .find(indexDefinition => indexDefinition.get('name') === indexName),
    ],
    { runIf: () => !!indexName, dependencies: ['form'] },
  ],
});

const handleSubmit = ({ formSlug, indexName }) => (values, { form }) =>
  updateForm({
    datastore: true,
    kappSlug: null,
    formSlug,
    form: {
      indexDefinitions: indexName
        ? form
            .get('indexDefinitions')
            .map(indexDefinition =>
              indexDefinition.get('name') === indexName
                ? values
                : indexDefinition,
            )
            .toJS()
        : form
            .get('indexDefinitions')
            .push(values)
            .toJS(),
    },
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
    options: ({ fields }) =>
      fields
        .map(field => field.get('name'))
        .sort()
        .concat(staticParts)
        .map(name => ({ label: name, value: name })),
    initialValue: ({ indexDefinition }) =>
      indexDefinition ? indexDefinition.get('parts') : [],
  },
  {
    name: 'unique',
    label: 'Unique',
    type: 'checkbox',
    initialValue: ({ indexDefinition }) =>
      indexDefinition ? indexDefinition.get('unique') : false,
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
