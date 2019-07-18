import React from 'react';
import { Form } from '../form/Form';
import {
  fetchAttributeDefinitions,
  fetchProfile,
  updateProfile,
} from '../../../apis/core';
import { fetchLocales, fetchTimezones } from '../../../apis/core/meta';
import { get, List, Map } from 'immutable';

const dataSources = () => ({
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
  profile: [
    fetchProfile,
    [{ include: 'details,attributesMap,memberships,profileAttributesMap' }],
    { transform: result => result.profile },
  ],
  attributeDefinitions: [
    fetchAttributeDefinitions,
    [{ attributeType: 'userAttributeDefinitions' }],
    { transform: result => result.attributeDefinitions },
  ],
  profileAttributeDefinitions: [
    fetchAttributeDefinitions,
    [{ attributeType: 'userProfileAttributeDefinitions' }],
    { transform: result => result.attributeDefinitions },
  ],
});

const handleSubmit = () => values => {
  const profile = values.toJS();
  return updateProfile({ profile });
};

const fields = () => [
  {
    name: 'username',
    label: 'Username',
    type: 'text',
    required: true,
    enabled: false,
    initialValue: ({ profile }) => get(profile, 'username', ''),
  },
  {
    name: 'email',
    label: 'Email',
    type: 'text',
    initialValue: ({ profile }) => get(profile, 'email', ''),
  },
  {
    name: 'displayName',
    label: 'Display Name',
    type: 'text',
    initialValue: ({ profile }) => get(profile, 'displayName'),
  },
  {
    name: 'enabled',
    label: 'Enabled?',
    type: 'checkbox',
    enabled: ({ profile }) => get(profile, 'spaceAdmin', true),
    initialValue: ({ profile }) => get(profile, 'enabled', true),
  },
  {
    name: 'spaceAdmin',
    label: 'Space Admin?',
    type: 'checkbox',
    enabled: ({ profile }) => get(profile, 'spaceAdmin', true),
    initialValue: ({ profile }) => get(profile, 'spaceAdmin'),
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    required: ({ values }) => values.get('changePassword'),
    visible: ({ values }) => values.get('changePassword'),
    transient: ({ values }) => !values.get('changePassword'),
  },
  {
    name: 'passwordConfirmation',
    label: 'Password Confirmation',
    type: 'password',
    required: ({ values }) => values.get('changePassword'),
    visible: ({ values }) => values.get('changePassword'),
    transient: ({ values }) => !values.get('changePassword'),
    constraint: ({ values }) =>
      values.get('passwordConfirmation') === values.get('password'),
    constraintMessage: 'Password Confirmation does not match',
  },
  {
    name: 'changePassword',
    label: 'Change Password',
    type: 'checkbox',
    visible: true,
    initialValue: false,
    transient: true,
    onChange: ({ values }, { setValue }) => {
      if (values.get('password') !== '') {
        setValue('password', '');
      }
      if (values.get('passwordConfirmation') !== '') {
        setValue('passwordConfirmation', '');
      }
    },
  },
  {
    name: 'allowedIps',
    label: 'Allowed IP Addresses',
    placeholder: '*',
    type: 'text',
    required: false,
    enabled: ({ profile }) => get(profile, 'spaceAdmin', true),
    initialValue: ({ profile }) => get(profile, 'allowedIps'),
  },
  {
    name: 'preferredLocale',
    label: 'Preferred Locale',
    type: 'select',
    options: ({ locales }) =>
      locales.map(locale => ({
        value: locale.get('code'),
        label: locale.get('name'),
      })),
    initialValue: ({ profile }) => get(profile, 'preferredLocale'),
  },
  {
    name: 'timezone',
    label: 'Timezone',
    type: 'select',
    options: ({ timezones }) =>
      timezones.map(timezone => ({
        value: timezone.get('id'),
        label: timezone.get('name'),
      })),
    initialValue: ({ profile }) => get(profile, 'timezone'),
  },
  {
    name: 'attributesMap',
    label: 'Attributes',
    type: 'attributes',
    required: false,
    enabled: ({ profile }) => get(profile, 'spaceAdmin', true),
    options: ({ attributeDefinitions }) => attributeDefinitions,
    initialValue: ({ profile }) => get(profile, 'attributesMap'),
    placeholder: 'There are no attributes configured',
  },
  {
    name: 'profileAttributesMap',
    label: 'Profile Attributes',
    type: 'attributes',
    required: false,
    options: ({ profileAttributeDefinitions }) => profileAttributeDefinitions,
    initialValue: ({ profile }) => get(profile, 'profileAttributesMap'),
    placeholder: 'There are no profile attributes configured',
  },
  {
    name: 'memberships',
    label: 'Teams',
    type: 'team-multi',
    required: false,
    placeholder: 'Select a team...',
    options: [],
    enabled: ({ profile }) => get(profile, 'spaceAdmin', true),
    initialValue: ({ profile }) =>
      get(profile, 'memberships', List()).map(m => m.get('team')),
    serialize: ({ values }) =>
      values.get('memberships').map(team => Map({ team })),
  },
];

export const ProfileForm = ({
  addFields,
  alterFields,
  children,
  components,
  fieldSet,
  formKey,
  onError,
  onSave,
}) => (
  <Form
    addFields={addFields}
    alterFields={alterFields}
    components={components}
    dataSources={dataSources()}
    fields={fields()}
    fieldSet={fieldSet}
    formKey={formKey}
    onError={onError}
    onSave={onSave}
    onSubmit={handleSubmit()}
  >
    {children}
  </Form>
);
