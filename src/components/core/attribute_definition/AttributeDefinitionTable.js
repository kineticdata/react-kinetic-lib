import React from 'react';
import t from 'prop-types';
import { Table } from '../../table/Table';
import { fetchAttributeDefinitions } from '../../../apis';

const dataSource = ({ kappSlug, attributeType }) => ({
  fn: fetchAttributeDefinitions,
  clientSideSearch: true,
  params: () => ({
    include: 'details',
    kappSlug,
    attributeType,
  }),
  transform: result => {
    return {
      data: result.attributeDefinitions,
    };
  },
});

export const columns = [
  {
    value: 'name',
    title: 'Name',
    filterable: false,
    sortable: false,
  },
  {
    value: 'description',
    title: 'Description',
    filterable: false,
    sortable: false,
  },
  {
    value: 'allowsMultiple',
    title: 'Allows Multiple',
    filterable: false,
    sortable: false,
  },
];

export const AttributeDefinitionTable = props => (
  <Table
    tableKey={props.tableKey}
    components={{
      ...props.components,
    }}
    dataSource={dataSource({
      kappSlug: props.kappSlug,
      attributeType: props.attributeType,
    })}
    columns={columns}
    addColumns={props.addColumns}
    alterColumns={props.alterColumns}
    columnSet={props.columnSet}
    pageSize={props.pageSize}
  >
    {props.children}
  </Table>
);

AttributeDefinitionTable.propTypes = {
  /** The Slug of the kapp required if the type of attribute is scoped to a kapp (ie, category * kapp attributes) */
  kappSlug: t.string,
  /** The type of attribute definition to display.   */
  attributeType: t.oneOf([
    'spaceAttributeDefinitions',
    'teamAttributeDefinitions',
    'userAttributeDefinitions',
    'userProfileAttributeDefinitions',
    'categoryAttributeDefinitions',
    'kappAttributeDefinitions',
    'formAttributeDefinitions',
    'datastoreFormAttributeDefinitions',
  ]).isRequired,
  /** The columns that should be displayed.   */
  columnSet: t.arrayOf(t.string),
};
