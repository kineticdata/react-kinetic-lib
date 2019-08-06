import { generateTable } from '../../table/Table';
import { fetchCategories } from '../../../apis';

const dataSource = ({ kappSlug }) => ({
  fn: fetchCategories,
  clientSideSearch: true,
  params: () => [{ include: 'details', kappSlug }],
  transform: result => ({ data: result.categories }),
});

const columns = [
  {
    value: 'name',
    title: 'Name',
    filterable: true,
    sortable: true,
  },
  {
    value: 'slug',
    title: 'Slug',
    filterable: false,
    sortable: true,
  },
  {
    value: 'createdAt',
    title: 'Created At',
    filterable: false,
    sortable: true,
  },
  {
    value: 'createdBy',
    title: 'Created By',
    filterable: false,
    sortable: true,
  },
  {
    value: 'updatedAt',
    title: 'Updated At',
    filterable: false,
    sortable: true,
  },
  {
    value: 'updatedBy',
    title: 'Updated By',
    filterable: false,
    sortable: true,
  },
];

export const CategoryTable = generateTable({
  tableOptions: ['kappSlug'],
  columns,
  dataSource,
});

CategoryTable.displayName = 'CategoryTable';
