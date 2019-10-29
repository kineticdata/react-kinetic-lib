import React from 'react';
import { Form } from '../../form/Form';
import { createFormType, updateFormType, fetchFormType } from '../../../apis';

const dataSources = ({ kappSlug, name }) => ({
  formType: {
    fn: fetchFormType,
    params: name && [{ kappSlug, name, include: 'details' }],
    transform: result => result.formType,
  },
});

const handleSubmit = ({ kappSlug, name }) => values =>
  (name ? updateFormType : createFormType)({
    formType: values.toJS(),
    kappSlug,
    name,
  }).then(({ formType, error }) => {
    if (error) {
      throw (error.statusCode === 400 && error.message) ||
        'There was an error saving the form type';
    }
    return formType;
  });

const fields = ({ name }) => ({ formType }) =>
  (!name || formType) && [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      initialValue: formType ? formType.get('name') : '',
      helpText: 'User friendly name for the form type.',
    },
  ];

export const FormTypeForm = ({
  addFields,
  alterFields,
  fieldSet,
  formKey,
  components,
  onSave,
  onError,
  children,
  kappSlug,
  name,
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
    formOptions={{ kappSlug, name }}
  >
    {children}
  </Form>
);
