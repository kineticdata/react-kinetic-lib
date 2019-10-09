import React from 'react';
import { fetchHandler, fetchTaskCategories } from '../../../apis';
import { Form } from '../../form/Form';
import { get, Map, List } from 'immutable';

const dataSources = ({ definitionId }) => ({
  handler: {
    fn: fetchHandler,
    params: definitionId && [
      {
        definitionId,
        include: 'details,categories,parameters,results,properties',
      },
    ],
    transform: result => result.handler,
  },
  categories: {
    fn: fetchTaskCategories,
    params: [],
    transform: result => result.categories,
  },
});

const handleSubmit = () => values => {
  console.log('submitting values: ', values.toJS());
  return Promise.resolve();
};

const fields = ({ definitionId }) => ({ handler, categories }) => {
  if (!(definitionId && handler && categories)) {
    return false;
  }

  const properties = handler
    .get('properties')
    .map(property => ({
      name: property.get('name'),
      label: property.get('name'),
      type: property.get('type') === 'Encrypted' ? 'password' : 'text',
      required: property.get('required'),
      transient: true,
      initialValue: property.get('value'),
    }))
    .toArray();

  return (
    definitionId &&
    handler &&
    categories &&
    [
      {
        name: 'definitionId',
        label: 'Definition ID',
        type: 'text',
        required: true,
        initialValue: get(handler, 'definitionId', ''),
      },

      {
        name: 'definitionName',
        label: 'Definition Name',
        type: 'text',
        required: true,
        initialValue: get(handler, 'definitionName', ''),
      },

      {
        name: 'definitionVersion',
        label: 'Definition Version',
        type: 'text',
        required: true,
        initialValue: get(handler, 'definitionVersion', ''),
      },
      {
        name: 'name',
        label: 'Name',
        type: 'text',
        required: true,
        initialValue: get(handler, 'name', ''),
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: true,
        initialValue: get(handler, 'description', ''),
      },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        required: false,
        options: [
          { label: 'Active', value: 'Active' },
          { label: 'Paused', value: 'Paused' },
        ],
        initialValue: get(handler, 'status', ''),
      },
      {
        name: 'categories',
        label: 'Categories',
        type: 'select-multi',
        required: false,
        initialValue: get(handler, 'categories', List()).map(c =>
          c.get('name'),
        ),
        options: categories.map(c =>
          Map({ label: c.get('name'), value: c.get('name') }),
        ),
        serialize: ({ values }) =>
          values
            .get('categories')
            .map(vc => categories.find(c => c.get('name') === vc)),
      },
      {
        name: 'properties',
        visible: false,
        initialValue: get(handler, 'properties', []),
        serialize: ({ values }) =>
          get(handler, 'properties', List([])).map(p =>
            p.set('value', values.get(p.get('name'))),
          ),
      },
    ].concat(properties)
  );
};

export const HandlerForm = ({
  addFields,
  alterFields,
  fieldSet,
  formKey,
  components,
  onSave,
  onError,
  children,
  definitionId,
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
    formOptions={{ definitionId }}
  >
    {children}
  </Form>
);
