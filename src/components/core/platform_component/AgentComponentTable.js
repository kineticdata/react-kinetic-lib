import { generateTable } from '../../table/Table';
import { fetchAgentComponents } from '../../../apis';

const dataSource = () => ({
  fn: fetchAgentComponents,
  clientSideSearch: true,
  params: () => [{ include: 'platformComponents' }],
  transform: result => ({
    data: result.agents,
  }),
});

const columns = [
  {
    value: 'slug',
    title: 'Agent Slug',
    sortable: true,
  },
  {
    value: 'url',
    title: 'Agent Url',
    sortable: false,
  },
];

export const AgentComponentTable = generateTable({
  columns,
  dataSource,
});

AgentComponentTable.displayName = 'AgentComponentTable';
AgentComponentTable.defaultProps = {
  columns,
};
