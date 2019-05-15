import React from 'react';
import { Form } from '../form/Form';

const slugify = text =>
  text
    .trim()
    // Convert uppercase to lowercase
    .toLowerCase()
    // Replace spaces with -
    .replace(/\s+/g, '-')
    // Remove all non-word chars
    .replace(/[^A-Za-z0-9\u0080-\u00FF\-]+/g, '');

const dataSources = ({ formSlug }) => ({});

const handleSubmit = ({ formSlug }) => values => {
  console.log('formSlug', formSlug, 'values', values);
};

const fields = ({ formSlug }) => [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    required: true,
    onChange: ({ values }, { setValue }) => {
      if (values.get('linked')) {
        setValue('slug', slugify(values.get('name')), false);
      }
    },
  },
  {
    name: 'slug',
    label: 'Slug',
    type: 'text',
    required: true,
    onChange: ({}, { setValue }) => {
      setValue('linked', false);
    },
  },
  {
    name: 'linked',
    label: 'Linked',
    type: 'checkbox',
    transient: true,
    initialValue: true,
  },
];

export const FormForm = ({
  formKey,
  components,
  onSave,
  onError,
  children,
  formSlug,
}) => (
  <Form
    formKey={formKey}
    components={components}
    onSubmit={handleSubmit({ formSlug })}
    onSave={onSave}
    onError={onError}
    dataSources={dataSources({ formSlug })}
    fields={fields({ formSlug })}
  >
    {children}
  </Form>
);
