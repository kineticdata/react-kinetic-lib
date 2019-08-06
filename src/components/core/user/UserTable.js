import React from 'react';
import { generateTable } from '../../table/Table';
import { fetchUsers, generateCESearchParams } from '../../../apis';

const dataSource = () => ({
  fn: fetchUsers,
  params: paramData => [
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
    title: 'Created At',
    filter: 'equals',
    type: 'text',
    sortable: true,
  },
  {
    value: 'updatedAt',
    title: 'Updated At',
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

export const UserTable = generateTable({ columns, dataSource });

UserTable.displayName = 'UserTable';
