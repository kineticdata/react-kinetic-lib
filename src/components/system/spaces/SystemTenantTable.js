import { generateTable } from '../../table/Table';

const fetchSystemTenants = () =>
  Promise.resolve({
    spaces: [
      {
        slug: 'acme',
        name: 'ACME',
        status: 'pending',
        statusMessage: 'Still provisioning things.',
      },
      {
        slug: 'kinetic',
        name: 'Kinetic Data',
        status: 'active',
        statusMessage: 'Ready.',
      },
    ],
  });

const dataSource = () => ({
  fn: fetchSystemTenants,
  params: () => [],
  transform: result => ({
    data: result.spaces,
    nextPageToken: result.nextPageToken,
  }),
});

const columns = [
  {
    value: 'name',
    title: 'Name',
    filter: 'startWith',
    type: 'text',
    sortable: true,
  },
  {
    value: 'slug',
    title: 'Slug',
    filter: 'startWith',
    type: 'text',
    sortable: true,
  },
  {
    value: 'status',
    title: 'Status',
    filter: 'equals',
    type: 'text',
    sortable: true,
  },
  {
    value: 'statusMessage',
    title: 'Status Message',
    filter: 'startWith',
    type: 'text',
    sortable: false,
  },
];

export const SystemTenantTable = generateTable({
  columns,
  dataSource,
});

SystemTenantTable.displayName = 'SystemTenantTable';
