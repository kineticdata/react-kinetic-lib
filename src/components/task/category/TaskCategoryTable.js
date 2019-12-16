import { generateTable } from '../../table/Table';
import { fetchTaskCategories } from '../../../apis';

const dataSource = () => ({
  fn: fetchTaskCategories,
  clientSideSearch: true,
  params: () => [{ include: 'details' }],
  transform: result => ({ data: result.categories }),
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
    value: 'description',
    title: 'Description',
    type: 'text',
  },
  {
    value: 'type',
    title: 'Type',
    filter: 'startsWith',
    type: 'text',
    sortable: true,
  },
  {
    value: 'id',
    title: 'Id',
    filter: 'startsWith',
    type: 'text',
    sortable: true,
  },
  {
    value: 'createdAt',
    title: 'Created',
    filter: 'equals',
    type: 'text',
    sortable: true,
  },
  {
    value: 'createdBy',
    title: 'Created By',
    sortable: true,
  },
  {
    value: 'updatedAt',
    title: 'Updated',
    sortable: true,
  },
  {
    value: 'updatedBy',
    title: 'Updated By',
    sortable: true,
  },
];

export const TaskCategoryTable = generateTable({
  tableOptions: [],
  columns,
  dataSource,
});
TaskCategoryTable.propTypes = {};
TaskCategoryTable.displayName = 'TaskCategoryTable';
