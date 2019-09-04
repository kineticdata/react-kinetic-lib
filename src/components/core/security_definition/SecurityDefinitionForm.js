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

const SPACE_INCLUDES =
  'datastoreFormAttributeDefinitions,spaceAttributeDefinitions,teamAttributeDefinitions,userAttributeDefinitions,userProfileAttributeDefinitions';
const KAPP_INCLUDES =
  'formAttributeDefinitions,kappAttributeDefinitions,fields';

const dataSources = ({ securityPolicyName, kappSlug }) => ({
  space: {
    fn: fetchSpace,
    params: [{ include: SPACE_INCLUDES }],
    transform: result => result.space,
  },
  kapp: {
    fn: fetchKapp,
    params: kappSlug && [{ kappSlug, include: KAPP_INCLUDES }],
    transform: result => result.kapp,
  },
  securityPolicy: {
    fn: fetchSecurityPolicyDefinition,
    params: securityPolicyName && [{ securityPolicyName, kappSlug }],
    transform: result => result.securityPolicyDefinition,
  },
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

const fields = ({ securityPolicyName, kappSlug }) => ({ securityPolicy }) =>
  (!securityPolicyName || securityPolicy) && [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      initialValue: securityPolicy ? securityPolicy.get('name') : '',
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
      initialValue: securityPolicy
        ? securityPolicy.get('type')
        : kappSlug
        ? 'Kapp'
        : 'Space',
    },
    {
      name: 'message',
      label: 'Message',
      type: 'text',
      required: true,
      initialValue: securityPolicy ? securityPolicy.get('message') : '',
    },
    {
      name: 'rule',
      label: 'Rule',
      type: 'code',
      required: true,
      options: ({ space, kapp, values }) =>
        buildBindings({ space, kapp, scope: values.get('type') }),
      initialValue: securityPolicy ? securityPolicy.get('rule') : '',
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
  securityPolicyName,
  kappSlug,
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
    formOptions={{ kappSlug, securityPolicyName }}
  >
    {children}
  </Form>
);
