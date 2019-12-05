import { generateTable } from '../../table/Table';
import { fetchBridges } from '../../../apis';

const dataSource = ({ agentSlug }) => ({
  fn: fetchBridges,
  clientSideSearch: true,
  params: paramData => [
    {
      agentSlug: agentSlug
        ? agentSlug
        : paramData.filters.getIn(['agentSlug', 'value']),
      include: 'details',
    },
  ],
  transform: (result, filters) => ({
    data: result.bridges,
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
    value: 'slug',
    title: 'Slug',
    filter: 'startsWith',
    type: 'text',
    sortable: true,
  },
  {
    value: 'adapterClass',
    title: 'Adapter Class',
    filter: 'startsWith',
    type: 'text',
    sortable: true,
  },
  {
    value: 'agentSlug',
    title: 'Agent Slug',
    filter: 'equals',
    type: 'text',
    sortable: false,
  },
];

export const BridgeTable = generateTable({
  tableOptions: ['agentSlug'],
  columns,
  dataSource,
});

BridgeTable.displayName = 'BridgeTable';
