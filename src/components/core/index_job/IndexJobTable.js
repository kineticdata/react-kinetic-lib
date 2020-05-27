import React from 'react';
import { fetchBackgroundJobs, fetchForm } from '../../../apis';
import { generateTable } from '../../table/Table';

const dataSource = ({ formSlug }) => ({
  fn: () =>
    formSlug
      ? fetchForm({ datastore: true, formSlug, include: 'backgroundJobs' })
      : fetchBackgroundJobs(),
  clientSideSearch: true,
  params: () => [],
  transform: result => ({
    data: formSlug ? result.form.backgroundJobs : result.backgroundJobs,
  }),
});

const columns = [
  {
    value: 'content',
    title: 'Content',
    components: {
      BodyCell: props => <td>{JSON.stringify(props.value)}</td>,
    },
    sortable: false,
    filterable: false,
  },
  {
    value: 'hung',
    title: 'Hung?',
  },
  { value: 'id', title: 'Job ID' },
  { value: 'message', title: 'Message' },
  { value: 'parent', title: 'Parent' },
  { value: 'parentType', title: 'Parent Type' },
  {
    value: 'progress',
    title: 'Progress',
    components: {
      BodyCell: props => (
        <td>
          {props.value && props.value.get('count')
            ? `${props.value.get('count')} submissions`
            : 'None'}
        </td>
      ),
    },
  },
  { value: 'startedAt', title: 'Started At' },
  { value: 'startedBy', title: 'Started By' },
  { value: 'status', title: 'Status' },
  { value: 'type', title: 'Type' },
];

export const IndexJobTable = generateTable({
  tableOptions: ['formSlug'],
  dataSource,
  columns,
  sortable: false,
});
IndexJobTable.displayName = 'IndexJobTable';
