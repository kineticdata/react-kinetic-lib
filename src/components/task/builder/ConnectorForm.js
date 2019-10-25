import React from 'react';
import { generateForm } from '../../form/Form';
import { buildBindings } from './helpers';

const dataSources = ({ connector }) => {};

const fields = ({ connector, tasks, tree }) => () => [
  {
    name: 'type',
    label: 'Type',
    type: 'radio',
    required: true,
    options: [
      { label: 'Complete', value: 'Complete' },
      { label: 'Create', value: 'Create' },
      { label: 'Update', value: 'Update' },
    ],
    initialValue: connector ? connector.type : 'Complete',
  },
  {
    name: 'label',
    label: 'Label',
    type: 'text',
    initialValue: connector.label,
  },
  {
    name: 'condition',
    label: 'Condition',
    type: 'code',
    initialValue: connector.condition,
    language: 'ruby',
    options: buildBindings(tree, tasks, tree.nodes.get(connector.headId)),
  },
  {
    name: 'from',
    label: 'From Node',
    type: 'text',
    enabled: false,
    initialValue: connector.tailId,
  },
  {
    name: 'to',
    label: 'To Node',
    type: 'text',
    enabled: false,
    initialValue: connector.headId,
  },
  {
    name: 'id',
    label: 'Id',
    type: 'text',
    enabled: false,
    initialValue: connector.id,
  },
];

const handleSubmit = ({ connector }) => values => values.toObject();

export const ConnectorForm = generateForm({
  formOptions: ['connector', 'tasks', 'tree'],
  dataSources,
  fields,
  handleSubmit,
});

ConnectorForm.displayName = 'ConnectorForm';
