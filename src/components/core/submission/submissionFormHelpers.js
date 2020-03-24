import { get, getIn, has, List } from 'immutable';
import { fetchForm, fetchSubmission } from '../../../apis';

export const fetchFormOrSubmission = ({ datastore, formSlug, id, kappSlug }) =>
  (id
    ? fetchSubmission({
        id,
        include: 'form.bridgedResources,form.pages,values',
      })
    : fetchForm({
        datastore,
        formSlug,
        kappSlug,
        include: 'bridgedResources,pages',
      })
  ).then(data => ({
    form: id ? data.submission.form : data.form,
    submission: id ? data.submission : null,
  }));

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
