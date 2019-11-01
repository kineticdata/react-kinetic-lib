import { generateTable } from '../../table/Table';
import { fetchForms, generateCESearchParams } from '../../../apis';
import t from 'prop-types';

const VALID_FORM_STATUES = ['New', 'Active', 'Inactive', 'Delete'].map(s => ({
  value: s,
  label: s,
}));

const dataSource = ({ kappSlug = null, datastore }) => ({
  fn: fetchForms,
  params: paramData => [
    {
      ...generateCESearchParams(paramData),
      include: `details${datastore ? ',indexDefinitions' : ''}`,
      datastore,
      kappSlug,
    },
  ],
  transform: result => ({
    data: result.forms,
    nextPageToken: result.nextPageToken,
  }),
});

const columns = [
  {
    value: 'name',
    title: 'Name',
    filter: 'startsWith',
    type: 'text',
    sortable: true,
  },
  {
    value: 'slug',
    title: 'Slug',
    filter: 'startsWith',
    type: 'text',
    sortable: true,
  },
  {
    value: 'CreatedAt',
    title: 'Created',
    sortable: true,
    filter: 'equals',
    type: 'text',
  },
  {
    value: 'createdBy',
    title: 'Created By',
  },
  {
    value: 'updatedAt',
    title: 'Updated',
    sortable: true,
    filter: 'equals',
    type: 'text',
  },
  {
    value: 'updatedBy',
    title: 'Updated By',
    sortable: true,
  },
  {
    value: 'notes',
    title: 'Notes',
  },
  {
    value: 'status',
    title: 'Status',
    sortable: true,
    filter: 'startsWith',
    type: 'text',
    options: () => VALID_FORM_STATUES,
  },
  {
    value: 'type',
    title: 'Type',
    sortable: true,
    filter: 'startsWith',
    type: 'text',
  },
  { value: 'submissionLabelExpression', title: 'Submission Label' },
];

export const FormTable = generateTable({
  tableOptions: ['kappSlug', 'datastore'],
  columns,
  dataSource,
});

FormTable.defaultProps = {};
FormTable.displayName = 'FormTable';
FormTable.propTypes = {
  /** Kapp Slug of associated forms to render.  */
  kappSlug: t.string,
  /** If datastore forms should be rendered.  */
  datastore: t.bool,
};
