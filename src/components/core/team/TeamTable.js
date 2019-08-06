import { Map } from 'immutable';
import { generateTable } from '../../table/Table';
import { fetchTeams } from '../../../apis';

const startsWith = (field, value) => `${field} =* "${value}"`;
const equals = (field, value) => `${field} = "${value}"`;
const STARTS_WITH_FIELDS = [
  'createdAt',
  'localName',
  'name',
  'updatedAt',
  'parentName',
];

const teamFilter = filters => {
  const q = Map(filters)
    .filter(filter => filter.value !== '')
    .map((filter, key) =>
      STARTS_WITH_FIELDS.includes(key)
        ? startsWith(key, filter.value)
        : equals(key, filter.value),
    )
    .toIndexedSeq()
    .toList()
    .join(' AND ');

  return q.length > 0 ? { q } : {};
};

const dataSource = () => ({
  fn: fetchTeams,
  params: ({ pageSize, filters }) => [
    {
      include: 'details',
      limit: pageSize,
      ...teamFilter(filters),
    },
  ],
  transform: result => ({
    data: result.teams,
    nextPageToken: result.nextPageToken,
  }),
});

const columns = [
  {
    value: 'name',
    title: 'Name',
    filterable: true,
    sortable: true,
  },
  {
    value: 'updatedAt',
    title: 'Updated At',
    filterable: true,
    sortable: true,
  },
  {
    value: 'createdAt',
    title: 'Created At',
    filterable: true,
    sortable: true,
  },
  {
    value: 'description',
    title: 'Description',
    filterable: true,
    sortable: true,
  },
  {
    value: 'slug',
    title: 'Slug',
    filterable: true,
    sortable: true,
  },
];

export const TeamTable = generateTable({
  columns,
  dataSource,
});

TeamTable.displayName = 'TeamTable';
TeamTable.defaultProps = {
  columns,
};
