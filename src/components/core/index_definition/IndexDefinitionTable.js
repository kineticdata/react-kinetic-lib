import React from 'react';
import { generateTable } from '../../table/Table';
import { fetchForm } from '../../../apis';
import { defineFilter } from '../../../helpers';

const clientSide = defineFilter(true)
  .startsWith('name', 'name')
  .equals('status', 'status')
  .equals('unique', 'unique')
  .end();

const indexStatuses = ['New', 'Building', 'Built', 'Failed'];

const BooleanYesNoCell = props => <td>{props.value ? 'Yes' : 'No'}</td>;

const dataSource = ({ formSlug }) => ({
  fn: fetchForm,
  clientSide,
  params: () => [
    {
      datastore: true,
      kappSlug: null,
      formSlug,
      include: 'indexDefinitions',
    },
  ],
  transform: result => ({
    data: result.form.indexDefinitions,
  }),
});

const filters = () => () => [
  { name: 'name', label: 'Name', type: 'text' },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: indexStatuses.map(el => ({ value: el, label: el })),
  },
  {
    name: 'unique',
    label: 'Unique',
    type: 'select',
    options: ['Yes', 'No'].map(el => ({ value: el, label: el })),
  },
];

const columns = [
  {
    value: 'name',
    title: 'Name',
  },
  {
    value: 'status',
    title: 'Status',
  },
  {
    value: 'unique',
    title: 'Unique',
    components: {
      BodyCell: BooleanYesNoCell,
    },
  },
  {
    value: 'parts',
    title: 'Parts',
  },
];

export const IndexDefinitionTable = generateTable({
  tableOptions: ['formSlug'],
  sortable: false,
  columns,
  // filters,
  dataSource,
});

IndexDefinitionTable.displayName = 'IndexDefinitionTable';
