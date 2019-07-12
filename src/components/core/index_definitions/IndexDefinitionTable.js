import React from 'react';
import Table from '../../common/tables/Table';
import { fetchForm } from '../../../apis/core';

const BooleanYesNoCell = props => <td>{props.value ? 'Yes' : 'No'}</td>;

const dataSource = ({ formSlug }) => ({
  fn: fetchForm,
  clientSideSearch: true,
  params: () => ({
    datastore: true,
    kappSlug: null,
    formSlug,
    include: 'indexDefinitions',
  }),
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

const IndexDefinitionTable = props => (
  <Table
    tableKey={props.tableKey}
    components={{
      ...props.components,
    }}
    dataSource={dataSource({
      formSlug: props.formSlug,
    })}
    sortable={false}
    columns={columns}
    addColumns={props.addColumns}
    alterColumns={props.alterColumns}
    columnSet={props.columnSet}
    pageSize={props.pageSize}
  >
    {props.children}
  </Table>
);

export default IndexDefinitionTable;
