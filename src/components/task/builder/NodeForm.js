import React from 'react';
import { List } from 'immutable';
import { generateForm } from '../../form/Form';
import { NodeMessage } from './models';
import { buildBindings } from './helpers';

const dataSources = ({ node }) => {};

const getOptions = menu =>
  menu
    .split(',')
    .filter(value => !!value)
    .map(value => ({ label: value, value }));

const checkDependsOn = parameter =>
  !parameter.dependsOnId ||
  (({ values }) =>
    values.get(`parameter_${parameter.dependsOnId}`) ===
    parameter.dependsOnValue);

const fields = ({ tasks, tree, node }) => () => [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    initialValue: node.name,
    required: true,
  },
  node.deferrable && {
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
    name: 'definitionId',
    label: 'Task Definition Id',
    type: 'text',
    initialValue: node.definitionId,
    enabled: false,
  },
  {
    name: 'id',
    label: 'Id',
    type: 'text',
    enabled: false,
    initialValue: node.id,
  },
  ...node.parameters.map(parameter => ({
    name: `parameter_${parameter.id}`,
    label: parameter.label,
    type: parameter.menu ? 'select' : 'code',
    language: parameter.menu ? null : 'erb',
    helpText: parameter.description,
    initialValue: parameter.value,
    options: parameter.menu
      ? getOptions(parameter.menu)
      : buildBindings(tree, tasks, node),
    required: parameter.required,
    transient: true,
    visible: checkDependsOn(parameter),
  })),
  {
    name: 'parameters',
    type: null,
    visible: false,
    serialize: ({ values }) =>
      node.parameters.map(parameter =>
        parameter.set('value', values.get(`parameter_${parameter.id}`)),
      ),
  },
  {
    name: 'message_Create',
    label: 'Create Message',
    type: 'code',
    initialValue: node.messages
      .filter(message => message.type === 'Create')
      .map(message => message.value)
      .first(''),
    language: 'erb',
    options: buildBindings(tree, tasks, node),
    transient: true,
    visible: ({ values }) => values.get('defers', false),
  },
  {
    name: 'message_Update',
    label: 'Update Message',
    type: 'code',
    initialValue: node.messages
      .filter(message => message.type === 'Update')
      .map(message => message.value)
      .first(''),
    language: 'erb',
    options: buildBindings(tree, tasks, node),
    transient: true,
    visible: ({ values }) => values.get('defers', false),
  },
  {
    name: 'message_Complete',
    label: 'Complete Message',
    type: 'code',
    initialValue: node.messages
      .filter(message => message.type === 'Complete')
      .map(message => message.value)
      .first(''),
    language: 'erb',
    options: buildBindings(tree, tasks, node),
    transient: true,
  },
  {
    name: 'messages',
    type: null,
    visible: false,
    serialize: ({ values }) =>
      List(
        values.get('defers') ? ['Create', 'Update', 'Complete'] : ['Complete'],
      )
        .map(type =>
          values.get(`message_${type}`)
            ? NodeMessage({ type, value: values.get(`message_${type}`) })
            : null,
        )
        .filter(message => message),
  },
];

const handleSubmit = ({ node }) => values => values.toObject();

export const NodeForm = generateForm({
  formOptions: ['node', 'tasks', 'tree'],
  dataSources,
  fields,
  handleSubmit,
});

NodeForm.displayName = 'NodeForm';
