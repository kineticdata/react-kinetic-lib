import React from 'react';
import { get } from 'immutable';

import { Form } from '../form/Form';
import { updateSpace, fetchSpace } from '../../../apis/core';
import { fetchLocales, fetchTimezones } from '../../../apis/core/meta';
import { fetchAttributeDefinitions } from '../../../apis/core/attributeDefinitions';
import { fetchSecurityPolicyDefinitions } from '../../../apis/core/securityPolicyDefinitions';
import { slugify } from '../../../helpers';

const DISPLAY_TYPES = ['Display Page', 'Redirect', 'Single Page App'];

const dataSources = () => ({
  space: [
    fetchSpace,
    [{ include: 'attributesMap,securityPolicies,details' }],
    { transform: result => result.space },
  ],
  locales: [
    fetchLocales,
    [],
    { shared: true, cache: true, transform: result => result.data.locales },
  ],
  timezones: [
    fetchTimezones,
    [],
    { shared: true, cache: true, transform: result => result.data.timezones },
  ],
  attributeDefinitions: [
    fetchAttributeDefinitions,
    [{ attributeType: 'spaceAttributeDefinitions' }],
    {
      transform: result => result.attributeDefinitions,
    },
  ],
  securityPolicyDefinitions: [
    fetchSecurityPolicyDefinitions,
    [],
    {
      transform: result => result.securityPolicyDefinitions,
    },
  ],
});

const handleSubmit = () => values => {
  const space = values.toJS();
  return updateSpace({
    space,
  });
};

const securityEndpoints = {
  discussionCreation: {
    endpoint: 'Discussion Creation',
    label: 'Discussion Creation',
    types: ['Space'],
  },
  spaceDisplay: {
    endpoint: 'Display',
    label: 'Space Display',
    types: ['Space'],
  },
  teamsAccess: {
    endpoint: 'Teams Access',
    label: 'Teams Access',
    types: ['Space', 'Team'],
  },
  teamsCreation: {
    endpoint: 'Team Creation',
    label: 'Team Creation',
    types: ['Space', 'Team'],
  },
  teamMembershipModification: {
    endpoint: 'Team Membership Modification',
    label: 'Team Membership Modification',
    types: ['Space', 'Team'],
  },
  teamModification: {
    endpoint: 'Team Modification',
    label: 'Team Modification',
    types: ['Space', 'Team'],
  },
  userAccess: {
    endpoint: 'Users Access',
    label: 'User Access',
    types: ['Space', 'User'],
  },
  userCreation: {
    endpoint: 'User Creation',
    label: 'User Creation',
    types: ['Space', 'User'],
  },
  userModification: {
    endpoint: 'User Modification',
    label: 'User Modification',
    types: ['Space', 'User'],
  },
};

const fields = () => [
  {
    name: 'afterLogoutPath',
    label: 'After Logout Path',
    type: 'text',
    initialValue: ({ space }) => get(space, 'afterLogoutPath'),
    visible: ({ space }) => get(space, 'displayType') !== 'Single Page App',
  },
  {
    name: 'bundlePath',
    label: 'Bundle Path',
    type: 'text',
    initialValue: ({ space }) => get(space, 'bundlePath'),
    // visible: ({ space }) => get(space, 'displayType') !== 'Single Page App',
  },
  {
    name: 'defaultDatastoreFormConfirmationPage',
    label: 'Default Datastore Form Confirmation Page',
    type: 'text',
    initialValue: ({ space }) =>
      get(space, 'defaultDatastoreFormConfirmationPage'),
    visible: ({ space }) => get(space, 'displayType') !== 'Single Page App',
  },
  {
    name: 'defaultDatastoreFormDisplayPage',
    label: 'Default Datastore Form Display Page',
    type: 'text',
    initialValue: ({ space }) => get(space, 'defaultDatastoreFormDisplayPage'),
    visible: ({ space }) => get(space, 'displayType') !== 'Single Page App',
  },
  {
    name: 'defaultLocale',
    label: 'Default Locale',
    type: 'select',
    options: ({ locales }) =>
      locales.map(locale => ({
        value: locale.get('code'),
        label: locale.get('name'),
      })),
    initialValue: ({ space }) => get(space, 'defaultLocale'),
  },
  {
    name: 'defaultTimezone',
    label: 'Default Timezone',
    type: 'select',
    options: ({ timezones }) =>
      timezones.map(timezone => ({
        value: timezone.get('id'),
        label: timezone.get('name'),
      })),
    initialValue: ({ space }) => get(space, 'defaultTimezone'),
  },
  {
    name: 'displayType',
    label: 'Display Type',
    type: 'select',
    options: DISPLAY_TYPES.map(displayType => ({
      value: displayType,
      label: displayType,
    })),
    initialValue: ({ space }) => get(space, 'displayType') || 'Display Page',
  },
  {
    name: 'displayValue',
    label: ({ values }) =>
      values.get('displayType') === 'Redirect'
        ? 'Redirect URL'
        : values.get('displayType') === 'Single Page App'
        ? 'Location (see modes below)'
        : 'Space Display Page',
    type: 'text',
    initialValue: ({ space }) => get(space, 'displayValue'),
  },
  {
    name: 'loginPage',
    label: 'Login Page',
    type: 'text',
    initialValue: ({ space }) => get(space, 'loginPage'),
    visible: ({ space }) => get(space, 'displayType') !== 'Single Page App',
  },
  {
    name: 'name',
    label: 'Space Name',
    type: 'text',
    required: true,
    initialValue: ({ space }) => get(space, 'name'),
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
    initialValue: ({ space }) => get(space, 'resetPasswordPage'),
    visible: ({ space }) => get(space, 'displayType') !== 'Single Page App',
  },
  {
    name: 'oAuthSigningKey',
    label: 'oAuth Signing Key',
    type: 'password',
    initialValue: ({ space }) => get(space, 'oAuthSigningKey'),
  },
  {
    name: 'sessionInactiveLimitInSeconds',
    label: 'Inactive Session Limit (in seconds)',
    type: 'text',
    initialValue: ({ space }) => get(space, 'sessionInactiveLimitInSeconds'),
  },
  {
    name: 'sharedBundleBase',
    label: 'Shared Bundle Base',
    type: 'text',
    initialValue: ({ space }) => get(space, 'sharedBundleBase'),
  },
  {
    name: 'slug',
    label: 'Slug',
    type: 'text',
    required: true,
    initialValue: ({ space }) => get(space, 'slug'),
    onChange: (_bindings, { setValue }) => {
      setValue('linked', false);
    },
  },
  {
    name: 'linked',
    label: 'Linked',
    type: 'checkbox',
    transient: true,
    initialValue: true,
    visible: false,
  },
  {
    name: 'trustedFrameDomains',
    label: 'Trusted Frame Domains',
    type: 'text',
    initialValue: ({ space }) => get(space, 'trustedFrameDomains'),
  },
  {
    name: 'trustedResourceDomains',
    label: 'Trusted Resource Domains',
    type: 'text',
    initialValue: ({ space }) => get(space, 'trustedResourceDomains'),
  },
  ...Object.entries(securityEndpoints).map(([endpointFieldName, endpoint]) => ({
    name: endpointFieldName,
    label: endpoint.label,
    type: 'select',
    required: true,
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
    initialValue: ({ space }) =>
      space
        ? space
            .get('securityPolicies')
            .find(pol => pol.get('endpoint') === endpoint.endpoint)
            .get('name')
        : '',
    transient: true,
  })),
  {
    name: 'securityPolicies',
    label: 'Security Policies',
    type: null,
    visible: false,
    serialize: ({ values }) =>
      Object.entries(securityEndpoints).map(([endpointFieldName, policy]) => ({
        endpoint: policy.endpoint,
        name: values.get(endpointFieldName),
      })),
    initialValue: ({ space }) => get(space, 'securityPolicies'),
  },
  {
    name: 'attributesMap',
    label: 'Attributes',
    type: 'attributes',
    required: false,
    options: ({ attributeDefinitions }) => attributeDefinitions,
    initialValue: ({ space }) => get(space, 'attributesMap'),
  },
];

export const SpaceForm = ({
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
