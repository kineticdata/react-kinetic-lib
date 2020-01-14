import { generateTable } from '../../table/Table';
import { fetchSystemErrors } from '../../../apis';

const dataSource = () => ({
  fn: fetchSystemErrors,
  clientSideSearch: true,
  params: () => [{ include: 'details' }],
  transform: result => ({ data: result.systemErrors }),
});

const columns = [
  {
    value: 'summary',
    title: 'System Error',
    type: 'text',
    sortable: false,
  },
  {
    value: 'type',
    title: 'Error Type',
    type: 'text',
    filter: 'startsWith',
    sortable: true,
  },
  {
    value: 'createdAt',
    title: 'Occurred',
    type: 'text',
    filter: 'startsWith',
    sortable: true,
  },
  {
    value: 'createdBy',
    title: 'Created By',
    type: 'text',
    filter: 'startsWith',
    sortable: true,
  },
  {
    value: 'status',
    title: 'Status',
    type: 'select',
    filter: 'startsWith',
    initialValue: 'Active',
    options: () =>
      ['Active', 'Handled'].map(s => ({
        value: s,
        label: s,
      })),
    sortable: true,
  },
  {
    value: 'text',
    title: 'Text',
    type: 'text',
    sortable: false,
  },
  {
    value: 'id',
    title: 'Error ID',
    type: 'text',
    filter: 'includes',
    sortable: true,
  },
  {
    value: 'updatedAt',
    title: 'Updated At',
    type: 'text',
    filter: 'startsWith',
    sortable: true,
  },
  {
    value: 'updatedBy',
    title: 'Updated By',
    type: 'text',
    filter: 'startsWith',
    sortable: true,
  },
];

export const SystemErrorsTable = generateTable({
  columns,
  dataSource,
});
SystemErrorsTable.propTypes = {};
SystemErrorsTable.displayName = 'SystemErrorsTable';
