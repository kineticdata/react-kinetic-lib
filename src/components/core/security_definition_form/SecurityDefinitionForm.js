import React from 'react';
import { Form } from '../form/Form';
import { fetchSpace } from '../../../apis/core';
import {
  fetchSecurityPolicyDefinition,
  createSecurityPolicyDefinition,
  updateSecurityPolicyDefinition,
} from '../../../apis/core';
import { get, List, Map } from 'immutable';

const SECURITY_DEFINITION_TYPES = [
  'Space',
  'Datastore Form',
  'Datastore Submission',
  'Team',
  'User',
];

const dataSources = ({ securityPolicyName }) => ({
  securityPolicy: [
    fetchSecurityPolicyDefinition,
    [{ securityPolicyName }],
    {
      transform: result => result.securityPolicyDefinition,
      runIf: () => !!securityPolicyName,
    },
  ],
  // Fetching space to trigger a rerender.  This is a bug work around.
  space: [
    fetchSpace,
    [{ include: 'details' }],
    { transform: result => result.space },
  ],
});

const handleSubmit = ({ securityPolicyName }) => values =>
  new Promise((resolve, reject) => {
    const securityPolicyDefinition = values.toJS();
    (securityPolicyName
      ? updateSecurityPolicyDefinition({
          securityPolicyName,
          securityPolicyDefinition,
        })
      : createSecurityPolicyDefinition({ securityPolicyDefinition })
    ).then(({ securityPolicyDefinition, error }) => {
      if (securityPolicyDefinition) {
        resolve(securityPolicyDefinition);
      } else {
        reject(error);
      }
    });
  });

const fields = () => [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    required: true,
    initialValue: ({ securityPolicy }) =>
      securityPolicy ? securityPolicy.get('name') : '',
  },
  {
    name: 'type',
    type: 'select',
    label: 'Type',
    options: SECURITY_DEFINITION_TYPES.map(ele => ({
      value: ele,
      label: ele,
    })),
    initialValue: ({ securityPolicy }) =>
      securityPolicy ? securityPolicy.get('type') : 'Space',
  },
  {
    name: 'message',
    label: 'Message',
    type: 'text',
    required: true,
    initialValue: ({ securityPolicy }) =>
      securityPolicy ? securityPolicy.get('message') : '',
  },
  {
    name: 'rule',
    label: 'Rule',
    type: 'text',
    required: true,
    initialValue: ({ securityPolicy }) =>
      securityPolicy ? securityPolicy.get('rule') : '',
  },
];

export const SecurityDefinitionForm = ({
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
