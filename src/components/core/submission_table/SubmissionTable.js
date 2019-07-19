import React from 'react';
import { Map } from 'immutable';
import Table from '../../common/tables/Table';
import { searchSubmissions, SubmissionSearch } from '../../../apis/core';

const startsWith = (field, value) => `${field} =* "${value}"`;
const equals = (field, value) => `${field} = "${value}"`;
const STARTS_WITH_FIELDS = ['username', 'email', 'displayName'];

const submissionsFilter = (filters, props) => {
  const {
    include = ['details'],
    kappSlug,
    formSlug,
    datastore = false,
  } = props;

  const query = new SubmissionSearch(datastore);

  query.includes(include);
  // const q = Map(filters)
  //   .filter(filter => filter.value !== '')
  //   .map((filter, key) =>
  //     STARTS_WITH_FIELDS.includes(key)
  //       ? startsWith(key, filter.value)
  //       : equals(key, filter.value),
  //   )
  //   .toIndexedSeq()
  //   .toList()
  //   .join(' AND ');

  // return q.length > 0 ? { q } : {};
  return { search: query.build() };
};

const dataSource = props => ({
  fn: searchSubmissions,
  params: ({ pageSize, filters }) => ({
    include: 'details',
    limit: pageSize,
    datastore: props.datastore,
    kapp: props.kappSlug ? props.kappSlug : null,
    form: props.formSlug,
    ...submissionsFilter(filters, props),
  }),
  transform: result => ({
    data: result.submissions,
    nextPageToken: result.nextPageToken,
  }),
});

const columns = [
  {
    value: 'closedAt',
    title: 'Closed At',
    filterable: true,
    sortable: true,
  },
  {
    value: 'closedBy',
    title: 'closedBy',
    filterable: true,
    sortable: false,
  },
  {
    value: 'coreState',
    title: 'Core State',
    filterable: true,
    sortable: false,
  },
  {
    value: 'createdAt',
    title: 'Created At',
    filterable: true,
    sortable: true,
  },
  {
    value: 'createdBy',
    title: 'Created By',
    filterable: true,
    sortable: false,
  },
  {
    value: 'currentPage',
    title: 'Current Page',
    filterable: false,
    sortable: false,
  },
  {
    value: 'handle',
    title: 'Handle',
    filterable: true,
    sortable: false,
  },
  {
    value: 'id',
    title: 'Id',
    filterable: true,
    sortable: false,
  },
  {
    value: 'label',
    title: 'Label',
    filterable: false,
    sortable: false,
  },
  {
    value: 'origin',
    title: 'Origin',
    filterable: false,
    sortable: false,
  },
  {
    value: 'parent',
    title: 'Parent',
    filterable: false,
    sortable: false,
  },
  {
    value: 'sessionToken',
    title: 'Session Token',
    filterable: false,
    sortable: false,
  },
  {
    value: 'submittedAt',
    title: 'Submitted At',
    filterable: true,
    sortable: true,
  },
  {
    value: 'submittedBy',
    title: 'Submitted By',
    filterable: true,
    sortable: false,
  },
  {
    value: 'type',
    title: 'Type',
    filterable: true,
    sortable: false,
  },
  {
    value: 'updatedAt',
    title: 'Updated At',
    filterable: true,
    sortable: true,
  },
  {
    value: 'updatedBy',
    title: 'Updated By',
    filterable: true,
    sortable: false,
  },
  {
    value: 'values',
    title: 'Values',
    sortable: false,
    filterable: false,
  },
];

export const SubmissionTable = props => (
  <Table
    tableKey={props.tableKey}
    components={{
      ...props.components,
    }}
    dataSource={dataSource(props)}
    columns={columns}
    addColumns={props.addColumns}
    alterColumns={props.alterColumns}
    columnSet={props.columnSet}
    pageSize={props.pageSize}
  >
    {props.children}
  </Table>
);

export default SubmissionTable;

SubmissionTable.STARTS_WITH_FIELDS = STARTS_WITH_FIELDS;
