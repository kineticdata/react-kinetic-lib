import { generateTable } from '../../table/Table';
import { fetchKapps, generateCESearchParams } from '../../../apis';

const dataSource = () => ({
  fn: fetchKapps,
  params: paramData => [
    {
      include: 'details',
      ...generateCESearchParams(paramData),
    },
  ],
  transform: result => ({
    data: result.kapps,
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
    title: 'Created At',
    sortable: true,
  },
  {
    value: 'createdBy',
    title: 'Created By',
  },
  {
    value: 'updatedAt',
    title: 'Updated At',
    sortable: true,
  },
  {
    value: 'updatedBy',
    title: 'Updated By',
  },
  {
    value: 'resetPasswordPage',
    title: 'Reset Password Page',
  },

  { value: 'afterLogoutPath', title: 'After Logout Path' },
  { value: 'bundlePath', title: 'Bundle Path' },
  { value: 'defaultFormConfirmationPage', title: 'Form Confirmation Page' },
  { value: 'defaultFormDisplayPage', title: 'Form Display Page' },
  { value: 'defaultSubmissionLabelExpression', title: 'Submission Label' },
  { value: 'displayType', title: 'Display Type' },
  { value: 'displayValue', title: 'Display Value' },
  { value: 'loginPage', title: 'Login Page' },
  { value: 'resetPasswordPage', title: 'Reset Password Page' },
];

export const KappTable = generateTable({
  columns,
  dataSource,
});

KappTable.displayName = 'KappTable';
KappTable.defaultProps = {
  columns,
};
