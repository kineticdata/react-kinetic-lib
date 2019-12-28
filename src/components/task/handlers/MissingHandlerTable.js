import { generateTable } from '../../table/Table';
import { fetchMissingHandlers } from '../../../apis';

const dataSource = () => ({
  fn: fetchMissingHandlers,
  params: () => [],
  transform: result => ({
    data: result.missingHandlers,
  }),
  clientSideSearch: true,
});

const columns = [
  {
    value: 'definitionId',
    title: 'Handler Definition Id',
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

export const MissingHandlerTable = generateTable({
  tableOptions: [],
  columns,
  dataSource,
});

MissingHandlerTable.displayName = 'MissingHandlerTable';
