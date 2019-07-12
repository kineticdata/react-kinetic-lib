import React from 'react';
import {
  createWebhook,
  fetchWebhook,
  fetchKappWebhookEvents,
  fetchSpaceWebhookEvents,
  updateWebhook,
} from '../../../apis/core';
import { Form } from '../form/Form';

const dataSources = ({ kappSlug, name }) => ({
  webhook: [
    fetchWebhook,
    [{ kappSlug, webhookName: name }],
    { transform: result => result.webhook, runIf: () => !!name },
  ],
  events: [kappSlug ? fetchKappWebhookEvents : fetchSpaceWebhookEvents],
});

const handleSubmit = ({ kappSlug, name }) => values =>
  (name ? updateWebhook : createWebhook)({
    webhook: values.toJS(),
    kappSlug,
    webhookName: name,
  }).then(({ webhook, error }) => {
    if (error) {
      throw (error.statusCode === 400 && error.message) ||
        'There was an error saving the webhook';
    }
    return webhook;
  });

const fields = ({ kappSlug, name }) => [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    required: true,
    initialValue: ({ webhook }) => (webhook ? webhook.get('name') : ''),
  },
  {
    name: 'type',
    label: 'Type',
    type: 'select',
    required: true,
    initialValue: ({ webhook }) => (webhook ? webhook.get('type') : ''),
    options: ({ events }) =>
      events
        .keySeq()
        .sort()
        .map(type => ({ label: type, value: type })),
    onChange: ({}, { setValue }) => {
      setValue('event', '');
    },
  },
  {
    name: 'event',
    label: 'Event',
    type: 'select',
    required: true,
    initialValue: ({ webhook }) => (webhook ? webhook.get('event') : ''),
    options: ({ values, events }) =>
      events
        .get(values.get('type'), [])
        .map(event => ({ label: event, value: event })),
  },
  {
    name: 'filter',
    label: 'Filter',
    type: 'text',
    initialValue: ({ webhook }) => (webhook ? webhook.get('filter') : ''),
  },
  {
    name: 'url',
    label: 'URL',
    type: 'text',
    required: true,
    initialValue: ({ webhook }) => (webhook ? webhook.get('url') : ''),
  },
  {
    name: 'authStrategy',
    label: 'Authentication Strategy',
    type: 'radio',
    options: [
      { label: 'None', value: '' },
      { label: 'Signature', value: 'Signature' },
    ],
    onChange: ({ values }, { setValue }) => {
      // Do not reset the change secret field for new webhooks because it will
      // be hidden and should remain true because secret should always be
      // applied for new webhooks.
      if (values.get('authStrategy') !== 'Signature' && !!name) {
        setValue('changeSecret', false);
      }
    },
    initialValue: ({ webhook }) =>
      webhook && webhook.getIn(['authStrategy', 'type']) === 'Signature'
        ? 'Signature'
        : '',
    serialize: ({ values }) =>
      values.get('authStrategy') === 'Signature'
        ? {
            type: 'Signature',
            properties: [
              { name: 'Key', value: values.get('key') },
              values.get('changeSecret')
                ? {
                    name: 'Secret',
                    sensitive: true,
                    value: values.get('secret'),
                  }
                : { name: 'Secret', sensitive: true },
            ],
          }
        : null,
  },
  {
    name: 'key',
    label: 'Key',
    type: 'text',
    transient: true,
    required: ({ values }) => values.get('authStrategy') === 'Signature',
    visible: ({ values }) => values.get('authStrategy') === 'Signature',
    initialValue: ({ webhook }) =>
      webhook && webhook.getIn(['authStrategy', 'type']) === 'Signature'
        ? webhook
            .getIn(['authStrategy', 'properties'])
            .find(property => property.get('name') === 'Key')
            .get('value')
        : '',
  },
  {
    name: 'secret',
    label: 'Secret',
    type: 'password',
    transient: true,
    visible: ({ values }) =>
      values.get('authStrategy') === 'Signature' && values.get('changeSecret'),
  },
  // Change secret drives whether or not the secret field should be visible and
  // applied when saving. For new webhooks the secret field should always be
  // applied so this field defaults to true (because it still drives the other
  // conditions) but does not need to be visible.
  {
    name: 'changeSecret',
    label: 'Change Secret',
    type: 'checkbox',
    transient: true,
    visible: ({ values }) =>
      !!name && values.get('authStrategy') === 'Signature',
    initialValue: !name,
  },
];

export const WebhookForm = ({
  addFields,
  alterFields,
  fieldSet,
  formKey,
  components,
  onSave,
  onError,
  children,
  ...formOptions
}) => (
  <Form
    addFields={addFields}
    alterFields={alterFields}
    fieldSet={fieldSet}
    formKey={formKey}
    components={components}
    onSubmit={handleSubmit(formOptions)}
    onSave={onSave}
    onError={onError}
    dataSources={dataSources(formOptions)}
    fields={fields(formOptions)}
  >
    {children}
  </Form>
);
