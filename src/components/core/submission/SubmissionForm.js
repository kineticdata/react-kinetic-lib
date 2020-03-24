import { Set } from 'immutable';
import { generateForm } from '../../form/Form';
import * as helpers from './submissionFormHelpers';

const dataSources = formOptions =>
  helpers.fetchFormOrSubmission(formOptions).then(({ form, submission }) => ({
    form: {
      fn: () => form,
      params: [],
    },
    submission: {
      fn: () => submission,
      params: [],
    },
    page: {
      fn: helpers.determinePage,
      params: ({ form, submission }) => form && [form, submission],
    },
    fieldsAll: {
      fn: form => helpers.getFieldElements(form.get('pages')),
      params: ({ form }) => form && [form],
    },
    fieldsCurrent: {
      fn: (fields, page) => {
        const pageFields = helpers.getFieldElements(page.get('elements'));
        return fields
          .filter(field => pageFields.includes(field))
          .reduce((set, field) => set.add(field), Set());
      },
      params: ({ fieldsAll, page }) => fieldsAll && page && [fieldsAll, page],
    },
  }));

const fields = formOptions => ({ fieldsAll, fieldsCurrent, submission }) =>
  fieldsAll &&
  fieldsCurrent &&
  fieldsAll.map(fieldElement => ({
    label: fieldElement.get('name'),
    name: fieldElement.get('name'),
    type: 'text',
    visible: ({ fieldsCurrent }) => fieldsCurrent.includes(fieldElement),
    initialValue: submission
      ? submission.getIn(['values', fieldElement.get('name')])
      : '',
  }));

const handleSubmit = formOptions => (values, { form, submission }, actions) => {
  helpers
    .saveSubmission({ form, submission, values })
    .then(updated => actions.setDataSource('submission', updated));
};

export const SubmissionForm = generateForm({
  formOptions: ['datastore', 'formSlug', 'id', 'kappSlug'],
  dataSources,
  fields,
  handleSubmit,
});
