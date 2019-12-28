import { generateTable } from '../../table/Table';
import { fetchMissingRoutines } from '../../../apis';

const dataSource = () => ({
  fn: fetchMissingRoutines,
  params: () => [],
  transform: result => ({
    data: result.missingRoutines,
  }),
  clientSideSearch: true,
});

const columns = [
  {
    value: 'definitionId',
    title: 'Routine Definition Id',
    sortable: true,
  },
  {
    value: 'treeCount',
    title: 'Trees',
    sortable: true,
  },
  {
    value: 'routineCount',
    title: 'Routines',
    sortable: true,
  },
  {
    value: 'totalNodeCount',
    title: 'Nodes',
    sortable: true,
  },
];

export const MissingRoutineTable = generateTable({
  tableOptions: [],
  columns,
  dataSource,
});

MissingRoutineTable.displayName = 'MissingRoutineTable';
