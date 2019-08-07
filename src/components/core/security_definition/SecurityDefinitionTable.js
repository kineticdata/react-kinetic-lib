import { generateTable } from '../../table/Table';
import { fetchSecurityPolicyDefinitions } from '../../../apis';

const dataSource = ({ kappSlug }) => ({
  fn: fetchSecurityPolicyDefinitions,
  clientSideSearch: true,
  params: () => [
    {
      include: 'details',
      kappSlug,
    },
  ],
  transform: result => ({
    data: result.securityPolicyDefinitions,
  }),
});

const columns = [
  {
    value: 'message',
    title: 'Message',
    sortable: false,
  },
  {
    value: 'name',
    title: 'Name',
    filter: 'startsWith',
    type: 'text',
    sortable: true,
  },
  {
    value: 'rule',
    title: 'Rule',
    sortable: false,
  },
  {
    value: 'type',
    title: 'Type',
    filter: 'startsWith',
    type: 'text',
    sortable: true,
  },
];

export const SecurityDefinitionTable = generateTable({
  tableOptions: ['kappSlug'],
  columns,
  dataSource,
});

SecurityDefinitionTable.displayName = 'SecurityDefinitionTable';
SecurityDefinitionTable.defaultProps = {
  columns,
};
