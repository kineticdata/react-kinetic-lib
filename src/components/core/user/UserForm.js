import React from 'react';
import { get, List, Map } from 'immutable';

import { Form } from '../../form/Form';
import {
  createUser,
  fetchAttributeDefinitions,
  fetchUser,
  updateUser,
  fetchLocales,
  fetchTimezones,
} from '../../../apis';

const USER_INCLUDES = 'attributesMap,memberships,profileAttributesMap';

const dataSources = ({ username }) => ({
  locales: {
    fn: fetchLocales,
    params: [],
    transform: result => result.data.locales,
  },
  timezones: {
    fn: fetchTimezones,
    params: [],
    transform: result => result.data.timezones,
  },
  user: {
    fn: fetchUser,
    params: username && [{ username, include: USER_INCLUDES }],
    transform: result => result.user,
  },
  attributeDefinitions: {
    fn: fetchAttributeDefinitions,
    params: [{ attributeType: 'userAttributeDefinitions' }],
    transform: result => result.attributeDefinitions,
  },
  profileAttributeDefinitions: {
    fn: fetchAttributeDefinitions,
    params: [{ attributeType: 'userProfileAttributeDefinitions' }],
    transform: result => result.attributeDefinitions,
  },
});

const handleSubmit = ({ username }) => values => {
  const user = values.toJS();
  return username ? updateUser({ username, user }) : createUser({ user });
};

const fields = ({ username }) => ({ user }) =>
  (!username || user) && [
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      required: true,
      enabled: !username,
      initialValue: get(user, 'username') || '',
    },
    {
      name: 'email',
      label: 'Email',
      type: 'text',
      initialValue: get(user, 'email') || '',
    },
    {
      name: 'displayName',
      label: 'Display Name',
      type: 'text',
      initialValue: get(user, 'displayName') || '',
    },
    {
      name: 'enabled',
      label: 'Enabled?',
      type: 'checkbox',
      initialValue: user ? get(user, 'enabled') : true,
    },
    {
      name: 'spaceAdmin',
      label: 'Space Admin?',
      type: 'checkbox',
      initialValue: user ? get(user, 'spaceAdmin') : false,
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
      visible: !!username,
      initialValue: !username,
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
      initialValue: get(user, 'allowedIps') || '',
    },
    {
      name: 'preferredLocale',
      label: 'Preferred Locale',
      type: 'select',
      options: ({ locales }) =>
        locales
          ? locales.map(locale =>
              Map({
                value: locale.get('code'),
                label: locale.get('name'),
              }),
            )
          : List(),
      initialValue: get(user, 'preferredLocale') || '',
    },
    {
      name: 'timezone',
      label: 'Timezone',
      type: 'select',
      options: ({ timezones }) =>
        timezones
          ? timezones.map(timezone =>
              Map({
                value: timezone.get('id'),
                label: timezone.get('name'),
              }),
            )
          : List(),
      initialValue: get(user, 'timezone') || '',
    },
    {
      name: 'attributesMap',
      label: 'Attributes',
      type: 'attributes',
      required: false,
      options: ({ attributeDefinitions }) => attributeDefinitions,
      initialValue: get(user, 'attributesMap'),
      placeholder: 'There are no attributes configured',
    },
    {
      name: 'profileAttributesMap',
      label: 'Profile Attributes',
      type: 'attributes',
      required: false,
      options: ({ profileAttributeDefinitions }) => profileAttributeDefinitions,
      initialValue: get(user, 'profileAttributesMap'),
      placeholder: 'There are no profile attributes configured',
    },
    {
      name: 'memberships',
      label: 'Teams',
      type: 'team-multi',
      required: false,
      placeholder: 'Select a team...',
      options: [],
      initialValue: get(user, 'memberships', List()).map(m => m.get('team')),
      serialize: ({ values }) =>
        values.get('memberships').map(team => Map({ team })),
    },
  ];

export const UserForm = ({
  addFields,
  alterFields,
  children,
  components,
  fieldSet,
  formKey,
  onError,
  onSave,
  username,
}) => (
  <Form
    addFields={addFields}
    alterFields={alterFields}
    components={components}
    dataSources={dataSources}
    fields={fields}
    fieldSet={fieldSet}
    formKey={formKey}
    onError={onError}
    onSave={onSave}
    onSubmit={handleSubmit}
    formOptions={{ username }}
  >
    {children}
  </Form>
);
