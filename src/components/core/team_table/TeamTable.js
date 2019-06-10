import React, { Component } from 'react';
import { Map } from 'immutable';
import Table from '../../common/tables/Table';
import { fetchTeams } from '../../../apis/core';

const tableKey = 'team-table';

const startsWith = (field, value) => `${field} =* "${value}"`;
const equals = (field, value) => `${field} = "${value}"`;
const STARTS_WITH_FIELDS = ['username']; // Needs to be changed

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
    title: 'Team',
    filterable: true,
    sortable: false,
  },
];

export default class TeamTable extends Component {
  componentDidMount() {
    Table.mount(tableKey);
  }

  componentWillUnmount() {
    Table.unmount(tableKey);
  }

  render() {
    return (
      <Table
        tableKey={tableKey}
        components={{
          ...this.props.components,
        }}
        data={data}
        columns={columns}
        addColumns={this.props.addColumns}
        columnSet={this.props.columnSet}
        pageSize={this.props.pageSize}
      >
        {this.props.children}
      </Table>
    );
  }
}

TeamTable.defaultProps = {
  columns,
};

TeamTable.STARTS_WITH_FIELDS = STARTS_WITH_FIELDS;
