import React from 'react';
import { Map } from 'immutable';
import Table from '../../common/tables/Table';
import { fetchTeams } from '../../../apis/core';

const startsWith = (field, value) => `${field} =* "${value}"`;
const equals = (field, value) => `${field} = "${value}"`;
const STARTS_WITH_FIELDS = [
  'createdAt',
  'localNname',
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

const data = {
  dataSource: fetchTeams,
  params: ({ pageSize, sortColumn, sortDirection, filters }) => ({
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
    sortable: false,
  },
];

export const TeamTable = props => (
  <Table
    tableKey={props.tableKey}
    components={{
      ...props.components,
    }}
    data={data}
    columns={columns}
    alterColumns={props.alterColumns}
    addColumns={props.addColumns}
    columnSet={props.columnSet}
    pageSize={props.pageSize}
  >
    {props.children}
  </Table>
);

export default TeamTable;

TeamTable.defaultProps = {
  columns,
};

TeamTable.STARTS_WITH_FIELDS = STARTS_WITH_FIELDS;
