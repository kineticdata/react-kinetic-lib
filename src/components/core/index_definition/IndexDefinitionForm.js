import React from 'react';
import { fetchForm, updateForm } from '../../../apis';
import { Form } from '../../form/Form';

const staticParts = [
  'createdAt',
  'createdBy',
  'handle',
  'submittedAt',
  'submittedBy',
  'updatedAt',
  'updatedBy',
];

const getFields = form => form.get('fields');

const getIndexDefinition = (form, indexName) =>
  form
    .get('indexDefinitions')
    .find(indexDefinition => indexDefinition.get('name') === indexName);

const dataSources = ({ formSlug, indexName }) => ({
  form: {
    fn: fetchForm,
    params: [
      {
        datastore: true,
        kappSlug: null,
        formSlug,
        include: 'fields,indexDefinitions',
      },
    ],
    transform: result => result.form,
  },
  fields: {
    fn: getFields,
    params: ({ form }) => form && [form],
  },
  indexDefinition: {
    fn: getIndexDefinition,
    params: ({ form }) => form && indexName && [form, indexName],
  },
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

const fields = ({ formSlug, indexName }) => ({ indexDefinition }) =>
  (!indexName || indexDefinition) && [
    {
      name: 'parts',
      label: 'Parts',
      type: 'select-multi',
      required: true,
      options: ({ fields }) =>
        fields
          ? fields
              .map(field => `values[${field.get('name')}]`)
              .sort()
              .concat(staticParts)
              .map(name => ({ label: name, value: name }))
              .toArray()
          : [],
      initialValue: indexDefinition ? indexDefinition.get('parts') : [],
    },
    {
      name: 'unique',
      label: 'Unique',
      type: 'checkbox',
      initialValue: indexDefinition ? indexDefinition.get('unique') : false,
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
  formSlug,
  indexName,
}) => (
  <Form
    addFields={addFields}
    alterFields={alterFields}
    fieldSet={fieldSet}
    formKey={formKey}
    components={components}
    onSubmit={handleSubmit}
    onSave={onSave}
    onError={onError}
    dataSources={dataSources}
    fields={fields}
    formOptions={{ formSlug, indexName }}
  >
    {children}
  </Form>
);
