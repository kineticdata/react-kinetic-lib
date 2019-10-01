import React from 'react';
import { fetchTree, fetchSources } from '../../../apis';
import { Form } from '../../form/Form';

const dataSources = ({ workflowType, title }) => ({
  workflow: {
    fn: fetchTree,
    params: workflowType && [
      { type: workflowType || 'Tree', title, include: 'details' },
    ],
    transform: result => result.tree,
  },
  sources: {
    fn: fetchSources,
    params: [],
    transform: result =>
      result.sources.map(s => ({
        label: s.name === '-' ? 'Adhoc' : s.name,
        value: s.name,
      })),
  },
});

const handleSubmit = ({ title }) => values => {};

const fields = ({ title }) => ({ workflow }) => [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    required: true,
    initialValue: workflow ? workflow.get('name') : '',
  },
  {
    name: 'notes',
    label: 'Notes',
    type: 'text',
    required: true,
    initialValue: workflow ? workflow.get('notes') : '',
  },
  {
    name: 'ownerEmail',
    label: 'Process Owner Email',
    type: 'text',
    required: false,
    initialValue: workflow ? workflow.get('ownerEmail') : '',
  },
  {
    name: 'sourceName',
    label: 'Source',
    type: 'select',
    required: false,
    options: ({ sources }) => sources,
    initialValue: workflow ? workflow.get('sourceName') : '',
  },
  {
    name: 'sourceGroup',
    label: 'Source Group',
    type: 'text',
    required: false,
    initialValue: workflow ? workflow.get('sourceGroup') : '',
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    required: false,
    options: [
      { label: 'Active', value: 'Active' },
      { label: 'Inactive', value: 'Inactive' },
      { label: 'Paused', value: 'Paused' },
    ],
    initialValue: workflow ? workflow.get('status') : '',
  },
];

export const TreeForm = ({
  addFields,
  alterFields,
  fieldSet,
  formKey,
  components,
  onSave,
  onError,
  children,
  workflowType,
  title,
}) => (
  <Form
    addFields={addFields}
    alterFields={alterFields}
    fieldSet={fieldSet}
    formKey={formKey}
    components={components}
    onSubmit={handleSubmit}
    onSave={onSave}
    onError={onError}
    dataSources={dataSources}
    fields={fields}
    formOptions={{ workflowType, title }}
  >
    {children}
  </Form>
);
