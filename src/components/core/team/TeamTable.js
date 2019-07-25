import React from 'react';
import { Map } from 'immutable';
import { Table } from '../../table/Table';
import { fetchTeams } from '../../../apis';

const startsWith = (field, value) => `${field} =* "${value}"`;
const equals = (field, value) => `${field} = "${value}"`;
const STARTS_WITH_FIELDS = [
  'createdAt',
  'localName',
  'name',
  'updatedAt',
  'parentName',
];

const teamFilter = filters => {
  const q = Map(filters)
    .filter(filter => filter.value !== '')
    .map((filter, key) =>
      STARTS_WITH_FIELDS.includes(key)
        ? startsWith(key, filter.value)
        : equals(key, filter.value),
    )
    .toIndexedSeq()
    .toList()
    .join(' AND ');

  return q.length > 0 ? { q } : {};
};

const dataSource = {
  fn: fetchTeams,
  params: ({ pageSize, filters }) => ({
    include: 'details',
    limit: pageSize,
    ...teamFilter(filters),
  }),
  transform: result => ({
    data: result.teams,
    nextPageToken: result.nextPageToken,
  }),
};

const columns = [
  {
    value: 'name',
    title: 'Name',
    filterable: true,
    sortable: true,
  },
  {
    value: 'updatedAt',
    title: 'Updated At',
    filterable: true,
    sortable: true,
  },
  {
    value: 'createdAt',
    title: 'Created At',
    filterable: true,
    sortable: true,
  },
  {
    value: 'description',
    title: 'Description',
    filterable: true,
    sortable: true,
  },
  {
    value: 'slug',
    title: 'Slug',
    filterable: true,
    sortable: true,
  },
];

export const TeamTable = props => (
  <Table
    tableKey={props.tableKey}
    components={{
      ...props.components,
    }}
    dataSource={dataSource}
    columns={columns}
    alterColumns={props.alterColumns}
    addColumns={props.addColumns}
    columnSet={props.columnSet}
    pageSize={props.pageSize}
  >
    {props.children}
  </Table>
);

TeamTable.defaultProps = {
  columns,
};

TeamTable.STARTS_WITH_FIELDS = STARTS_WITH_FIELDS;
