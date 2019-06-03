import React from 'react';
import { get, getIn } from 'immutable';

import { Form } from '../form/Form';
import { fetchKapp, fetchSpace } from '../../../apis/core';
import { fetchAttributeDefinitions } from '../../../apis/core/attributeDefinitions';
import { createKapp, updateKapp } from '../../../apis/core/kapps';
import { slugify } from '../../../helpers';

const DISPLAY_TYPES = ['Display Page', 'Redirect'];

const dataSources = ({ kappSlug }) => ({
  space: [
    fetchSpace,
    [{ include: 'attributesMap' }],
    { transform: result => result.space },
  ],
  kapp: [
    fetchKapp,
    [{ kappSlug, include: 'attributesMap,details' }],
    {
      transform: result => result.kapp,
      runIf: () => !!kappSlug,
    },
  ],
  attributeDefinitions: [
    fetchAttributeDefinitions,
    [{ kappSlug, attributeType: 'kappAttributeDefinitions' }],
    {
      transform: result => result.attributeDefinitions,
      runIf: () => !!kappSlug,
    },
  ],
});

const handleSubmit = ({ kappSlug }) => values => {
  const kapp = values.toJS();
  return kappSlug
    ? updateKapp({
        kappSlug,
        kapp,
      })
    : createKapp({
        kapp,
      });
};

const fields = ({ attributeFields, kappSlug }) => [
  {
    name: 'afterLogoutPath',
    label: 'After Logout Path',
    type: 'text',
    initialValue: ({ kapp }) => get(kapp, 'afterLogoutPath'),
  },
  {
    name: 'bundlePath',
    label: 'Bundle Path',
    type: 'text',
    initialValue: ({ kapp }) => get(kapp, 'bundlePath'),
  },
  {
    name: 'defaultFormConfirmationPage',
    label: 'Form Confirmation Page',
    type: 'text',
    initialValue: ({ kapp }) => get(kapp, 'defaultFormConfirmationPage'),
  },
  {
    name: 'defaultFormDisplayPage',
    label: 'Form Display Page',
    type: 'text',
    initialValue: ({ kapp }) => get(kapp, 'defaultFormDisplayPage'),
  },
  {
    name: 'defaultSubmissionLabelExpression',
    label: 'Submission Label',
    type: 'text',
    initialValue: ({ kapp }) => get(kapp, 'defaultSubmissionLabelExpression'),
  },
  {
    name: 'displayType',
    label: 'Display Type',
    type: 'select',
    options: DISPLAY_TYPES.map(displayType => ({
      value: displayType,
      label: displayType,
    })),
    initialValue: ({ kapp }) => get(kapp, 'displayType') || 'Display Page',
  },
  {
    name: 'displayValue',
    label: ({ values }) =>
      values.get('displayType') === 'Redirect'
        ? 'Redirect URL'
        : 'Kapp Display Page',
    type: 'text',
    initialValue: ({ kapp }) => get(kapp, 'displayValue'),
    required: ({ values }) => values.get('displayType') === 'Redirect',
    requiredMessage: "This field is required, when display type is 'Redirect'",
  },
  {
    name: 'loginPage',
    label: 'Login Page',
    type: 'text',
    initialValue: ({ kapp }) => get(kapp, 'loginPage'),
  },
  {
    name: 'name',
    label: 'Kapp Name',
    type: 'text',
    required: true,
    initialValue: ({ kapp }) => get(kapp, 'name'),
    onChange: ({ values }, { setValue }) => {
      if (values.get('linked')) {
        setValue('slug', slugify(values.get('name')), false);
      }
    },
  },
  {
    name: 'resetPasswordPage',
    label: 'Reset Password Page',
    type: 'text',
    initialValue: ({ kapp }) => get(kapp, 'resetPasswordPage'),
  },
  {
    name: 'slug',
    label: 'Slug',
    type: 'text',
    required: true,
    initialValue: ({ kapp }) => get(kapp, 'slug'),
    onChange: ({}, { setValue }) => {
      setValue('linked', false);
    },
  },
  {
    name: 'linked',
    label: 'Linked',
    type: 'checkbox',
    transient: true,
    initialValue: true,
    visible: false,
  },
  kappSlug &&
    (attributeFields
      ? Object.entries(attributeFields).map(([name, config]) => ({
          name: `attributesMap.${name}`,
          label: get(config, 'label', name),
          type: get(config, 'type', 'text'),
          required: get(config, 'required', false),
          initialValue: ({ kapp }) =>
            getIn(kapp, ['attributesMap', 'name'], config.initialValue),
        }))
      : {
          name: 'attributesMap',
          label: 'Attributes',
          type: 'attributes',
          required: false,
          options: ({ attributeDefinitions }) => attributeDefinitions,
          initialValue: ({ kapp }) => get(kapp, 'attributesMap'),
        }),
];

export const KappForm = props => (
  <Form
    formKey={props.formKey}
    components={props.components}
    onSubmit={handleSubmit({ kappSlug: props.kappSlug })}
    onSave={props.onSave}
    onError={props.onError}
    dataSources={dataSources({ kappSlug: props.kappSlug })}
    fields={fields({ slug: props.kappSlug })}
  >
    {props.children}
  </Form>
);
