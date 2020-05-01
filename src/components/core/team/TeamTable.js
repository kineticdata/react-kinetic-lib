import { generateTable } from '../../table/Table';
import { fetchTeams, generateCESearchParams } from '../../../apis';

const dataSource = () => ({
  fn: fetchTeams,
  params: paramData => [
    {
      ...generateCESearchParams(paramData),
      include: 'authorization,details',
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
    filter: 'startsWith',
    type: 'text',
    sortable: true,
  },
  {
    value: 'updatedAt',
    title: 'Updated',
    filter: 'equals',
    type: 'text',
    sortable: true,
  },
  {
    value: 'createdAt',
    title: 'Created',
    filter: 'startsWith',
    type: 'text',
    sortable: true,
  },
  {
    value: 'description',
    title: 'Description',
    sortable: true,
  },
  {
    value: 'slug',
    title: 'Slug',
    filter: 'startsWith',
    type: 'text',
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
