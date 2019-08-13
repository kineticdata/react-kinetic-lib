import React from 'react';
import { generateTable } from '../../table/Table';
import { fetchForm } from '../../../apis';

const BooleanYesNoCell = props => <td>{props.value ? 'Yes' : 'No'}</td>;

const dataSource = ({ formSlug }) => ({
  fn: fetchForm,
  clientSideSearch: true,
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
  dataSource,
});

IndexDefinitionTable.displayName = 'IndexDefinitionTable';
