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
  }));

const fields = formOptions => ({ page }) =>
  page &&
  helpers.getFieldElements(page.get('elements')).map(fieldElement => ({
    label: fieldElement.get('name'),
    name: fieldElement.get('name'),
    type: 'text',
  }));

const handleSubmit = ({ datastore, formSlug, id, kappSlug }) => (
  values,
  bindings,
  actions,
) => {
  console.log('handleSubmit', {
    id,
    values,
    bindings,
    actions,
  });
};

export const SubmissionForm = generateForm({
  formOptions: ['datastore', 'formSlug', 'id', 'kappSlug'],
  dataSources,
  fields,
  handleSubmit,
});
