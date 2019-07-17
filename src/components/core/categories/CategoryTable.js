import React from 'react';
import Table from '../../common/tables/Table';
import { fetchCategories } from '../../../apis/core';

const dataSource = ({ kappSlug }) => ({
  fn: fetchCategories,
  clientSideSearch: true,
  params: () => ({ include: 'details', kappSlug }),
  transform: result => ({ data: result.categories }),
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
    filterable: false,
    sortable: true,
  },
  {
    value: 'createdAt',
    title: 'Created At',
    filterable: false,
    sortable: true,
  },
  {
    value: 'createdBy',
    title: 'Created By',
    filterable: false,
    sortable: true,
  },
  {
    value: 'updatedAt',
    title: 'Updated At',
    filterable: false,
    sortable: true,
  },
  {
    value: 'updatedBy',
    title: 'Updated By',
    filterable: false,
    sortable: true,
  },
];

export const CategoryTable = props => (
  <Table
    tableKey={props.tableKey}
    addColumns={props.addColumns}
    alterColumns={props.alterColumns}
    columns={columns}
    columnSet={props.columnSet}
    components={props.components}
    dataSource={dataSource({
      kappSlug: props.kappSlug,
    })}
  >
    {props.children}
  </Table>
);

export default CategoryTable;
