import React from 'react';
import { generateForm } from '../../form/Form';

const dataSources = ({ node }) => {};

const fields = ({ node }) => () => [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    initialValue: node.name,
  },
  {
    name: 'defers',
    label: 'Defers',
    type: 'checkbox',
    initialValue: node.defers,
  },
  {
    name: 'visible',
    label: 'Visible',
    type: 'checkbox',
    initialValue: node.visible,
  },
  {
    name: 'parameter',
    label: 'Parameter',
    type: 'code',
    initialValue: node.parameter,
  },
  {
    name: 'id',
    label: 'Id',
    type: 'text',
    enabled: false,
    initialValue: node.id,
  },
];

const handleSubmit = ({ node }) => values => values.toObject();

export const NodeForm = generateForm({
  formOptions: ['node'],
  dataSources,
  fields,
  handleSubmit,
});

NodeForm.displayName = 'NodeForm';
