import { generateTable } from '../../table/Table';
import { fetchContexts } from '../../../apis';

const dataSource = () => ({
  fn: fetchContexts,
  params: paramData => [
    {
      include: 'authorization,details',
      expected: true,
    },
  ],
  transform: result => ({
    data: result.contexts,
    nextPageToken: result.nextPageToken,
  }),
});

const columns = [
  {
    value: 'kapp',
    title: 'Kapp Name',
    filter: 'startsWith',
    type: 'text',
    sortable: true,
  },
  {
    value: 'form',
    title: 'Form Name',
    filter: 'startsWith',
    type: 'text',
    sortable: true,
  },
  {
    value: 'name',
    title: 'Context Name',
    filter: 'startsWith',
    type: 'text',
    sortable: true,
  },
];

export const ContextTable = generateTable({
  columns,
  dataSource,
});

ContextTable.displayName = 'ContextTable';
