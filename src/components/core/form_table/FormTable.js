import React from 'react';
import { Map } from 'immutable';
import Table from '../../common/tables/Table';
import { fetchForms } from '../../../apis/core';
import t from 'prop-types';

const startsWith = (field, value) => `${field} =* "${value}"`;
const equals = (field, value) => `${field} = "${value}"`;
const STARTS_WITH_FIELDS = ['slug', 'name', 'status', 'category', 'type'];
const VALID_FORM_STATUES = ['New', 'Active', 'Inactive', 'Delete'];

const formFilter = filters => {
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

const dataSource = ({ kappSlug = null, datastore }) => ({
  dataSource: fetchForms,
  params: ({ pageSize, sortColumn, sortDirection, filters }) => ({
    include: 'details',
    limit: pageSize,
    datastore,
    kappSlug,
    ...formFilter(filters),
  }),
  transform: result => ({
    data: result.forms,
    nextPageToken: result.nextPageToken,
  }),
});

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
    filterable: true,
  },
  {
    value: 'createdBy',
    title: 'Created By',
  },
  {
    value: 'updatedAt',
    title: 'Last Modified',
    sortable: true,
    filterable: true,
  },
  {
    value: 'updatedBy',
    title: 'Updated By',
    sortable: true,
  },
  {
    value: 'notes',
    title: 'Notes',
  },
  { value: 'status', title: 'Status', sortable: true, filterable: true },
  { value: 'submissionLabelExpression', title: 'Submission Label' },
  { value: 'type', title: 'Type', sortable: true, filterable: true },
];

export const FormTable = props => (
  <Table
    tableKey={props.tableKey}
    components={{
      ...props.components,
    }}
    data={dataSource({
      kappSlug: props.kappSlug,
      datastore: props.datastore,
    })}
    columns={columns}
    alterColumns={props.alterColumns}
    addColumns={props.addColumns}
    columnSet={props.columnSet}
    pageSize={props.pageSize}
  >
    {props.children}
  </Table>
);

export default FormTable;

FormTable.defaultProps = {};

FormTable.propTypes = {
  /** Kapp Slug of associated forms to render.  */
  kappSlug: t.string,
  /** If datastore forms should be rendered.  */
  datastore: t.bool,
};

FormTable.STARTS_WITH_FIELDS = STARTS_WITH_FIELDS;
FormTable.VALID_FORM_STATUES = VALID_FORM_STATUES;
