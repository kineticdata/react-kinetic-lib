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
    title: 'Type',
    type: 'text',
    sortable: true,
  },
  {
    value: 'createdAt',
    title: 'Occurred',
    type: 'text',
    sortable: true,
  },
  {
    value: 'createdBy',
    title: 'Created By',
    type: 'text',
    sortable: true,
  },
  {
    value: 'engineIdentification',
    title: 'Engine ID',
    type: 'text',
    sortable: true,
  },
  {
    value: 'status',
    title: 'Status',
    type: 'text',
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
    title: 'ID',
    type: 'text',
    sortable: true,
  },
  {
    value: 'updatedAt',
    title: 'Updated At',
    type: 'text',
    sortable: true,
  },
  {
    value: 'updatedBy',
    title: 'Updated By',
    type: 'text',
    sortable: true,
  },
];

export const SystemErrorsTable = generateTable({
  columns,
  dataSource,
});
SystemErrorsTable.propTypes = {};
SystemErrorsTable.displayName = 'SystemErrorsTable';
