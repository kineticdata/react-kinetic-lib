import React from 'react';
import {
  fetchHandler,
  fetchTaskCategories,
  updateHandler,
} from '../../../apis';
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

const handleSubmit = ({ definitionId }) => values => {
  updateHandler({ definitionId, handler: values.toJS() }).then(
    ({ handler, error }) => {
      if (error) {
        throw (error.statusCode === 400 && error.message) ||
          'There was an error saving the handler';
      } else {
        return handler;
      }
    },
  );
};

const fields = ({ definitionId }) => ({ handler, categories }) => {
  if (!(definitionId && handler && categories)) {
    return false;
  }

  const properties = handler
    .get('properties')
    .map(property => ({
      name: `property_${property.get('name')}`,
      label: property.get('name'),
      type: property.get('type') === 'Encrypted' ? 'password' : 'text',
      required: property.get('required'),
      transient: true,
      initialValue:
        property.get('type') === 'Encrypted'
          ? ''
          : property.get('value') === null
          ? ''
          : property.get('value'),
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
        transient: true,
        enabled: false,
        initialValue: get(handler, 'definitionId', ''),
      },

      {
        name: 'definitionName',
        label: 'Definition Name',
        type: 'text',
        transient: true,
        enabled: false,
        initialValue: get(handler, 'definitionName', ''),
      },

      {
        name: 'definitionVersion',
        label: 'Definition Version',
        type: 'text',
        transient: true,
        enabled: false,
        initialValue: get(handler, 'definitionVersion', ''),
      },
      {
        name: 'name',
        label: 'Name',
        type: 'text',
        transient: true,
        enabled: false,
        initialValue: get(handler, 'name', ''),
      },
      {
        name: 'description',
        label: 'Description',
        type: 'text',
        transient: true,
        enabled: false,
        initialValue: get(handler, 'description', ''),
      },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        required: true,
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
          get(handler, 'properties', List([]))
            .filter(p =>
              p.get('type') === 'Encrypted'
                ? values.get(`property_${p.get('name')}`)
                : true,
            )
            .reduce(
              (properties, p) => ({
                ...properties,
                [p.get('name')]: values.get(`property_${p.get('name')}`),
              }),
              {},
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
