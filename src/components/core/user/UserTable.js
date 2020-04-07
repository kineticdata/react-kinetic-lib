import React from 'react';
import { generateTable } from '../../table/Table';
import { fetchUsers, generateCESearchParams } from '../../../apis';

const users = [
  {
    allowedIps: '',
    displayName: 'Fake User',
    email: 'fake.user@kineticdata.com',
    enabled: true,
    preferredLocale: null,
    spaceAdmin: false,
    timezone: null,
    username: 'fake.user@kineticdata.com',
    createdAt: '2019-08-19T20:30:47.818Z',
    createdBy: 'admin',
    updatedAt: '2019-11-19T20:30:47.818Z',
    updatedBy: 'matt',
  },
];
const fetchSystemUsers = () => Promise.resolve({ users });

const dataSource = ({ system }) => ({
  fn: system ? fetchSystemUsers : fetchUsers,
  params: paramData =>
    system
      ? [{ include: 'details' }]
      : [
          {
            ...generateCESearchParams(paramData),
            include: 'details',
          },
        ],
  transform: result => ({
    data: result.users,
    nextPageToken: result.nextPageToken,
  }),
});

const BooleanYesNoCell = props => <td>{props.value ? 'Yes' : 'No'}</td>;

const columns = [
  {
    value: 'username',
    title: 'Username',
    filter: 'startsWith',
    type: 'text',
    sortable: true,
  },
  {
    value: 'email',
    title: 'Email',
    filter: 'startsWith',
    type: 'text',
    sortable: true,
  },
  {
    value: 'displayName',
    title: 'Display Name',
    filter: 'startsWith',
    type: 'text',
    sortable: true,
  },
  {
    value: 'createdAt',
    title: 'Created',
    filter: 'equals',
    type: 'text',
    sortable: true,
  },
  {
    value: 'updatedAt',
    title: 'Updated',
    filter: 'equals',
    type: 'text',
    sortable: true,
  },
  {
    value: 'enabled',
    title: 'Enabled?',
    sortable: false,
    filter: 'equals',
    type: 'boolean',
    components: {
      BodyCell: BooleanYesNoCell,
    },
  },
  {
    value: 'spaceAdmin',
    title: 'Space Admin?',
    sortable: false,
    filter: 'equals',
    type: 'boolean',
    components: {
      BodyCell: BooleanYesNoCell,
    },
  },
];

export const UserTable = generateTable({
  tableOptions: ['system', 'spaceSlug'],
  columns,
  dataSource,
});

UserTable.displayName = 'UserTable';
