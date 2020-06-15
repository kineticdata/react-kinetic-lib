import { get, getIn } from 'immutable';
import { generateForm } from '../../form/Form';
import {
  createTenant,
  fetchSystemDefaultTaskDbAdapter,
  fetchTenant,
  updateTenant,
} from '../../../apis/system';
import { handleFormErrors, slugify } from '../../../helpers';

const TENANT_INCLUDES = 'details';

const dataSources = ({ slug }) => ({
  tenant: {
    fn: fetchTenant,
    params: slug && [{ slug, include: TENANT_INCLUDES }],
    transform: result => result.tenant,
  },
  defaultTaskDbAdapter: {
    fn: fetchSystemDefaultTaskDbAdapter,
    params: [],
    transform: result => result.adapter,
  },
});

const handleSubmit = ({ slug }) => values => {
  const tenant = values.toJS();
  return slug
    ? updateTenant({ slug, tenant }).then(handleFormErrors('space'))
    : createTenant({ tenant }).then(handleFormErrors());
};

const getSpaceValue = (tenant, key) =>
  tenant ? getIn(tenant, ['space', key], '') : '';

const VALIDATE_DB_ADAPTERS = [
  { label: 'Microsoft SQL Server', value: 'mssql' },
  { label: 'Oracle DB Server', value: 'oracle' },
  { label: 'PostgreSQL DB Server', value: 'postgres' },
];

const generateInitialValues = (
  persistedObject,
  persistedPath,
  defaultObject,
  adapter,
) => (key, initialValue) => {
  const sameAsTenant =
    getIn(persistedObject, persistedPath.concat(['type']), '') === adapter;
  if (sameAsTenant) {
    // If there's already a tenant and this adapter matches then we'll use that and
    // no default adapter or initial value.
    return getIn(
      persistedObject,
      persistedPath.concat(['properties', key]),
      '',
    );
  } else if (defaultObject.get('type') === adapter) {
    const adapterProperty = defaultObject
      .get('properties')
      .find(property => property.get('name') === key);
    return get(adapterProperty, 'value', '');
  }

  return initialValue;
};

const generatePasswordFields = (
  adapterName,
  tenant,
  currentAdapter,
  defaultAdapter,
) => {
  const required = ({ values }) => {
    const currentAdapterName = values.get(currentAdapter);

    if (currentAdapterName === adapterName) {
      if (tenant) {
        return values.get(`${adapterName}_passwordChange`);
      } else {
        return getIn(defaultAdapter, ['type'], '') !== adapterName;
      }
    }
    return false;
  };

  return [
    {
      name: `${adapterName}_password`,
      label: 'Password',
      type: 'password',
      transient: true,
      required,
      visible: ({ values }) => values.get(`${adapterName}_passwordChange`),
    },
    {
      name: `${adapterName}_passwordConfirmation`,
      label: 'Password Confirmation',
      type: 'password',
      required,
      visible: ({ values }) => values.get(`${adapterName}_passwordChange`),
      transient: true,
      constraint: ({ values }) =>
        values.get(`${adapterName}_passwordConfirmation`) ===
        values.get(`${adapterName}_password`),
      constraintMessage: 'Password Confirmation does not match',
    },
    {
      name: `${adapterName}_passwordChange`,
      label: 'Change Password',
      type: 'checkbox',
      visible: !!tenant,
      initialValue: !tenant,
      transient: true,
      onChange: ({ values }, { setValue }) => {
        if (values.get(`${adapterName}_password`) !== '') {
          setValue(`${adapterName}_password`, '');
        }
        if (values.get(`${adapterName}_passwordConfirmation`) !== '') {
          setValue(`${adapterName}_passwordConfirmation`, '');
        }
      },
    },
  ];
};

const MSSQL_FIELDS = (adapter, tenant, defaultAdapter) => {
  const trueIfAdapter = ({ values }) => values.get(adapter) === 'mssql';
  const initialValues = generateInitialValues(
    tenant,
    ['task', 'databaseAdapter'],
    defaultAdapter,
    'mssql',
  );
  return [
    {
      name: 'mssql_host',
      label: 'Host',
      type: 'text',
      transient: true,
      required: trueIfAdapter,
      visible: trueIfAdapter,
      initialValue: initialValues('host', '127.0.0.1'),
    },
    {
      name: 'mssql_port',
      label: 'Port',
      type: 'text',
      transient: true,
      required: trueIfAdapter,
      visible: trueIfAdapter,
      initialValue: initialValues('port', '1433'),
    },
    {
      name: 'mssql_database',
      label: 'Database',
      type: 'text',
      transient: true,
      required: trueIfAdapter,
      visible: trueIfAdapter,
    },
    {
      name: 'mssql_instance',
      label: 'Instance',
      type: 'text',
      transient: true,
      required: false,
      visible: trueIfAdapter,
    },
    {
      name: 'mssql_username',
      label: 'Username',
      type: 'text',
      transient: true,
      required: false,
      visible: trueIfAdapter,
    },
    ...generatePasswordFields('mssql', tenant, adapter, defaultAdapter),
    {
      name: 'mssql_sslEnabled',
      label: 'Enable SSL',
      type: 'select',
      transient: true,
      required: false,
      visible: trueIfAdapter,
      options: [
        { label: 'True', value: 'true' },
        { label: 'False', value: 'false' },
      ],
      initialValue: 'false',
    },
    {
      name: 'mssql_sslProtocol',
      description: 'Protocol to use with SSL encryption',
      label: 'SSL Protocol',
      type: 'text',
      transient: true,
      required: false,
      visible: trueIfAdapter,
      initialValue: 'TLSv1.2',
    },
    {
      name: 'mssql_sslrootcert',
      label: 'Root Certificate',
      type: 'text-area',
      transient: true,
      required: false,
      visible: trueIfAdapter,
    },
    {
      name: 'mssql_sslcert',
      label: 'Client Certificate',
      type: 'text-area',
      transient: true,
      required: false,
      visible: trueIfAdapter,
    },
    {
      name: 'mssql_ssltruststorepw',
      label: 'Truststore Password',
      type: 'password',
      transient: true,
      required: false,
      visible: trueIfAdapter,
    },
    {
      name: 'mssql_sslkeystorepw',
      label: 'Keystore Password',
      type: 'password',
      transient: true,
      required: false,
      visible: trueIfAdapter,
    },
  ];
};

const ORACLE_FIELDS = (adapter, tenant, defaultAdapter) => {
  const trueIfAdapter = ({ values }) => values.get(adapter) === 'oracle';
  return [
    {
      name: 'oracle_host',
      label: 'Host',
      type: 'text',
      transient: true,
      required: trueIfAdapter,
      visible: trueIfAdapter,
      initialValue: '127.0.0.1',
    },
    {
      name: 'oracle_port',
      label: 'Port',
      type: 'text',
      transient: true,
      required: trueIfAdapter,
      visible: trueIfAdapter,
      initialValue: '1521',
    },
    {
      name: 'oracle_service',
      label: 'Service Name',
      type: 'text',
      transient: true,
      required: trueIfAdapter,
      visible: trueIfAdapter,
      initialValue: 'ORCLCDB',
    },
    {
      name: 'oracle_username',
      label: 'Username',
      type: 'text',
      transient: true,
      required: false,
      visible: trueIfAdapter,
    },
    ...generatePasswordFields('oracle', tenant, adapter, defaultAdapter),
    {
      name: 'oracle_sslEnabled',
      label: 'Enable SSL',
      type: 'select',
      transient: true,
      required: false,
      visible: trueIfAdapter,
      options: [
        { label: 'True', value: 'true' },
        { label: 'False', value: 'false' },
      ],
      initialValue: 'false',
    },
    {
      name: 'oracle_sslVersion',
      label: 'TLS Version',
      type: 'text',
      transient: true,
      required: false,
      visible: trueIfAdapter,
      initialValue: '1.2',
    },
    {
      name: 'oracle_sslServerDnMatch',
      label: 'Server DN Match',
      type: 'select',
      transient: true,
      required: false,
      visible: trueIfAdapter,
      options: [
        { label: 'True', value: 'true' },
        { label: 'False', value: 'false' },
      ],
      initialValue: 'false',
    },
    {
      name: 'oracle_ciphersuites',
      label: 'Cipher Suites',
      type: 'text',
      transient: true,
      required: false,
      visible: trueIfAdapter,
    },
    {
      name: 'oracle_serverCert',
      label: 'Server Certificate',
      type: 'text-area',
      transient: true,
      required: false,
      visible: trueIfAdapter,
    },
    {
      name: 'oracle_clientCert',
      label: 'Client Certificate',
      type: 'text-area',
      transient: true,
      required: false,
      visible: trueIfAdapter,
    },
    {
      name: 'oracle_truststorePassword',
      label: 'Truststore Password',
      type: 'password',
      transient: true,
      required: false,
      visible: trueIfAdapter,
    },
    {
      name: 'oracle_keystorePassword',
      label: 'Keystore Password',
      type: 'password',
      transient: true,
      required: false,
      visible: trueIfAdapter,
    },
  ];
};

const POSTGRES_FIELDS = (adapter, tenant, defaultAdapter) => {
  const trueIfAdapter = ({ values }) => values.get(adapter) === 'postgres';
  const initialValues = generateInitialValues(
    tenant,
    ['task', 'databaseAdapter'],
    defaultAdapter,
    'postgres',
  );

  return [
    {
      name: 'postgres_host',
      label: 'Host',
      type: 'text',
      transient: true,
      required: trueIfAdapter,
      visible: trueIfAdapter,
      initialValue: initialValues('host', '127.0.0.1'),
    },
    {
      name: 'postgres_port',
      label: 'Port',
      type: 'text',
      transient: true,
      required: trueIfAdapter,
      visible: trueIfAdapter,
      initialValue: initialValues('port', '5432'),
    },
    {
      name: 'postgres_database',
      label: 'Database',
      type: 'text',
      transient: true,
      required: trueIfAdapter,
      visible: trueIfAdapter,
      initialValue: initialValues('database', 'postgres'),
    },
    {
      name: 'postgres_username',
      label: 'Username',
      type: 'text',
      transient: true,
      required: false,
      visible: trueIfAdapter,
      initialValue: initialValues('username', ''),
    },
    ...generatePasswordFields('postgres', tenant, adapter, defaultAdapter),
    {
      name: 'postgres_sslEnabled',
      label: 'Enable SSL',
      type: 'select',
      transient: true,
      required: false,
      visible: trueIfAdapter,
      options: [
        { label: 'True', value: 'true' },
        { label: 'False', value: 'false' },
      ],
      initialValue: initialValues('sslEnabled', 'false'),
    },
    {
      name: 'postgres_sslmode',
      label: 'SSL Mode',
      type: 'select',
      transient: true,
      required: false,
      visible: trueIfAdapter,
      options: [
        { label: 'Disable', value: 'disable' },
        { label: 'Allow', value: 'allow' },
        { label: 'Prefer', value: 'prefer' },
        { label: 'Verify CA', value: 'verify-ca' },
        { label: 'Verify Full', value: 'verify-full' },
      ],
      initialValue: initialValues('sslmode', 'disable'),
    },
    {
      name: 'postgres_sslrootcert',
      description:
        'x509 certificate (PEM format) used for server authentication',
      label: 'Root Certificate',
      type: 'text-area',
      transient: true,
      required: false,
      visible: trueIfAdapter,
      initialValue: initialValues('sslrootcert', ''),
    },
    {
      name: 'postgres_sslcert',
      label: 'Client Certificate',
      type: 'text-area',
      transient: true,
      required: false,
      visible: trueIfAdapter,
      initialValue: initialValues('sslcert', ''),
    },
    {
      name: 'postgres_sslkey',
      label: 'Client Key',
      type: 'text-area',
      transient: true,
      required: false,
      visible: trueIfAdapter,
      initialValue: initialValues('sslkey', ''),
    },
  ];
};

const adapterProperties = values => {
  const adapterPrefix = `${values.get('task_databaseAdapter_type')}_`;
  const properties = values
    // Remove the other adapters properties and the password properties for
    // the current one.
    .filter(
      (_v, key) =>
        key.startsWith(adapterPrefix) &&
        !key.startsWith(`${adapterPrefix}password`),
    )
    // Then check to see if we checked the passwordChange and if we did add the
    // password property back in
    .update(properties =>
      values.get(`${adapterPrefix}passwordChange`, false)
        ? properties.set(
            `${adapterPrefix}password`,
            values.get(`${adapterPrefix}password`),
          )
        : properties,
    )
    // Remove the adapter prefix from the property names.
    .mapKeys(key => key.replace(adapterPrefix, ''))
    .toObject();

  return properties;
};

const fields = ({ slug }) => ({ tenant, defaultTaskDbAdapter }) =>
  (tenant || !slug) &&
  defaultTaskDbAdapter && [
    // Top-level fields
    {
      name: 'authenticationSecret',
      label: 'Authentication Secret',
      type: 'password',
      visible: ({ values }) => values.get('changeAuthenticationSecret'),
      transient: ({ values }) => !values.get('changeAuthenticationSecret'),
      required: false,
    },
    {
      name: 'changeAuthenticationSecret',
      label: 'Change Authentication Secret',
      type: 'checkbox',
      transient: true,
      initialValue: false,
      onChange: ({ values }, { setValue }) => {
        if (values.get('authenticationSecret') !== '') {
          setValue('authenticationSecret', '');
        }
      },
    },

    // Start - Space Fields
    {
      name: 'space',
      label: 'Space Settings',
      type: null,
      visible: false,
      required: false,
      serialize: ({ values }) => {
        return {
          slug: values.get('slug'),
          name: values.get('name'),
        };
      },
    },
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      transient: true,
      onChange: ({ values }, { setValue }) => {
        if (values.get('linked')) {
          setValue('slug', slugify(values.get('name')), false);
        }
      },
      initialValue: getSpaceValue(tenant, 'name'),
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      required: true,
      transient: true,
      enabled: !slug,
      onChange: (_bindings, { setValue }) => {
        setValue('linked', false);
      },
      initialValue: getSpaceValue(tenant, 'slug'),
    },
    {
      name: 'linked',
      label: 'Linked',
      type: 'checkbox',
      transient: true,
      initialValue: !tenant,
      visible: false,
    },
    // End - Space Fields

    // Start - Task fields
    {
      name: 'task',
      label: 'Task Settings',
      type: null,
      visible: false,
      required: false,
      serialize: ({ values }) => {
        return {
          autoCreateDatabase: values.get('task_autoCreateDatabase')
            ? 'true'
            : 'false',
          ...(tenant
            ? {
                deployment: {
                  image: values.get('image'),
                  replicas: parseInt(values.get('replicas')),
                },
              }
            : {}),
          databaseAdapter: {
            type: values.get('task_databaseAdapter_type'),
            properties: adapterProperties(values),
          },
        };
      },
    },
    {
      name: 'replicas',
      label: 'Task Replica Count',
      type: 'text',
      required: !!slug,
      transient: true,
      initialValue: getIn(tenant, ['task', 'deployment', 'replicas'], 1),
      // pattern: /^\d+$/,
      // patternMessage:
      //   'You must provide a number of replicas desired.',
    },
    {
      name: 'image',
      label: 'Task Image',
      type: 'text',
      required: !!slug,
      transient: true,
      initialValue: getIn(tenant, ['task', 'deployment', 'image']),
    },
    {
      name: 'task_databaseAdapter_type',
      label: 'Task Adapter',
      required: true,
      transient: true,
      type: 'select',
      options: VALIDATE_DB_ADAPTERS,
      initialValue: getIn(
        tenant,
        ['task', 'databaseAdapter', 'type'],
        defaultTaskDbAdapter.get('type'),
      ),
    },
    {
      name: 'task_autoCreateDatabase',
      label: 'Auto-Create Database',
      type: 'checkbox',
      visible: ({ values }) =>
        values.get('task_databaseAdapter_type') === 'postgres',
      transient: true,
      initialValue: slug
        ? get(tenant, ['task', 'autoCreateDatabase'], true)
        : true,
    },
    // End - Task fields

    // Start - Task Adapters
    ...MSSQL_FIELDS('task_databaseAdapter_type', tenant, defaultTaskDbAdapter),
    ...ORACLE_FIELDS('task_databaseAdapter_type', tenant, defaultTaskDbAdapter),
    ...POSTGRES_FIELDS(
      'task_databaseAdapter_type',
      tenant,
      defaultTaskDbAdapter,
    ),
    // Start - Users fields. Create-only.
    ...(slug
      ? []
      : [
          {
            name: 'username',
            label: 'Username',
            type: 'text',
            transient: true,
            required: true,
            enabled: true,
            visible: true,
            initialValue: '',
          },
          {
            name: 'email',
            label: 'Email',
            type: 'text',
            transient: true,
            required: true,
            enabled: true,
            visible: true,
            initialValue: '',
          },
          {
            name: 'displayName',
            label: 'Display Name',
            type: 'text',
            transient: true,
            required: true,
            enabled: true,
            visible: true,
            initialValue: '',
          },
          {
            name: 'password',
            label: 'Password',
            type: 'password',
            transient: true,
            required: true,
            enabled: true,
            visible: true,
          },
          {
            name: 'passwordConfirmation',
            label: 'Password Confirmation',
            type: 'password',
            transient: true,
            required: true,
            enabled: true,
            visible: true,
            constraint: ({ values }) =>
              values.get('passwordConfirmation') === values.get('password'),
            constraintMessage: 'Password Confirmation does not match',
          },
          {
            name: 'users',
            label: 'Admin User',
            type: null,
            visible: false,
            required: false,
            serialize: ({ values }) => {
              return [
                {
                  username: values.get('username'),
                  password: values.get('password'),
                  email: values.get('email'),
                  displayName: values.get('displayName'),
                },
              ];
            },
          },
        ]),
    // End - Users fields. Create-only.
  ];

export const SystemTenantForm = generateForm({
  formOptions: ['slug'],
  dataSources,
  fields,
  handleSubmit,
});
