import React from 'react';
import {
  fetchAdapters,
  fetchSystemFilestore,
  updateSystemFilestore,
} from '../../apis';
import { handleFormErrors } from '../../helpers';
import { generateForm } from '../index';
import { get, Map } from 'immutable';
import {
  adapterPropertiesFields,
  propertiesFromAdapters,
  propertiesFromValues,
} from './helpers';

const dataSources = () => ({
  filestoreAdapters: {
    fn: fetchAdapters,
    params: [{ slug: 'SYSTEM', type: 'filestore' }],
    transform: result => result.adapters,
  },
  filestore: {
    fn: fetchSystemFilestore,
    params: [],
    transform: result => result.filestore,
  },
  adapterProperties: {
    fn: propertiesFromAdapters,
    params: ({ filestoreAdapters }) => {
      return filestoreAdapters && [filestoreAdapters, 'class'];
    },
  },
});

const handleSubmit = () => values =>
  updateSystemFilestore({
    filestore: values.toJS(),
  }).then(handleFormErrors('filestore'));

const fields = () => ({ filestoreAdapters, filestore, adapterProperties }) => {
  if (filestore && filestoreAdapters && adapterProperties) {
    const properties = adapterPropertiesFields({
      adapterProperties,
      defaultAdapter: filestore,
      adapterType: 'adapterClass',
    });
    return (
      filestoreAdapters &&
      filestore && [
        {
          name: 'slug',
          label: 'Slug',
          type: 'text',
          enabled: false,
          initialValue: get(filestore, 'slug', ''),
        },
        {
          name: 'adapterClass',
          label: 'Filestore Adapter',
          type: 'select',
          required: true,
          options: filestoreAdapters.map(adapter =>
            Map({
              label: adapter.get('name'),
              value: adapter.get('class'),
            }),
          ),
          initialValue: get(filestore, 'adapterClass', ''),
        },
        {
          name: 'properties',
          label: 'Filestore Properties',
          type: null,
          required: false,
          visible: false,
          serialize: ({ values }) =>
            propertiesFromValues(values, 'adapterClass'),
        },
        ...properties,
      ]
    );
  }
};

export const SystemFilestoreForm = generateForm({
  formOptions: ['slug'],
  dataSources,
  fields,
  handleSubmit,
});
