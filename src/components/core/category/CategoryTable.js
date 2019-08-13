import t from 'prop-types';
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
    value: 'createdAt',
    title: 'Created At',
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
    title: 'Updated At',
    sortable: true,
  },
  {
    value: 'updatedBy',
    title: 'Updated By',
    sortable: true,
  },
];

export const CategoryTable = generateTable({
  tableOptions: ['kappSlug'],
  columns,
  dataSource,
});
CategoryTable.propTypes = {
  /** The Slug of the kapp to display categories for */
  kappSlug: t.string.isRequired,
};
CategoryTable.displayName = 'CategoryTable';
