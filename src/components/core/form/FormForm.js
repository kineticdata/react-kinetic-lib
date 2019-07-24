import React from 'react';
import { get, Map } from 'immutable';
import { Form } from '../../form/Form';
import {
  fetchForm,
  fetchKapp,
  updateForm,
  createForm,
  fetchAttributeDefinitions,
  fetchSecurityPolicyDefinitions,
  fetchCategories,
} from '../../../apis';
import { slugify } from '../../../helpers';

const FORM_STATUSES = ['New', 'Active', 'Inactive', 'Delete'];

const dataSources = ({ formSlug, kappSlug, datastore }) => ({
  form: [
    fetchForm,
    [
      {
        datastore,
        formSlug,
        kappSlug,
        include:
          'details,attributesMap,securityPolicies,indexDefinitions,backgroundJobs,fields,categorizations',
      },
    ],
    { transform: result => result.form, runIf: () => !!formSlug },
  ],
  kapp: [
    fetchKapp,
    [
      {
        kappSlug,
        include: 'formTypes',
      },
    ],
    { transform: result => result.kapp, runIf: () => !!kappSlug },
  ],
  attributeDefinitions: [
    fetchAttributeDefinitions,
    [
      {
        kappSlug,
        formSlug,
        attributeType: datastore
          ? 'datastoreFormAttributeDefinitions'
          : 'formAttributeDefinitions',
      },
    ],
    {
      transform: result => result.attributeDefinitions,
    },
  ],
  securityPolicyDefinitions: [
    fetchSecurityPolicyDefinitions,
    [{ kappSlug }],
    {
      transform: result => result.securityPolicyDefinitions,
    },
  ],
  categories: [
    fetchCategories,
    [{ kappSlug }],
    {
      transform: result => result.categories,
      runIf: () => !!kappSlug,
    },
  ],
});

const handleSubmit = ({ formSlug, kappSlug, datastore }) => values =>
  (formSlug ? updateForm : createForm)({
    datastore,
    kappSlug,
    formSlug,
    form: values.toJS(),
  }).then(({ form, error }) => {
    if (error) {
      throw (error.statusCode === 400 && error.message) ||
        'There was an error saving the form';
    }
    return form;
  });

const securityEndpoints = {
  formDisplay: {
    endpoint: 'Display',
    label: 'Form Display',
    types: ['Space', 'Kapp', 'Form', 'Datastore Form'],
  },
  formModification: {
    endpoint: 'Modification',
    label: 'Form Modification',
    types: ['Space', 'Kapp', 'Form', 'Datastore Form'],
  },
  submissionAccess: {
    endpoint: 'Submission Access',
    label: 'Submission Access',
    types: [
      'Space',
      'Kapp',
      'Form',
      'Datastore Form',
      'Submission',
      'Datastore Submission',
    ],
  },
  submissionModification: {
    endpoint: 'Submission Modification',
    label: 'Submission Modification',
    types: [
      'Space',
      'Kapp',
      'Form',
      'Datastore Form',
      'Submission',
      'Datastore Submission',
    ],
  },
};

const fields = ({ formSlug, kappSlug, datastore }) => [
  !!kappSlug && {
    name: 'anonymous',
    label: 'Anonymous',
    type: 'checkbox',
    initialValue: ({ form }) => get(form, 'anonymous', false),
  },
  {
    name: 'description',
    label: 'Description',
    type: 'text',
    initialValue: ({ form }) => get(form, 'description'),
  },
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    required: true,
    onChange: ({ values }, { setValue }) => {
      if (values.get('linked')) {
        setValue('slug', slugify(values.get('name')), false);
      }
    },
    initialValue: ({ form }) => get(form, 'name'),
  },
  {
    name: 'notes',
    label: 'Notes',
    type: 'text',
    initialValue: ({ form }) => get(form, 'notes'),
  },
  {
    name: 'slug',
    label: 'Slug',
    type: 'text',
    required: true,
    onChange: (_bindings, { setValue }) => {
      setValue('linked', false);
    },
    initialValue: ({ form }) => get(form, 'slug'),
  },
  {
    name: 'linked',
    label: 'Linked',
    type: 'checkbox',
    transient: true,
    initialValue: ({ form }) => (get(form, 'slug') ? false : true),
    visible: false,
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: FORM_STATUSES.map(status => ({
      value: status,
      label: status,
    })),
    initialValue: ({ form }) => get(form, 'status') || 'New',
  },
  {
    name: 'submissionLabelExpression',
    label: 'Submission Label',
    type: 'text',
    initialValue: ({ form }) => get(form, 'submissionLabelExpression'),
  },
  !!kappSlug && {
    name: 'type',
    label: 'Type',
    type: 'select',
    options: ({ kapp }) =>
      kapp
        ? get(kapp, 'formTypes').map(type => ({
            value: type.get('name'),
            label: type.get('name'),
          }))
        : [],
    initialValue: ({ form }) => get(form, 'type'),
  },
  ...(formSlug
    ? Object.entries(securityEndpoints).map(
        ([endpointFieldName, endpoint]) => ({
          name: endpointFieldName,
          label: endpoint.label,
          type: 'select',
          options: ({ securityPolicyDefinitions }) =>
            securityPolicyDefinitions
              ? securityPolicyDefinitions
                  .filter(definition =>
                    endpoint.types.includes(definition.get('type')),
                  )
                  .map(definition => ({
                    value: definition.get('name'),
                    label: definition.get('name'),
                  }))
              : [],
          initialValue: ({ form }) =>
            form
              ? form
                  .get('securityPolicies')
                  .find(
                    pol => pol.get('endpoint') === endpoint.endpoint,
                    null,
                    Map(), // If no Security Endpoints were ever set, we need to default to an empty map so the next line doesn't fail
                  )
                  .get('name')
              : '',
          transient: true,
        }),
      )
    : []),
  {
    name: 'securityPolicies',
    label: 'Security Policies',
    type: null,
    visible: false,
    serialize: ({ values }) =>
      Object.entries(securityEndpoints)
        .map(([endpointFieldName, policy]) => ({
          endpoint: policy.endpoint,
          name: values.get(endpointFieldName),
        }))
        .filter(endpoint => endpoint.name !== ''),
    initialValue: ({ form }) => get(form, 'securityPolicies'),
  },
  {
    name: 'attributesMap',
    label: 'Attributes',
    type: 'attributes',
    required: false,
    options: ({ attributeDefinitions }) => attributeDefinitions,
    initialValue: ({ form }) => get(form, 'attributesMap'),
  },
  !!kappSlug && {
    name: 'categorizations',
    label: 'Categories',
    type: 'select-multi',
    options: ({ categories }) =>
      categories.map(category => ({
        label: category.get('name'),
        value: category.get('slug'),
      })),
    initialValue: ({ form }) =>
      form
        ? form
            .get('categorizations')
            .map(categorization => categorization.getIn(['category', 'slug']))
        : [],
    serialize: ({ values }) =>
      values.get('categorizations').map(slug => ({ category: { slug } })),
  },
];

export const FormForm = ({
  formKey,
  addFields,
  alterFields,
  fieldSet,
  components,
  onSave,
  onError,
  children,
  formSlug,
  kappSlug = null, // Setting to null because CoreAPI will try to use bundle.kappSlug if undefined
  datastore,
}) => (
  <Form
    formKey={formKey}
    addFields={addFields}
    alterFields={alterFields}
    fieldSet={fieldSet}
    components={components}
    onSubmit={handleSubmit({ formSlug, kappSlug, datastore })}
    onSave={onSave}
    onError={onError}
    dataSources={dataSources({ formSlug, kappSlug, datastore })}
    fields={fields({ formSlug, kappSlug, datastore })}
  >
    {children}
  </Form>
);
