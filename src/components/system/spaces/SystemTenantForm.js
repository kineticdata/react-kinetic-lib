import { fetchSystemTenant, updateSystemTenant } from './helper';
import { List, Map, get, getIn } from 'immutable';
import { generateForm } from '../../form/Form';
import {
  createTenant,
  fetchTaskDbAdapters,
  updateTenant,
} from '../../../apis/system';
import { slugify } from '../../../helpers';
import {
  propertiesFromAdapters,
  propertiesFromValues,
  adapterPropertiesFields,
} from '../helpers';

const TENANT_INCLUDES = 'details';

const dataSources = ({ slug }) => ({
  tenant: {
    fn: fetchSystemTenant,
    params: slug && [{ slug, include: TENANT_INCLUDES }],
    transform: result => result.space,
  },
  taskDbAdapters: {
    fn: fetchTaskDbAdapters,
    params: () => [],
    transform: result => result.adapters,
  },
  adapterProperties: {
    fn: propertiesFromAdapters,
    params: ({ taskDbAdapters }) => taskDbAdapters && [taskDbAdapters],
  },
});

const handleSubmit = ({ slug }) => values => {
  const tenant = values.toJS();
  return slug ? updateTenant({ slug, tenant }) : createTenant({ tenant });
};

const fields = ({ slug, adapter }) => ({
  tenant,
  taskDbAdapters,
  adapterProperties,
}) => {
  if (taskDbAdapters && adapterProperties) {
    const taskAdapters = adapterPropertiesFields(
      adapterProperties,
      'taskAdapter',
    );

    return (
      (!slug || tenant) && [
        {
          name: 'name',
          label: 'Name',
          type: 'text',
          required: true,
          onChange: ({ values }, { setValue }) => {
            if (values.get('linked')) {
              setValue('slug', slugify(values.get('name')), false);
            }
          },
          initialValue: get(tenant, 'name') || '',
        },
        {
          name: 'slug',
          label: 'Slug',
          type: 'text',
          required: true,
          enabled: !slug,
          onChange: (_bindings, { setValue }) => {
            setValue('linked', false);
          },
          initialValue: get(tenant, 'slug') || '',
        },
        {
          name: 'linked',
          label: 'Linked',
          type: 'checkbox',
          transient: true,
          initialValue: !tenant,
          visible: false,
        },

        ...(slug
          ? [
              // These are fields that only apply to updating a tenant/space.
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
                required: ({ values }) => slug && values.get('sharedBundle'),
                initialValue: tenant
                  ? get(tenant, 'sharedBundleBaseDirectory')
                  : '',
              },
              {
                name: 'sharedBundlePath',
                label: 'Bundle Path',
                type: 'text',
                visible: ({ values }) => values.get('sharedBundle'),
                required: ({ values }) => slug && values.get('sharedBundle'),
                initialValue: tenant ? get(tenant, 'sharedBundlePath') : '',
              },
            ]
          : [
              // These are fields that only apply to creating a new tenant/space.
              {
                name: 'username',
                label: 'Username',
                type: 'text',
                transient: true,
                required: !slug,
                enabled: !slug,
                visible: !slug,
                initialValue: '',
              },
              {
                name: 'email',
                label: 'Email',
                type: 'text',
                transient: true,
                required: !slug,
                enabled: !slug,
                visible: !slug,
                initialValue: '',
              },
              {
                name: 'displayName',
                label: 'Display Name',
                type: 'text',
                transient: true,
                required: !slug,
                enabled: !slug,
                visible: !slug,
                initialValue: '',
              },
              {
                name: 'password',
                label: 'Password',
                type: 'password',
                transient: true,
                required: !slug,
                enabled: !slug,
                visible: !slug,
              },
              {
                name: 'passwordConfirmation',
                label: 'Password Confirmation',
                type: 'password',
                transient: true,
                required: !slug,
                enabled: !slug,
                visible: !slug,
                constraint: ({ values }) =>
                  values.get('passwordConfirmation') === values.get('password'),
                constraintMessage: 'Password Confirmation does not match',
              },
              {
                name: 'user',
                label: 'Admin User',
                visible: false,
                required: false,
                serialize: ({ values }) => {
                  return {
                    username: values.get('username'),
                    password: values.get('password'),
                    email: values.get('email'),
                    displayName: values.get('displayName'),
                  };
                },
              },
            ]),

        {
          name: 'taskAdapter',
          label: 'Task Adapter',
          type: 'text',
          required: false,
          visible: false,
          serialize: ({ values }) => {
            return {
              type: values.get('taskAdapter_type'),
              createDatabase:
                values.get('taskAdapter_type') === 'postgres'
                  ? values.get('taskAdapter_createDatabase')
                  : undefined,
              properties: propertiesFromValues(values, 'taskAdapter'),
            };
          },
        },
        {
          name: 'taskAdapter_type',
          label: 'Task Adapter',
          type: 'select',
          required: true,
          transient: true,
          options: ({ taskDbAdapters }) =>
            taskDbAdapters.map(adapter =>
              Map({
                label: adapter.get('name'),
                value: adapter.get('type'),
              }),
            ),
          initialValue: slug
            ? get(tenant, ['taskAdapter', 'type'], 'postgres')
            : adapter,
        },
        {
          name: 'taskAdapter_createDatabase',
          label: 'Auto-Create Database',
          type: 'checkbox',
          visible: ({ values }) =>
            values.get('taskAdapter_type') === 'postgres',
          transient: true,
          initialValue: slug
            ? get(tenant, ['taskAdapter', 'type'], true)
            : true,
        },
        ...taskAdapters.toJS(),
      ]
    );
  }
};

export const SystemTenantForm = generateForm({
  formOptions: ['slug', 'adapter'],
  dataSources,
  fields,
  handleSubmit,
});
