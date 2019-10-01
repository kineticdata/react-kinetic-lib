import React from 'react';
import { get, getIn, List, Map } from 'immutable';
import { Form } from '../../form/Form';
import {
  fetchBridge,
  createBridge,
  updateBridge,
  fetchBridgeAdapters,
} from '../../../apis';
import { slugify } from '../../../helpers';

const dataSources = ({ bridgeSlug }) => ({
  bridge: {
    fn: fetchBridge,
    params: bridgeSlug && [{ bridgeSlug, include: 'details' }],
    transform: result => result.bridge,
  },
  adapters: {
    fn: fetchBridgeAdapters,
    params: [{ include: 'details' }],
    transform: result => result.adapters,
  },
});

const handleSubmit = ({ bridgeSlug }) => values =>
  (bridgeSlug ? updateBridge : createBridge)({
    bridgeSlug,
    bridge: values.toJS(),
  }).then(({ bridge, error }) => {
    if (error) {
      throw (error.statusCode === 400 && error.message) ||
        'There was an error saving the model';
    }
    return bridge;
  });

const BRIDGE_FIELDS = ['name', 'slug', 'adapterClass', 'properties', 'linker'];

const fields = ({ bridgeSlug }) => ({ bridge, adapters }) => {
  let properties = [];
  if (adapters && bridge) {
    const adapter = adapters.find(
      a => a.get('class') === bridge.get('adapterClass'),
    );

    const adapterProperties = adapter
      ? List(adapter.get('properties'))
      : List();

    properties = !adapterProperties.isEmpty()
      ? adapterProperties
          .map(property => ({
            name: property.get('name'),
            label: property.get('name'),
            type: property.get('sensitive') ? 'password' : 'text',
            required: property.get('required'),
            transient: true,
            initialValue: getIn(bridge, ['properties', property.name], ''),
          }))
          .toArray()
      : [];
  }

  if (adapters && (!bridgeSlug || (bridgeSlug && bridge))) {
    const fields =
      adapters &&
      (!bridgeSlug || (bridgeSlug && bridge)) &&
      [
        {
          name: 'name',
          label: 'Name',
          type: 'text',
          required: true,
          initialValue: get(bridge, 'name', ''),
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
          initialValue: get(bridge, 'slug', ''),
          onChange: (_bindings, { setValue }) => {
            setValue('linked', false);
          },
        },
        {
          name: 'linked',
          label: 'Linked',
          type: 'checkbox',
          transient: true,
          initialValue: bridge ? false : true,
          visible: false,
        },
        {
          name: 'adapterClass',
          label: 'Adapter Class',
          type: bridgeSlug ? 'text' : 'select',
          enabled: !bridgeSlug,
          required: !!bridgeSlug,
          initialValue: get(bridge, 'adapterClass', ''),
          options: adapters.map(adapter =>
            Map({
              value: adapter.get('class'),
              label: adapter.get('name'),
            }),
          ),
        },
        {
          name: 'properties',
          visible: false,
          initialValue: get(bridge, 'properties', {}),
          serialize: ({ values }) => {
            console.log(
              values
                .filter((v, k) => BRIDGE_FIELDS.includes(k) || k === 'linker')
                .toJS(),
            );
            return values;
          },
        },
      ].concat(properties);

    console.log('final fields', fields);
    return fields;
  } else {
    return false;
  }
};

export const BridgeForm = ({
  addFields,
  alterFields,
  fieldSet,
  formKey,
  components,
  onSave,
  onError,
  children,
  bridgeSlug,
}) => (
  <Form
    formKey={formKey}
    addFields={addFields}
    alterFields={alterFields}
    fieldSet={fieldSet}
    components={components}
    onSubmit={handleSubmit}
    onSave={onSave}
    onError={onError}
    dataSources={dataSources}
    fields={fields}
    formOptions={{ bridgeSlug }}
  >
    {children}
  </Form>
);
