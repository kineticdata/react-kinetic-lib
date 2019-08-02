import React from 'react';
import { get } from 'immutable';
import { Form } from '../../form/Form';
import {
  fetchKapp,
  fetchSpace,
  fetchAttributeDefinitions,
  fetchSecurityPolicyDefinitions,
  createKapp,
  updateKapp,
} from '../../../apis';

import { buildBindings, slugify } from '../../../helpers';

const DISPLAY_TYPES = ['Display Page', 'Redirect'];

const dataSources = ({ kappSlug }) => ({
  space: [
    fetchSpace,
    [{ include: 'details,spaceAttributeDefinitions' }],
    { transform: result => result.space },
  ],
  kapp: [
    fetchKapp,
    [
      {
        kappSlug,
        include:
          'attributesMap,securityPolicies,details,fields.details,formAttributeDefinitions',
      },
    ],
    {
      transform: result => result.kapp,
      runIf: () => !!kappSlug,
    },
  ],
  attributeDefinitions: [
    fetchAttributeDefinitions,
    [{ kappSlug, attributeType: 'kappAttributeDefinitions' }],
    {
      transform: result => result.attributeDefinitions,
      runIf: () => !!kappSlug,
    },
  ],
  securityPolicyDefinitions: [
    fetchSecurityPolicyDefinitions,
    [{ kappSlug }],
    {
      transform: result => result.securityPolicyDefinitions,
      runIf: () => !!kappSlug,
    },
  ],
});

const handleSubmit = ({ kappSlug }) => values =>
  (kappSlug ? updateKapp : createKapp)({ kappSlug, kapp: values.toJS() }).then(
    ({ kapp, error }) => {
      if (error) {
        throw (error.statusCode === 400 && error.message) ||
          'There was an error saving the kapp';
      }
      return kapp;
    },
  );

const securityEndpoints = {
  kappDisplay: {
    endpoint: 'Display',
    label: 'Kapp Display',
    types: ['Kapp'],
  },
  formCreation: {
    endpoint: 'Form Creation',
    label: 'Form Creation',
    types: ['Kapp', 'Form'],
  },
  kappModification: {
    endpoint: 'Modification',
    label: 'Kapp Modification',
    types: ['Kapp'],
  },
  defaultFormDisplay: {
    endpoint: 'Default Form Display',
    label: 'Default Form Display',
    types: ['Kapp', 'Form'],
  },
  defaultFormModification: {
    endpoint: 'Default Form Modification',
    label: 'Default Form Modification',
    types: ['Kapp', 'Form'],
  },
  defaultSubmissionAccess: {
    endpoint: 'Default Submission Access',
    label: 'Default Submission Access',
    types: ['Kapp', 'Form', 'Submission'],
  },
  defaultSubmissionModification: {
    endpoint: 'Default Submission Modification',
    label: 'Default Submission Modification',
    types: ['Kapp', 'Form', 'Submission'],
  },
  submissionSupport: {
    endpoint: 'Submission Support',
    label: 'Submission Support',
    types: ['Kapp', 'Form', 'Submission'],
  },
};

const fields = ({ kappSlug }) => [
  {
    name: 'afterLogoutPath',
    label: 'After Logout Path',
    type: 'text',
    initialValue: ({ kapp }) => get(kapp, 'afterLogoutPath'),
    visible: ({ space }) => get(space, 'displayType') !== 'Single Page App',
  },
  {
    name: 'bundlePath',
    label: 'Bundle Path',
    type: 'text',
    initialValue: ({ kapp }) => get(kapp, 'bundlePath'),
    visible: ({ space }) => get(space, 'displayType') !== 'Single Page App',
  },
  {
    name: 'defaultFormConfirmationPage',
    label: 'Form Confirmation Page',
    type: 'text',
    initialValue: ({ kapp }) => get(kapp, 'defaultFormConfirmationPage'),
    visible: ({ space }) => get(space, 'displayType') !== 'Single Page App',
  },
  {
    name: 'defaultFormDisplayPage',
    label: 'Form Display Page',
    type: 'text',
    initialValue: ({ kapp }) => get(kapp, 'defaultFormDisplayPage'),
    visible: ({ space }) => get(space, 'displayType') !== 'Single Page App',
  },
  {
    name: 'defaultSubmissionLabelExpression',
    label: 'Submission Label',
    type: 'code-template',
    initialValue: ({ kapp }) => get(kapp, 'defaultSubmissionLabelExpression'),
    options: ({ space, kapp, attributeDefinitions }) =>
      buildBindings({
        space,
        kapp: kapp.set('kappAttributeDefinitions', attributeDefinitions),
        scope: 'Submission',
      }),
  },
  {
    name: 'displayType',
    label: 'Display Type',
    type: 'select',
    options: DISPLAY_TYPES.map(displayType => ({
      value: displayType,
      label: displayType,
    })),
    enabled: ({ space }) => get(space, 'displayType') !== 'Single Page App',
    initialValue: ({ kapp }) => get(kapp, 'displayType') || 'Display Page',
  },
  {
    name: 'displayValue',
    label: ({ values }) =>
      values.get('displayType') === 'Redirect'
        ? 'Redirect URL'
        : 'Kapp Display Page',
    type: 'text',
    initialValue: ({ kapp }) => get(kapp, 'displayValue'),
    required: ({ values }) => values.get('displayType') === 'Redirect',
    requiredMessage: "This field is required, when display type is 'Redirect'",
    visible: ({ space }) => get(space, 'displayType') !== 'Single Page App',
  },
  {
    name: 'loginPage',
    label: 'Login Page',
    type: 'text',
    initialValue: ({ kapp }) => get(kapp, 'loginPage'),
    visible: ({ space }) => get(space, 'displayType') !== 'Single Page App',
  },
  {
    name: 'name',
    label: 'Kapp Name',
    type: 'text',
    required: true,
    initialValue: ({ kapp }) => get(kapp, 'name'),
    onChange: ({ values }, { setValue }) => {
      if (values.get('linked')) {
        setValue('slug', slugify(values.get('name')), false);
      }
    },
  },
  {
    name: 'resetPasswordPage',
    label: 'Reset Password Page',
    type: 'text',
    initialValue: ({ kapp }) => get(kapp, 'resetPasswordPage'),
    visible: ({ space }) => get(space, 'displayType') !== 'Single Page App',
  },
  {
    name: 'slug',
    label: 'Slug',
    type: 'text',
    required: true,
    initialValue: ({ kapp }) => get(kapp, 'slug'),
    onChange: (_bindings, { setValue }) => {
      setValue('linked', false);
    },
  },
  {
    name: 'linked',
    label: 'Linked',
    type: 'checkbox',
    transient: true,
    initialValue: ({ kapp }) => (get(kapp, 'slug') ? false : true),
    visible: false,
  },
  ...(kappSlug
    ? Object.entries(securityEndpoints).map(
        ([endpointFieldName, endpoint]) => ({
          name: endpointFieldName,
          label: endpoint.label,
          type: 'select',
          options: ({ securityPolicyDefinitions }) =>
            securityPolicyDefinitions
              ? securityPolicyDefinitions
                  .filter(definition =>
                    endpoint.types.includes(definition.get('type')),
                  )
                  .map(definition => ({
                    value: definition.get('name'),
                    label: definition.get('name'),
                  }))
              : [],
          initialValue: ({ kapp }) =>
            kapp
              ? kapp
                  .get('securityPolicies')
                  .find(pol => pol.get('endpoint') === endpoint.endpoint)
                  .get('name')
              : '',
          transient: true,
        }),
      )
    : []),
  {
    name: 'securityPolicies',
    label: 'Security Policies',
    type: null,
    visible: false,
    serialize: ({ values }) =>
      Object.entries(securityEndpoints)
        .map(([endpointFieldName, policy]) => ({
          endpoint: policy.endpoint,
          name: values.get(endpointFieldName),
        }))
        .filter(endpoint => endpoint.name !== ''),
    initialValue: ({ kapp }) => get(kapp, 'securityPolicies'),
  },
  !!kappSlug && {
    name: 'attributesMap',
    label: 'Attributes',
    type: 'attributes',
    required: false,
    options: ({ attributeDefinitions }) => attributeDefinitions,
    initialValue: ({ kapp }) => get(kapp, 'attributesMap'),
  },
];

export const KappForm = ({
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
    formKey={formKey}
    addFields={addFields}
    alterFields={alterFields}
    fieldSet={fieldSet}
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
