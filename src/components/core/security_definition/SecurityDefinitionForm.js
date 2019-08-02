import React from 'react';
import { Form } from '../../form/Form';
import {
  fetchSecurityPolicyDefinition,
  createSecurityPolicyDefinition,
  updateSecurityPolicyDefinition,
  fetchSpace,
  fetchKapp,
} from '../../../apis';
import { buildBindings } from '../../../helpers';

const SPACE_SECURITY_DEFINITION_TYPES = [
  'Space',
  'Datastore Form',
  'Datastore Submission',
  'Team',
  'User',
];

const KAPP_SECURITY_DEFINITION_TYPES = ['Kapp', 'Form', 'Submission'];

const dataSources = ({ securityPolicyName, kappSlug }) => ({
  space: [
    fetchSpace,
    [
      {
        include:
          'datastoreFormAttributeDefinitions,spaceAttributeDefinitions,teamAttributeDefinitions,userAttributeDefinitions,userProfileAttributeDefinitions',
      },
    ],
    { transform: result => result.space },
  ],
  kapp: [
    fetchKapp,
    [
      {
        kappSlug,
        include: 'formAttributeDefinitions,kappAttributeDefinitions',
      },
    ],
    { transform: result => result.kapp, runIf: () => !!kappSlug },
  ],
  securityPolicy: [
    fetchSecurityPolicyDefinition,
    [{ securityPolicyName, kappSlug }],
    {
      transform: result => result.securityPolicyDefinition,
      runIf: () => !!securityPolicyName,
    },
  ],
});

const handleSubmit = ({ securityPolicyName, kappSlug }) => values =>
  (securityPolicyName
    ? updateSecurityPolicyDefinition
    : createSecurityPolicyDefinition)({
    securityPolicyName,
    securityPolicyDefinition: values.toJS(),
    kappSlug,
  }).then(({ securityPolicyDefinition, error }) => {
    if (error) {
      throw (error.statusCode === 400 && error.message) ||
        'There was an error saving the security definition';
    }
    return securityPolicyDefinition;
  });

const fields = ({ kappSlug }) => [
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
    label: 'Type',
    type: 'select',
    required: true,
    options: (kappSlug
      ? KAPP_SECURITY_DEFINITION_TYPES
      : SPACE_SECURITY_DEFINITION_TYPES
    ).map(ele => ({
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
    type: 'code',
    required: true,
    initialValue: ({ securityPolicy }) =>
      securityPolicy ? securityPolicy.get('rule') : '',
    options: ({ space, kapp, values }) =>
      buildBindings({ space, kapp, scope: values.get('type') }),
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
