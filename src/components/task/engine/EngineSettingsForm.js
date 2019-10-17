import React from 'react';
import { fetchEngineSettings, updateEngineSettings } from '../../../apis';
import { Form } from '../../form/Form';

const dataSources = () => {
  return {
    settings: {
      fn: fetchEngineSettings,
      params: [],
      transform: result => result.settings,
    },
  };
};

const handleSubmit = () => values =>
  new Promise((resolve, reject) => {
    const settings = values.toJS();
    updateEngineSettings({ settings }).then(({ message, error }) => {
      if (message) {
        resolve(message);
      } else {
        reject(error.message || 'There was an error saving the workflow');
      }
    });
  });

const fields = () => ({ settings }) =>
  settings && [
    {
      name: 'Sleep Delay',
      label: 'Sleep Delay',
      type: 'text',
      required: true,
      initialValue: settings.get('Sleep Delay'),
    },
    {
      name: 'Max Threads',
      label: 'Max Threads',
      type: 'text',
      required: false,
      initialValue: settings.get('Max Threads'),
    },
    {
      name: 'Trigger Query',
      label: 'Trigger Query',
      type: 'text',
      required: false,
      initialValue: settings.get('Trigger Query'),
    },
  ];

export const EngineSettingsForm = ({
  addFields,
  alterFields,
  fieldSet,
  formKey,
  components,
  onSave,
  onError,
  children,
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
    formOptions={{}}
  >
    {children}
  </Form>
);
