import React from 'react';
import {
  createCategory,
  fetchAttributeDefinitions,
  fetchCategory,
  updateCategory,
} from '../../../apis/core';
import { Form } from '../form/Form';
import { slugify } from '../../../helpers';

const dataSources = ({ kappSlug, categorySlug }) => ({
  category: [
    fetchCategory,
    [{ kappSlug, categorySlug, include: 'attributesMap' }],
    {
      transform: result => result.category,
      runIf: () => !!categorySlug,
    },
  ],
  attributeDefinitions: [
    fetchAttributeDefinitions,
    [{ kappSlug, attributeType: 'categoryAttributeDefinitions' }],
    { transform: result => result.attributeDefinitions },
  ],
});

const handleSubmit = ({ kappSlug, categorySlug }) => values =>
  (categorySlug ? updateCategory : createCategory)({
    category: values.toJS(),
    kappSlug,
    categorySlug,
  }).then(({ category, error }) => {
    if (error) {
      throw (error.statusCode === 400 && error.message) ||
        'There was an error saving the category';
    }
    return category;
  });

const fields = ({ kappSlug, categorySlug }) => [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    required: true,
    initialValue: ({ category }) => (category ? category.get('name') : ''),
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
    required: false,
    initialValue: ({ category }) => (category ? category.get('slug') : ''),
    onChange: (_bindings, { setValue }) => {
      setValue('linked', false);
    },
  },
  {
    name: 'linked',
    label: 'Linked',
    type: 'checkbox',
    transient: true,
    initialValue: ({ category }) => !category,
    visible: false,
  },
  {
    name: 'attributesMap',
    label: 'Attributes',
    type: 'attributes',
    required: false,
    options: ({ attributeDefinitions }) => attributeDefinitions,
    initialValue: ({ category }) =>
      category ? category.get('attributesMap') : null,
  },
];

export const CategoryForm = ({
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

export default CategoryForm;
