import { generateForm } from '../../form/Form';
import { fetchForm, fetchSubmission } from '../../../apis';
import { getFieldElements } from './submissionFormHelpers';

const formIncludes = 'bridgedResources,pages';
const submissionIncludes = 'form.bridgedResources,form.pages,values';

const dataSources = ({ datastore, formSlug, id, kappSlug }) =>
  (id
    ? fetchSubmission({ id, include: submissionIncludes })
    : fetchForm({ datastore, formSlug, kappSlug, include: formIncludes })
  ).then(data => {
    const form = id ? data.submission.form : data.form;
    return {
      _fields: {
        fn: () => getFieldElements(form.pages[0].elements),
        params: [],
      },
      _values: {
        fn: () => (id ? data.submission.values : {}),
        params: [],
      },
    };
  });

const fields = formOptions => ({ _fields }) =>
  _fields &&
  _fields.map(fieldElement => ({
    label: fieldElement.get('name'),
    name: fieldElement.get('name'),
    type: 'text',
  }));

const handleSubmit = formOptions => (values, ...args) => {
  console.log('handleSubmit', {
    formOptions,
    values,
    args,
  });
};

export const SubmissionForm = generateForm({
  formOptions: ['datastore', 'formSlug', 'id', 'kappSlug'],
  dataSources,
  fields,
  handleSubmit,
});
