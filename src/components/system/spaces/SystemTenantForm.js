import {
  createSystemTenant,
  fetchSystemTenant,
  updateSystemTenant,
} from './helper';
import { get } from 'immutable';
import { generateForm } from '../../form/Form';

const TENANT_INCLUDES = 'details';

const dataSources = ({ slug }) => {
  console.log('generating datasources for ', slug);
  return {
    tenant: {
      fn: fetchSystemTenant,
      params: slug && [{ slug, include: TENANT_INCLUDES }],
      transform: result => result.space,
    },
  };
};

const handleSubmit = ({ slug }) => values => {
  const tenant = values.toJS();
  return slug
    ? updateSystemTenant({ slug, tenant })
    : createSystemTenant({ tenant });
};

const fields = ({ slug }) => ({ tenant }) => {
  console.log('fields', slug, tenant);
  return (
    (!slug || tenant) && [
      {
        name: 'name',
        label: 'Name',
        type: 'text',
        required: 'true',
        initialValue: get(tenant, 'name') || '',
      },
      {
        name: 'slug',
        label: 'Slug',
        type: 'text',
        required: 'true',
        enabled: !slug,
        initialValue: get(tenant, 'slug') || '',
      },
      {
        name: 'username',
        label: 'Username',
        type: 'text',
        required: !slug,
        enabled: !slug,
        visible: !slug,
        initialValue: '',
      },
      {
        name: 'email',
        label: 'Email',
        type: 'text',
        required: !slug,
        enabled: !slug,
        visible: !slug,
        initialValue: '',
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        required: !slug,
        enabled: !slug,
        visible: !slug,
      },
      {
        name: 'passwordConfirmation',
        label: 'Password Confirmation',
        type: 'password',
        required: !slug,
        enabled: !slug,
        visible: !slug,
        constraint: ({ values }) =>
          values.get('passwordConfirmation') === values.get('password'),
        constraintMessage: 'Password Confirmation does not match',
      },
      {
        name: 'sharedBundle',
        label: 'Use Shared Bundle base directory?',
        type: 'checkbox',
        initialValue: tenant ? get(tenant, 'sharedBundle') : true,
      },
      {
        name: 'sharedBundleBaseDirectory',
        label: 'Shared Bundle Base Directory',
        type: 'text',
        visible: ({ values }) => values.get('sharedBundle'),
        required: ({ values }) => values.get('sharedBundle'),
        initialValue: tenant ? get(tenant, 'sharedBundleBaseDirectory') : '',
      },
      {
        name: 'sharedBundlePath',
        label: 'Bundle Path',
        type: 'text',
        visible: ({ values }) => values.get('sharedBundle'),
        required: ({ values }) => values.get('sharedBundle'),
        initialValue: tenant ? get(tenant, 'sharedBundlePath') : '',
      },
    ]
  );
};

export const SystemTenantForm = generateForm({
  formOptions: ['slug'],
  dataSources,
  fields,
  handleSubmit,
});
