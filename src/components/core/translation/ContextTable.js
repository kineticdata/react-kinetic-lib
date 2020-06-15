import { generateTable } from '../../table/Table';
import { fetchContexts } from '../../../apis';
import { defineFilter } from '../../../helpers';

const clientSide = defineFilter(true)
  .startsWith('kapp', 'kapp')
  .startsWith('form', 'form')
  .startsWith('name', 'context')
  .end();

const dataSource = () => ({
  fn: fetchContexts,
  clientSide,
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

const filters = () => () => [
  { name: 'kapp', label: 'Kapp', type: 'text' },
  { name: 'form', label: 'Form', type: 'text' },
  { name: 'context', label: 'Context', type: 'text' },
];

const columns = [
  {
    value: 'kapp',
    title: 'Kapp Name',
    sortable: true,
  },
  {
    value: 'form',
    title: 'Form Name',
    sortable: true,
  },
  {
    value: 'name',
    title: 'Context Name',
    sortable: true,
  },
];

export const ContextTable = generateTable({
  columns,
  filters,
  dataSource,
});

ContextTable.displayName = 'ContextTable';
