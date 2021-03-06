import React from 'react';
import { fetchBackgroundJobs, fetchForm } from '../../../apis';
import { generateTable } from '../../table/Table';
import { defineFilter } from '../../../helpers';

const clientSide = defineFilter(true)
  .equals('status', 'status')
  .between('startedAt', 'minStartedAt', 'maxStartedAt')
  .end();

const indexJobStatuses = ['Running', 'Paused'];

const dataSource = ({ formSlug }) => ({
  fn: () =>
    formSlug
      ? fetchForm({ datastore: true, formSlug, include: 'backgroundJobs' })
      : fetchBackgroundJobs(),
  clientSide,
  params: () => [],
  transform: result => ({
    data: formSlug ? result.form.backgroundJobs : result.backgroundJobs,
  }),
});

const filters = () => () => [
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: indexJobStatuses.map(el => ({ value: el, label: el })),
  },
  {
    name: 'minStartedAt',
    label: 'Start',
    type: 'date',
  },
  {
    name: 'maxStartedAt',
    label: 'End',
    type: 'date',
  },
];

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
  filters,
  sortable: false,
});
IndexJobTable.displayName = 'IndexJobTable';
