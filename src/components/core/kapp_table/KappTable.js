import React, { Component } from 'react';
import { Map } from 'immutable';
import Table from '../../common/tables/Table';
import { fetchKapps } from '../../../apis/core';

const tableKey = 'kapp-table';

const startsWith = (field, value) => `${field} =* "${value}"`;
const equals = (field, value) => `${field} = "${value}"`;
const STARTS_WITH_FIELDS = ['slug', 'name'];

const kappFilter = filters => {
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
  dataSource: fetchKapps,
  params: ({ pageSize, sortColumn, sortDirection, filters }) => ({
    include: 'details',
    limit: pageSize,
    ...kappFilter(filters),
  }),
  transform: result => ({
    data: result.kapps,
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
    value: 'slug',
    title: 'Slug',
    filterable: true,
    sortable: true,
  },
  {
    value: 'CreatedAt',
    title: 'Created At',
    sortable: true,
  },
  {
    value: 'createdBy',
    title: 'Created By',
  },
  {
    value: 'updatedAt',
    title: 'Last Modified',
    sortable: true,
  },
  {
    value: 'updatedBy',
    title: 'Updated By',
  },
  {
    value: 'resetPasswordPage',
    title: 'Reset Password Page',
  },

  { value: 'afterLogoutPath', title: 'After Logout Path' },
  { value: 'bundlePath', title: 'Bundle Path' },
  { value: 'defaultFormConfirmationPage', title: 'Form Confirmation Page' },
  { value: 'defaultFormDisplayPage', title: 'Form Display Page' },
  { value: 'defaultSubmissionLabelExpression', title: 'Submission Label' },
  { value: 'displayType', title: 'Display Type' },
  { value: 'displayValue', title: 'Display Value' },
  { value: 'loginPage', title: 'Login Page' },
  { value: 'resetPasswordPage', title: 'Reset Password Page' },
];

export default class KappTable extends Component {
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
        alterColumns={this.props.alterColumns}
        addColumns={this.props.addColumns}
        columnSet={this.props.columnSet}
        pageSize={this.props.pageSize}
      >
        {this.props.children}
      </Table>
    );
  }
}

KappTable.defaultProps = {
  columns,
};

KappTable.STARTS_WITH_FIELDS = STARTS_WITH_FIELDS;
