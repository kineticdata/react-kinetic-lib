import { generateTable } from '../../table/Table';
import { fetchTenants } from '../../../apis/system';

const dataSource = () => ({
  fn: fetchTenants,
  params: () => [],
  transform: result => ({
    data: result.tenants,
    nextPageToken: result.nextPageToken,
  }),
});

const columns = [
  {
    value: 'spaceSlug',
    title: 'Slug',
    filter: 'startWith',
    type: 'text',
    sortable: false,
  },
  {
    value: 'namespace',
    title: 'Namespace',
    filter: 'startWith',
    type: 'text',
    sortable: false,
  },
  {
    value: 'taskImage',
    title: 'Task Image',
    filter: 'startWith',
    type: 'text',
    sortable: false,
  },
  {
    value: 'space.name',
    title: 'Name',
    filter: 'startWith',
    type: 'text',
    sortable: false,
    valueTransform: (_value, row) => row.getIn(['space', 'name']),
  },
  {
    value: 'space.status',
    title: 'Status',
    filter: 'startWith',
    type: 'text',
    sortable: false,
    valueTransform: (_value, row) => row.getIn(['space', 'status']),
  },
  {
    value: 'space.statusMessage',
    title: 'Status Message',
    filter: 'startWith',
    type: 'text',
    sortable: false,
    valueTransform: (_value, row) => row.getIn(['space', 'statusMessage']),
  },
  {
    value: 'space.createdAt',
    title: 'Created At',
    filter: 'startWith',
    type: 'text',
    sortable: false,
    valueTransform: (_value, row) => row.getIn(['space', 'createdAt']),
  },
  {
    value: 'space.createdBy',
    title: 'Created By',
    filter: 'startWith',
    type: 'text',
    sortable: false,
    valueTransform: (_value, row) => row.getIn(['space', 'createdBy']),
  },
  {
    value: 'space.updatedAt',
    title: 'Updated At',
    filter: 'startWith',
    type: 'text',
    sortable: false,
    valueTransform: (_value, row) => row.getIn(['space', 'updatedAt']),
  },
  {
    value: 'space.updatedBy',
    title: 'Updated By',
    filter: 'startWith',
    type: 'text',
    sortable: false,
    valueTransform: (_value, row) => row.getIn(['space', 'updatedBy']),
  },
  {
    value: 'space.afterLogoutPath',
    title: 'After Logout Path',
    filter: 'startWith',
    type: 'text',
    sortable: false,
    valueTransform: (_value, row) => row.getIn(['space', 'afterLogoutPath']),
  },
  {
    value: 'space.bundlePath',
    title: 'Bundle Path',
    filter: 'startWith',
    type: 'text',
    sortable: false,
    valueTransform: (_value, row) => row.getIn(['space', 'bundlePath']),
  },
  {
    value: 'space.customTranslationContexts',
    title: 'Custom Translation Contexts',
    filter: 'startWith',
    type: 'text',
    sortable: false,
    valueTransform: (_value, row) =>
      row.getIn(['space', 'customTranslationContexts']),
  },
  {
    value: 'space.defaultDatastoreFormConfirmationPage',
    title: 'Default Datastore Form Confirmation Page',
    filter: 'startWith',
    type: 'text',
    sortable: false,
    valueTransform: (_value, row) =>
      row.getIn(['space', 'defaultDatastoreFormConfirmationPage']),
  },
  {
    value: 'space.defaultDatastoreFormDisplayPage',
    title: 'Default Datastore Form Display Page',
    filter: 'startWith',
    type: 'text',
    sortable: false,
    valueTransform: (_value, row) =>
      row.getIn(['space', 'defaultDatastoreFormDisplayPage']),
  },
  {
    value: 'space.defaultLocale',
    title: 'Default Locale',
    filter: 'startWith',
    type: 'text',
    sortable: false,
    valueTransform: (_value, row) => row.getIn(['space', 'defaultLocale']),
  },
  {
    value: 'space.defaultTimezone',
    title: 'Default Timezone',
    filter: 'startWith',
    type: 'text',
    sortable: false,
    valueTransform: (_value, row) => row.getIn(['space', 'defaultTimezone']),
  },
  {
    value: 'space.displayType',
    title: 'Display Type',
    filter: 'startWith',
    type: 'text',
    sortable: false,
    valueTransform: (_value, row) => row.getIn(['space', 'displayType']),
  },
  {
    value: 'space.displayValue',
    title: 'Display Value',
    filter: 'startWith',
    type: 'text',
    sortable: false,
    valueTransform: (_value, row) => row.getIn(['space', 'displayValue']),
  },
  {
    value: 'space.enabledLocales',
    title: 'Enabled Locales',
    filter: 'startWith',
    type: 'text',
    sortable: false,
    valueTransform: (_value, row) => row.getIn(['space', 'enabledLocales']),
  },
  {
    value: 'space.loginPage',
    title: 'Login Page',
    filter: 'startWith',
    type: 'text',
    sortable: false,
    valueTransform: (_value, row) => row.getIn(['space', 'loginPage']),
  },
  {
    value: 'space.resetPasswordPage',
    title: 'Reset Password Page',
    filter: 'startWith',
    type: 'text',
    sortable: false,
    valueTransform: (_value, row) => row.getIn(['space', 'resetPasswordPage']),
  },
  {
    value: 'space.sessionInactiveLimitInSeconds',
    title: 'Session Inactive Limit in Seconds',
    filter: 'startWith',
    type: 'text',
    sortable: false,
    valueTransform: (_value, row) =>
      row.getIn(['space', 'sessionInactiveLimitInSeconds']),
  },
  {
    value: 'space.sharedBundleBase',
    title: 'Shared Bundle Base',
    filter: 'startWith',
    type: 'text',
    sortable: false,
    valueTransform: (_value, row) => row.getIn(['space', 'sharedBundleBase']),
  },
  {
    value: 'space.trustedFrameDomains',
    title: 'Trusted Frame Domains',
    filter: 'startWith',
    type: 'text',
    sortable: false,
    valueTransform: (_value, row) =>
      row.getIn(['space', 'trustedFrameDomains']),
  },
  {
    value: 'space.trustedResourceDomains',
    title: 'Trusted Resource Domains',
    filter: 'startWith',
    type: 'text',
    sortable: false,
    valueTransform: (_value, row) =>
      row.getIn(['space', 'trustedResourceDomains']),
  },

  /*
  value: 'space.trustedFrameDomains',
  value: 'space.trustedResourceDomains',
   */
];

export const SystemTenantTable = generateTable({
  columns,
  dataSource,
});

SystemTenantTable.displayName = 'SystemTenantTable';
