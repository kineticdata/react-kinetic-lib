import React from 'react';
import { Map } from 'immutable';
import Table from '../../common/tables/Table';
import { fetchKapps } from '../../../apis/core';

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

export const KappTable = props => (
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

KappTable.defaultProps = {
  columns,
};

KappTable.STARTS_WITH_FIELDS = STARTS_WITH_FIELDS;

export default KappTable;
