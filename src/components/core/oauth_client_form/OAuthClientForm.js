import React from 'react';
import { Form } from '../form/Form';
import {
  fetchOAuthClient,
  createOAuthClient,
  updateOAuthClient,
} from '../../../apis/core';
import { get, List, Map } from 'immutable';

const dataSources = ({ clientId }) => ({
  client: [
    fetchOAuthClient,
    [{ clientId }],
    {
      transform: result => result.client,
      runIf: () => !!clientId,
    },
  ],
});

const handleSubmit = ({ clientId }) => values =>
  new Promise((resolve, reject) => {
    const client = values.toJS();
    (clientId
      ? updateOAuthClient({ clientId, client })
      : createOAuthClient({ client })
    ).then(({ client, error }) => {
      if (client) {
        resolve(client);
      } else {
        reject(error);
      }
    });
  });

const getOrBlank = (from, what) => bindings =>
  bindings[from] ? bindings[from].get(what) : '';

const fields = ({ clientId }) => [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    required: true,
    initialValue: getOrBlank('client', 'name'),
  },
  {
    name: 'description',
    label: 'Description',
    type: 'text',
    required: false,
    initialValue: getOrBlank('client', 'description'),
  },
  {
    name: 'clientId',
    label: 'Client ID',
    type: 'text',
    required: true,
    initialValue: getOrBlank('client', 'clientId'),
  },
  {
    name: 'clientSecret',
    label: 'Client Secret',
    type: 'text',
    required: !clientId,
    initialValue: getOrBlank('client', 'clientSecret'),
    transient: ({ values }) => !values.get('clientSecret'),
  },
  {
    name: 'redirectUri',
    label: 'Redirect URI',
    type: 'text',
    required: true,
    initialValue: getOrBlank('client', 'redirectUri'),
  },
];

export const OAuthClientForm = ({
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
