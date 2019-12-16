import { generateTable } from '../../table/Table';
import { fetchAgentHandlers } from '../../../apis';

const dataSource = ({ agentSlug }) => ({
  fn: fetchAgentHandlers,
  clientSideSearch: true,
  params: () => [
    {
      agentSlug,
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
    filter: 'includes',
    type: 'text',
    sortable: true,
  },
  {
    value: 'definitionId',
    title: 'Handler Adapter',
    filter: 'includes',
    type: 'text',
    sortable: true,
  },
];

export const AgentHandlerTable = generateTable({
  tableOptions: ['agentSlug'],
  columns,
  dataSource,
});

AgentHandlerTable.displayName = 'AgentHandlerTable';
