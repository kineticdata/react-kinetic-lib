import { generateTable } from '../../table/Table';
import { fetchAgentHandlers } from '../../../apis';

const dataSource = () => ({
  fn: fetchAgentHandlers,
  clientSideSearch: true,
  params: () => [
    {
      include: 'details',
    },
  ],
  transform: result => ({
    data: result.handlers,
  }),
});

const columns = [
  {
    value: 'slug',
    title: 'Slug',
    filter: 'startsWith',
    type: 'text',
    sortable: true,
  },
  {
    value: 'definitionId',
    title: 'Handler Adapter',
    filter: 'startsWith',
    type: 'text',
    sortable: true,
  },
];

export const AgentHandlerTable = generateTable({
  columns,
  dataSource,
});

AgentHandlerTable.displayName = 'AgentHandlerTable';
