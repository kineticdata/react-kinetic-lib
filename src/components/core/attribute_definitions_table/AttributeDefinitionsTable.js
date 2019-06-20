import React, { Component } from 'react';
import Table from '../../common/tables/Table';
import { fetchAttributeDefinitions } from '../../../apis/core';

const tableKey = 'attribute-definition-table';

const dataSource = ({ attributeType }) => ({
  dataSource: fetchAttributeDefinitions,
  params: ({ pageSize }) => ({
    include: 'details',
    limit: pageSize,
    attributeType,
  }),
  transform: result => {
    return {
      data: result.attributeDefinitions,
    };
  },
});

const columns = [
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
];

export default class AttributeDefinitionsTable extends Component {
  render() {
    return (
      <Table
        tableKey={this.props.tableKey}
        components={{
          ...this.props.components,
        }}
        data={dataSource({
          attributeType: this.props.attributeType,
        })}
        columns={columns}
        addColumns={this.props.addColumns}
        columnSet={this.props.columnSet}
        pageSize={this.props.pageSize}
      >
        {this.props.children}
      </Table>
    );
  }
}

AttributeDefinitionsTable.defaultProps = {
  columns,
};
