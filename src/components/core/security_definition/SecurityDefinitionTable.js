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
    filterable: false,
    sortable: false,
  },
  {
    value: 'name',
    title: 'Name',
    filterable: true,
    sortable: true,
  },
  {
    value: 'rule',
    title: 'Rule',
    filterable: false,
    sortable: false,
  },
  {
    value: 'type',
    title: 'Type',
    filterable: true,
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
