import React from 'react';
import { fetchTree, fetchSources, updateTree, createTree } from '../../../apis';
import { Form } from '../../form/Form';
import { get } from 'immutable';

const dataSources = ({ workflowType, itemId }) => {
  return {
    workflow: {
      fn: fetchTree,
      params: itemId && [
        {
          type: workflowType || 'Tree',
          itemId,
          include: 'details,inputs,outputs',
        },
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
  };
};

const handleSubmit = ({ itemId }) => values =>
  new Promise((resolve, reject) => {
    const tree = values.toJS();
    (itemId ? updateTree({ itemId, tree }) : createTree({ tree })).then(
      ({ tree, error }) => {
        if (tree) {
          resolve(tree);
        } else {
          reject(error.message || 'There was an error saving the workflow');
        }
      },
    );
  });

const fields = ({ itemId, workflowType }) => ({ workflow }) =>
  (!itemId || workflow) && [
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
      required: false,
      initialValue: get(workflow, 'notes', '') || '',
    },
    workflowType !== 'trees' && {
      name: 'definitionId',
      label: 'Definition ID',
      type: 'text',
      enabled: false,
      required: false,
      initialValue: get(workflow, 'definitionId', '') || '',
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
      initialValue: get(workflow, 'status', ''),
    },
    workflowType !== 'trees' && {
      name: 'inputs',
      label: 'Inputs',
      type: 'table',
      options: [
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'defaultValue', label: 'Default Value', type: 'text' },
        { name: 'description', label: 'Description', type: 'text' },
        { name: 'required', label: 'Required', type: 'checkbox' },
      ],
      initialValue: get(workflow, 'inputs', []),
    },
    workflowType !== 'trees' && {
      name: 'outputs',
      label: 'Outputs',
      type: 'table',
      options: [
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'description', label: 'Description', type: 'text' },
      ],
      initialValue: get(workflow, 'outputs', []),
    },
  ];

export const WorkflowForm = ({
  addFields,
  alterFields,
  fieldSet,
  formKey,
  components,
  onSave,
  onError,
  children,
  workflowType,
  itemId,
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
    formOptions={{ workflowType, itemId }}
  >
    {children}
  </Form>
);
