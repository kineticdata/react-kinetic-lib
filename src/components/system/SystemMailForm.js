import { get } from 'immutable';
import { generateForm } from '../form/Form';

const updateSystemUser = () => Promise.resolve();
const fetchSystemMail = () =>
  Promise.resolve({
    smtp: {
      host: 'mail.acme.com',
      port: '25',
      useTls: true,
      username: 'admin',
      fromAddress: 'noreply@acme.com',
    },
  });

const dataSources = () => ({
  user: {
    fn: fetchSystemMail,
    params: [],
    transform: result => result.smtp,
  },
});

const handleSubmit = () => values => {
  const smtp = values.toJS();
  return updateSystemUser({ smtp });
};

const fields = () => ({ user }) =>
  user && [
    {
      name: 'host',
      label: 'Host Name',
      type: 'text',
      required: true,
      initialValue: get(user, 'host') || '',
    },
    {
      name: 'port',
      label: 'Port',
      type: 'text',
      required: true,
      initialValue: get(user, 'port') || '25',
    },
    {
      name: 'useTls',
      label: 'Use SMTP TLS',
      type: 'select',
      required: true,
      options: () => [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ],
      initialValue: get(user, 'useTls') || false,
    },
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      required: true,
      initialValue: get(user, 'username') || '',
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
      name: 'fromAddress',
      label: 'From Address',
      type: 'text',
      required: true,
      placeholder: 'noreply@company.com',
      initialValue: get(user, 'fromAddress') || '',
    },
  ];

export const SystemMailForm = generateForm({
  dataSources,
  fields,
  handleSubmit,
});

SystemMailForm.displayName = 'SystemMailForm';
