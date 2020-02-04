import { generateTable } from '../../table/Table';
import { fetchSecurityPolicyDefinitions } from '../../../apis'; // need to replace
import { WEB_API_TYPES } from './WebApiForm';

const dataSource = ({ kappSlug }) => ({
  fn: fetchSecurityPolicyDefinitions, // need to replace
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
    value: 'name',
    title: 'Name',
    filter: 'includes',
    type: 'text',
    sortable: true,
  },
  {
    value: 'type',
    title: 'Type',
    filter: 'exact',
    type: 'select',
    sortable: true,
    // options: WEB_API_TYPES.map(el => ({
    //   value: el,
    //   label: el,
    // })),
  },
];

export const WebApiTable = generateTable({
  columns,
  dataSource,
});

WebApiTable.displayName = 'WebApiTable';
WebApiTable.defaultProps = {
  columns,
};
