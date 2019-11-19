import { generateTable } from '../../table/Table';
import { fetchSecurityPolicyDefinitions } from '../../../apis';
import {
  KAPP_SECURITY_DEFINITION_TYPES,
  SPACE_SECURITY_DEFINITION_TYPES,
} from './SecurityDefinitionForm';

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
    filter: 'equals',
    type: 'text',
    sortable: true,
    options: kappSlug =>
      kappSlug.kappSlug
        ? KAPP_SECURITY_DEFINITION_TYPES.map(el => ({
            value: el,
            label: el,
          }))
        : SPACE_SECURITY_DEFINITION_TYPES.map(el => ({
            value: el,
            label: el,
          })),
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
