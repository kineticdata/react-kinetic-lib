import React from 'react';
import { Form } from '../form/Form';
import { fetchSpace, fetchTeams, fetchUser } from '../../../apis/core';
import { fetchLocales, fetchTimezones } from '../../../apis/core/meta';
import { fetchAttributeDefinitions } from '../../../apis/core/attributeDefinitions';
import { createUser, updateUser } from '../../../apis/core/users';
import { get, List, Map } from 'immutable';

const dataSources = ({ username }) => ({
  space: [
    fetchSpace,
    [{ include: 'attributesMap' }],
    { shared: true, cache: 3600, transform: result => result.space },
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
  user: [
    fetchUser,
    [{ username, include: 'attributesMap,memberships,profileAttributesMap' }],
    { transform: result => result.user, runIf: () => !!username },
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
  teams: [fetchTeams, [], { transform: result => result.teams }],
});

const handleSubmit = ({ username }) => values => {
  const user = values.toJS();
  return username ? updateUser({ username, user }) : createUser({ user });
};

const fields = ({ username }) => [
  !username && {
    name: 'username',
    label: 'Username',
    type: 'text',
    required: true,
  },
  {
    name: 'displayName',
    label: 'Display Name',
    type: 'text',
    required: true,
    initialValue: ({ user }) => get(user, 'displayName'),
  },
  {
    name: 'email',
    label: 'Email',
    type: 'text',
    required: true,
    initialValue: ({ user }) => get(user, 'email', ''),
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    required: ({ values }) => values.get('changePassword'),
    visible: ({ values }) => values.get('changePassword'),
  },
  {
    name: 'passwordConfirmation',
    label: 'Password Confirmation',
    type: 'password',
    required: ({ values }) => values.get('changePassword'),
    visible: ({ values }) => values.get('changePassword'),
    constraint: ({ values }) =>
      values.get('passwordConfirmation') === values.get('password'),
    constraintMessage: 'Password Confirmation does not match',
  },
  {
    name: 'changePassword',
    label: 'Change Password',
    type: 'checkbox',
    visible: !!username,
    initialValue: !username,
    transient: true,
  },
  {
    name: 'spaceAdmin',
    label: 'Space Admin?',
    type: 'checkbox',
    initialValue: ({ user }) => get(user, 'spaceAdmin'),
  },
  {
    name: 'enabled',
    label: 'Enabled?',
    type: 'checkbox',
    initialValue: ({ user }) => get(user, 'enabled', true),
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
    initialValue: ({ user }) => get(user, 'preferredLocale'),
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
    initialValue: ({ user }) => get(user, 'timezone'),
  },
  {
    name: 'attributesMap',
    label: 'Attributes',
    type: 'attributes',
    required: false,
    options: ({ attributeDefinitions }) => attributeDefinitions,
    initialValue: ({ user }) => get(user, 'attributesMap'),
  },
  {
    name: 'profileAttributesMap',
    label: 'Profile Attributes',
    type: 'attributes',
    required: false,
    options: ({ profileAttributeDefinitions }) => profileAttributeDefinitions,
    initialValue: ({ user }) => get(user, 'profileAttributesMap'),
  },
  {
    name: 'memberships',
    label: 'Teams',
    type: 'team-multi',
    required: false,
    options: ({ teams }) => teams,
    initialValue: ({ user }) =>
      get(user, 'memberships', List()).map(m => m.get('team')),
    serialize: value => value.map(team => Map({ team })),
  },
];

export const UserForm = ({
  children,
  components,
  formKey,
  onError,
  onSave,
  username,
}) => (
  <Form
    components={components}
    dataSources={dataSources({ username })}
    fields={fields({ username })}
    formKey={formKey}
    onError={onError}
    onSave={onSave}
    onSubmit={handleSubmit({ username })}
  >
    {children}
  </Form>
);
