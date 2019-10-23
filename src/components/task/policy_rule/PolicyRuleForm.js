import React from 'react';
import t from 'prop-types';
import { Map } from 'immutable';
import {
  createPolicyRule,
  fetchTaskCategories,
  updatePolicyRule,
  fetchPolicyRule,
} from '../../../apis';
import { Form } from '../../form/Form';

const dataSources = ({ policyName, policyType }) => ({
  categories: {
    fn: fetchTaskCategories,
    params: [{ include: 'details' }],
    transform: result => result.categories,
  },
  policyRule: {
    fn: fetchPolicyRule,
    params: policyName && [
      { policyName, policyType, include: 'details,categories' },
    ],
    transform: result => result.policyRule,
  },
});

const handleSubmit = ({ policyName, policyType }) => values =>
  (policyName ? updatePolicyRule : createPolicyRule)({
    policy: values.toJS(),
    policyName,
    policyType,
  }).then(({ policyRule, error }) => {
    if (error) {
      throw (error.statusCode === 400 && error.message) ||
        'There was an error saving the policy rule';
    }
    return policyRule;
  });

const fields = ({ policyName, policyType }) => ({ policyRule }) =>
  (!policyName || policyRule) && [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      initialValue: policyRule ? policyRule.get('name') : '',
      helpText: 'User friendly name for the policy rule.'
    },
    {
      name: 'rule',
      label: 'Rule',
      type: 'text',
      required: true,
      initialValue: policyRule ? policyRule.get('rule') : '',
      helpText: `Ruby expression that is evaluated. If true access is granted. Example: @identity.get_property('spaceAdmin') == 'true'`
    },
    {
      name: 'message',
      label: 'Message',
      type: 'text',
      required: true,
      initialValue: policyRule ? policyRule.get('message') : '',
      helpText: 'Returned to the user if the rule is called and does not pass.'
    },
    policyType === 'Category Access' && {
      name: 'categories',
      label: 'Categories',
      type: 'select-multi',
      required: false,
      options: ({ categories }) =>
        categories
          ? categories.map(category =>
              Map({
                label: category.get('name'),
                value: category.get('name'),
              }),
            )
          : [],
      initialValue: policyRule
        ? policyRule.get('categories').map(category => category.get('name'))
        : [],
      serialize: ({ values }) => values.get('categories').map(name => name),
    },
  ];

export const PolicyRuleForm = ({
  addFields,
  alterFields,
  fieldSet,
  formKey,
  components,
  onSave,
  onError,
  children,
  policyName,
  policyType = 'Category Access',
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
    formOptions={{ policyName, policyType }}
  >
    {children}
  </Form>
);

PolicyRuleForm.propTypes = {
  /** The name of the policy rule being edited. Leave blank if creating a new policy rule */
  policyRuleName: t.string,
  /** The type of the policy rule being created or edited. */
  policyRuleType: t.string,
};
