import { get, getIn, has, List } from 'immutable';
import {
  createSubmission,
  fetchForm,
  fetchSubmission,
  updateSubmission,
} from '../../../apis';

export const fetchFormOrSubmission = ({ datastore, formSlug, id, kappSlug }) =>
  (id
    ? fetchSubmission({
        id,
        include: 'form,form.bridgedResources,form.pages,values',
      })
    : fetchForm({
        datastore,
        formSlug,
        kappSlug,
        include: 'bridgedResources,kapp,pages',
      })
  ).then(data => ({
    form: id ? data.submission.form : data.form,
    submission: id ? data.submission : null,
  }));

export const saveSubmission = ({ form, submission, values }) => {
  const saveFn = submission ? updateSubmission : createSubmission;
  const params = submission
    ? { id: get(submission, 'id') }
    : {
        formSlug: get(form, 'slug'),
        kappSlug: getIn(form, ['kapp', 'slug']),
      };
  const nextPageIndex = submission
    ? form
        .get('pages')
        .findIndex(page => page.get('name') === submission.get('currentPage')) +
      1
    : 1;
  return saveFn({
    ...params,
    completed: nextPageIndex === form.get('pages').size,
    currentPage: {
      name:
        nextPageIndex === form.get('pages').size
          ? null
          : form.getIn(['pages', nextPageIndex, 'name']),
    },
    values,
    include: 'values',
  }).then(data => data.submission);
};

// given a form definition and an optional submission, this helper function
// returns the page that should be shown
export const determinePage = (form, submission) => {
  const firstPage = getIn(form, ['pages', 0]);
  const matchesCurrentPage = page =>
    get(page, 'name') === get(submission, 'currentPage');
  return !submission || get(submission, 'currentPage') === null
    ? firstPage
    : List(get(form, 'pages')).find(matchesCurrentPage, firstPage);
};

// recursively traverses elements list looking for field elements, makes
// recursive call when it encounters a section element
export const getFieldElements = elements =>
  List(elements)
    .flatMap(element =>
      has(element, 'elements')
        ? getFieldElements(get(element, 'elements'))
        : List.of(element),
    )
    .filter(element => get(element, 'type') === 'field')
    .toArray();
